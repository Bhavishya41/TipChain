import { BrowserProvider, Contract, parseUnits, Signature, hexlify, randomBytes, TypedDataEncoder } from "ethers"
import { UGFClient } from "@tychilabs/ugf-testnet-js"

// Your brand new deployed factory and token parameters
const FACTORY_ADDRESS = "0xB735cd5C016Ca44e0281F48AB6c5198e3D0B65d2"
const MOCK_USD_ADDRESS = "0x27dc1c167aef232bb1e21073304b526726a8727e"

declare global {
  interface Window {
    ethereum?: any
  }
}

/**
 * 1. Connect Wallet
 */
export async function connectWallet(): Promise<string> {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Web3 provider not found. Please install MetaMask or Coinbase Wallet.")
  }

  const provider = new BrowserProvider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  const signer = await provider.getSigner()
  return await signer.getAddress()
}

/**
 * 2. Gasless UGF SDK Minting & Backend Sync
 */
export async function executeGaslessTip(
  handle: string,
  amountUsd: number,
  walletAddress: string
): Promise<{ txHash: string; explorerUrl: string }> {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Web3 provider not found.")
  }

  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  // ERC-20 ABI — includes decimals() so we don't hardcode 18
  const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
    "function decimals() public view returns (uint8)",
  ]
  const mockUsdContract = new Contract(MOCK_USD_ADDRESS, erc20Abi, signer)

  // Detect decimals dynamically — MockUSD could be 6 or 18
  const decimals: number = await mockUsdContract.decimals()
  console.log(`[UGF] MockUSD decimals: ${decimals}`)

  const rawAmount = parseUnits(amountUsd.toString(), decimals)

  // ── Pre-flight: check balance before touching UGF gateway ──────────────────
  const balance: bigint = await mockUsdContract.balanceOf(walletAddress)
  console.log(`[UGF] Mock USD balance: ${balance.toString()} (need ${rawAmount.toString()})`)

  if (balance < rawAmount) {
    throw new Error(
      `Insufficient Mock USD balance.\n` +
      `You have ${balance} units (${decimals} decimals) but need ${rawAmount} units.\n` +
      `Claim testnet tokens from the UGF faucet at https://universalgasframework.com/faucets`
    )
  }

  // ── Approve factory to spend MockUSD if needed ────────────────────────────
  const currentAllowance: bigint = await mockUsdContract.allowance(walletAddress, FACTORY_ADDRESS)
  console.log(`[UGF] Current allowance: ${currentAllowance.toString()}`)

  if (currentAllowance < rawAmount) {
    console.log("Factory lacks allowance. Requesting Mock USD approval...")
    const approveTx = await mockUsdContract.approve(FACTORY_ADDRESS, rawAmount)
    await approveTx.wait()
    console.log("Approval confirmed on-chain.")
  }

  // Initialize UGF Client
  const ugf = new UGFClient()
  await ugf.auth.login(signer)

  // Encode call to factory — ABI must match deployed contract signature exactly
  const abi = ["function tipAndMint(string _handle, uint256 _tipAmount)"]
  const factory = new Contract(FACTORY_ADDRESS, abi, signer)
  const txPopulated = await factory.tipAndMint.populateTransaction(handle, rawAmount)

  // Guard: populateTransaction can silently return undefined data if ABI mismatches
  if (!txPopulated.data || txPopulated.data === "0x") {
    throw new Error("Transaction encoding failed: tipAndMint calldata is empty. Check ABI and parameters.")
  }

  console.log("[UGF] Encoded calldata:", txPopulated.data.slice(0, 66), "…")

  // Build the tx_object — value must be hex string "0x0" for EVM chains
  const txObject = JSON.stringify({
    from: walletAddress,
    to: FACTORY_ADDRESS,
    data: txPopulated.data,
    value: "0x0",
  })

  console.log("[UGF] Requesting quote with tx_object:", txObject)

  // Request UGF quote for gas abstraction
  const quote = await ugf.quote.get({
    payer_address: walletAddress,
    tx_object: txObject,
  })

  // ── Manual x402 payment — bypasses SDK's TypedDataEncoder bundler bug ────────
  // ugf.payment.x402.execute() internally calls ethers.TypedDataEncoder which is
  // undefined in Plasmo's bundle context. We sign ERC-3009 ourselves instead.
  const registry = await ugf.registry.get()
  const paymentOption = registry.payment_options.find(
    (o: any) =>
      o.type === "x402" &&
      o.token === "TYI_MOCK_USD" &&
      o.receiver_address?.toLowerCase() === quote.payment_to.toLowerCase()
  )
  if (!paymentOption) throw new Error("[UGF] TYI_MOCK_USD x402 payment option not found in registry")

  const chainEntry = paymentOption.chains.find((c: any) => c.chain_id === "84532")
  if (!chainEntry) throw new Error("[UGF] TYI_MOCK_USD not found on Base Sepolia in registry")

  const tokenAddress: string = chainEntry.address

  // Read on-chain DOMAIN_SEPARATOR + version from the TYI_MOCK_USD token
  const tokenAbi = [
    "function DOMAIN_SEPARATOR() view returns (bytes32)",
    "function version() view returns (string)",
  ]
  const tokenContract = new Contract(tokenAddress, tokenAbi, provider)
  const [onchainDS, tokenVersion] = await Promise.all([
    tokenContract.DOMAIN_SEPARATOR(),
    tokenContract.version().catch(() => "1"),
  ])

  const network = await provider.getNetwork()
  const domain = {
    name: "TYI_MOCK_USD",
    version: tokenVersion,
    chainId: Number(network.chainId),
    verifyingContract: tokenAddress,
  }

  // Verify domain separator matches (safe — uses OUR ethers import, not the SDK's)
  const localDS = TypedDataEncoder.hashDomain(domain)
  if (localDS.toLowerCase() !== onchainDS.toLowerCase()) {
    throw new Error(`[UGF] DOMAIN_SEPARATOR mismatch for ${tokenAddress}`)
  }

  const signerAddress = await signer.getAddress()
  const validAfter = 0n
  const validBefore = BigInt(Math.floor(Date.now() / 1000) + 3600)
  const nonce = hexlify(randomBytes(32))

  const ERC3009_TYPES = {
    TransferWithAuthorization: [
      { name: "from",        type: "address" },
      { name: "to",          type: "address" },
      { name: "value",       type: "uint256" },
      { name: "validAfter",  type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce",       type: "bytes32" },
    ],
  }

  const authMessage = {
    from: signerAddress,
    to: quote.payment_to,
    value: BigInt(quote.payment_amount),
    validAfter,
    validBefore,
    nonce,
  }

  const signature = await signer.signTypedData(domain, ERC3009_TYPES, authMessage)
  const sig = Signature.from(signature)

  await ugf.payment.x402.submit({
    digest: quote.digest,
    payment_mode: "x402",
    v: sig.v,
    r: sig.r,
    s: sig.s,
    nonce,
    valid_after: Number(validAfter),
    valid_before: Number(validBefore),
  })

  // Sponsor gas and execute user transaction on Base Sepolia
  const result = await ugf.chains.evm.sponsorAndExecute(quote.digest, signer, async () => {
    return {
      to: FACTORY_ADDRESS,
      data: txPopulated.data,
      value: 0n
    }
  })

  const txHash = result.userTxHash

  // Backend sync is handled by web3-client.ts → background.ts pipeline.
  // MAIN world fetch to localhost is blocked by YouTube's CSP.

  return {
    txHash,
    explorerUrl: `https://sepolia.basescan.org/tx/${txHash}`
  }
}