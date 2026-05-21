import { BrowserProvider, Contract, parseUnits } from "ethers"
import { UGFClient } from "@tychilabs/ugf-testnet-js"

// Your brand new deployed factory and token parameters
const FACTORY_ADDRESS = "0xB735cd5C016Ca44e0281F48AB6c5198e3D0B65d2"
const MOCK_USD_ADDRESS = "0x27dc1c167aef232bb1e21073304b526726a8727e"
const BACKEND_API = "http://localhost:8000/api/tips" // Matches your port 8000 setup

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
  const rawAmount = parseUnits(amountUsd.toString(), 18)

  // 🚨 THE CRITICAL FIX: Check and approve the NEW factory contract
  const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)"
  ]
  const mockUsdContract = new Contract(MOCK_USD_ADDRESS, erc20Abi, signer)

  const currentAllowance = await mockUsdContract.allowance(walletAddress, FACTORY_ADDRESS)

  if (currentAllowance < rawAmount) {
    console.log("New factory lacks allowance. Requesting Mock USD approval...")
    const approveTx = await mockUsdContract.approve(FACTORY_ADDRESS, rawAmount)
    await approveTx.wait() // Wait for approval transaction to mine on Base Sepolia
    console.log("Approval cleared successfully!")
  }

  // Initialize UGF Client
  const ugf = new UGFClient()
  await ugf.auth.login(signer)

  // Encode call to your upgraded ERC2771 factory contract
  const abi = ["function tipAndMint(string handle, uint256 tipAmount)"]
  const factory = new Contract(FACTORY_ADDRESS, abi, signer)
  const txPopulated = await factory.tipAndMint.populateTransaction(handle, rawAmount)

  // Request UGF quote for gas abstraction
  const quote = await ugf.quote.get({
    payer_address: walletAddress,
    tx_object: JSON.stringify({
      from: walletAddress,
      to: FACTORY_ADDRESS,
      data: txPopulated.data,
      value: "0"
    })
  })

  // Execute payment details off-chain
  await ugf.payment.x402.execute({ quote, signer })

  // Sponsor gas and execute user transaction on Base Sepolia
  const result = await ugf.chains.evm.sponsorAndExecute(quote.digest, signer, async () => {
    return {
      to: FACTORY_ADDRESS,
      data: txPopulated.data,
      value: 0n
    }
  })

  const txHash = result.userTxHash

  // Sync with Backend for Indexing fallback
  try {
    await fetch(BACKEND_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txHash,
        creatorHandle: handle,
        fanWallet: walletAddress,
        rawAmount: rawAmount.toString(),
        formattedAmount: `$${amountUsd}`,
        timestamp: new Date().toISOString()
      })
    })
  } catch (err) {
    console.error("Backend sync logged:", err)
  }

  return {
    txHash,
    explorerUrl: `https://sepolia.basescan.org/tx/${txHash}`
  }
}