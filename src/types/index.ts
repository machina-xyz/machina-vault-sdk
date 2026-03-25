// ── Auth ──────────────────────────────────────────────────────────────

export type AuthConfig =
  | { type: "passkey" }
  | { type: "apikey"; key: string }
  | { type: "session"; token: string };

// ── Vault ─────────────────────────────────────────────────────────────

export interface VaultConfig {
  apiUrl: string;
  auth: AuthConfig;
  chains?: string[];
  defaultChain?: string;
}

export interface VaultInfo {
  id: string;
  address: string;
  chains: string[];
  createdAt: string;
  status: string;
}

// ── Keys ──────────────────────────────────────────────────────────────

export interface KeyInfo {
  id: string;
  tier: string;
  publicKey: string;
  address: string;
  permissions: string[];
  spendingLimits?: SpendingLimits;
  expiresAt?: string;
  status: string;
}

export interface SpendingLimits {
  perTx?: string;
  daily?: string;
  monthly?: string;
}

export interface CreateKeyOptions {
  tier: string;
  name: string;
  permissions?: string[];
  spendingLimits?: SpendingLimits;
  contractAllowlist?: string[];
  ttlMs?: number;
}

// ── Signing ───────────────────────────────────────────────────────────

export interface SignRequest {
  key?: string;
  chain: string;
  to: string;
  data?: string;
  value?: string;
  gasLimit?: string;
}

export interface SignedTransaction {
  hash: string;
  signedTx: string;
  chain: string;
}

// ── Balances ──────────────────────────────────────────────────────────

export interface BalanceInfo {
  chain: string;
  token: string;
  balance: string;
  balanceUsd?: string;
}

// ── Identity ──────────────────────────────────────────────────────────

export interface VaultIdentity {
  agentId: string;
  name: string;
  registrationTx?: string;
  a2aCard?: unknown;
  kyaMetadata?: Record<string, unknown>;
  reputation?: ReputationProfile;
}

// ── Reputation ────────────────────────────────────────────────────────

export interface ReputationProfile {
  score: number;
  tier: string;
  components: Record<string, number>;
  attestations: Attestation[];
  lastUpdated: string;
}

export interface Attestation {
  from: string;
  type: string;
  timestamp: string;
  signature?: string;
}

export interface CounterpartyProfile {
  address: string;
  reputation?: ReputationProfile;
  sanctions?: boolean;
  riskScore?: number;
}

// ── Policy ────────────────────────────────────────────────────────────

export interface PolicyConfig {
  rules: PolicyRule[];
}

export interface PolicyRule {
  id: string;
  name: string;
  action: string;
  conditions: Record<string, unknown>;
  priority: number;
}

export interface PolicyResult {
  allowed: boolean;
  action: string;
  matchedRules: PolicyRule[];
  reasons: string[];
}

// ── Errors ────────────────────────────────────────────────────────────

export class VaultError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    context: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "VaultError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}

export class PolicyViolationError extends VaultError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, "POLICY_VIOLATION", 403, context);
    this.name = "PolicyViolationError";
  }
}

export class InsufficientBalanceError extends VaultError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, "INSUFFICIENT_BALANCE", 400, context);
    this.name = "InsufficientBalanceError";
  }
}

export class UnauthorizedKeyError extends VaultError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, "UNAUTHORIZED_KEY", 401, context);
    this.name = "UnauthorizedKeyError";
  }
}

export class ChainError extends VaultError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, "CHAIN_ERROR", 502, context);
    this.name = "ChainError";
  }
}

export class NetworkError extends VaultError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, "NETWORK_ERROR", 0, context);
    this.name = "NetworkError";
  }
}
