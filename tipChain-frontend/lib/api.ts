// lib/api.ts — Typed HTTP client for the TipChain backend
// All routes proxy through Next.js /api/tipchain/* → backend /api/*

const BASE = "/api/tipchain";

// ─── Response Types ───────────────────────────────────────────────────────────

export interface ApiTip {
  txHash: string;
  fanWallet: string;
  formattedAmount: string;
  timestamp: string;
}

export interface ApiCreator {
  handle: string;
  platform: string;
  tokenAddress: string | null;
  totalReserveUSD: number;
  isClaimed: boolean;
  creatorWallet: string | null;
  youtubeChannelId: string | null;
  recentTips?: ApiTip[];
  tipsCount?: number;
  holdersCount?: number;
}

export interface ApiCreatorDetail extends ApiCreator {
  recentTips: ApiTip[];
}

export interface ApiTipsPage {
  handle: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  tips: ApiTip[];
}

export interface ApiTrending {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  creators: ApiCreator[];
}

export interface ApiClaimStatus {
  handle: string;
  exists: boolean;
  isClaimed: boolean;
  creatorWallet: string | null;
}

export interface ApiAuthUrlResponse {
  url: string;
}

export interface ApiOAuthCallbackResponse {
  token: string;
  channelId: string;
  channelTitle: string;
  email: string;
  handle: string;
  message: string;
}

export interface ApiSignResponse {
  message: string;
  signature: string;
  signerAddress: string;
  handle: string;
  creatorWallet: string;
  nonce: string;
}

// ─── Internal fetch helper ────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Creator Endpoints ────────────────────────────────────────────────────────

/** GET /api/creator/trending — Marketplace feed */
export function getTrending(
  limit = 20,
  page = 1,
  platform?: string,
  unclaimed?: boolean
): Promise<ApiTrending> {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });
  if (platform) params.set("platform", platform);
  if (unclaimed) params.set("unclaimed", "true");
  return apiFetch<ApiTrending>(`/creator/trending?${params}`);
}

/** GET /api/creator/:handle — Full creator stats + recent tips */
export function getCreator(handle: string): Promise<ApiCreatorDetail> {
  return apiFetch<ApiCreatorDetail>(`/creator/${encodeURIComponent(handle)}`);
}

/** GET /api/creator/:handle/tips — Paginated tip history */
export function getCreatorTips(
  handle: string,
  page = 1,
  limit = 20
): Promise<ApiTipsPage> {
  return apiFetch<ApiTipsPage>(
    `/creator/${encodeURIComponent(handle)}/tips?page=${page}&limit=${limit}`
  );
}

// ─── Claim Endpoints ──────────────────────────────────────────────────────────

/** GET /api/claim/auth-url?handle=:handle — Google OAuth consent URL */
export function getClaimAuthUrl(handle: string): Promise<ApiAuthUrlResponse> {
  return apiFetch<ApiAuthUrlResponse>(
    `/claim/auth-url?handle=${encodeURIComponent(handle)}`
  );
}

/** POST /api/claim/oauth-callback — Exchange OAuth code for JWT */
export function postOAuthCallback(
  code: string,
  state: string
): Promise<ApiOAuthCallbackResponse> {
  return apiFetch<ApiOAuthCallbackResponse>("/claim/oauth-callback", {
    method: "POST",
    body: JSON.stringify({ code, state }),
  });
}

/** POST /api/claim/sign — Server signs EIP-191 claim message */
export function postClaimSign(
  token: string,
  creatorWallet: string
): Promise<ApiSignResponse> {
  return apiFetch<ApiSignResponse>("/claim/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ creatorWallet }),
  });
}

/** GET /api/claim/status/:handle — Public claim status check */
export function getClaimStatus(handle: string): Promise<ApiClaimStatus> {
  return apiFetch<ApiClaimStatus>(
    `/claim/status/${encodeURIComponent(handle)}`
  );
}
