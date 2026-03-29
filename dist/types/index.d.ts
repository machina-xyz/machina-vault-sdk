export type AuthConfig = {
    type: "passkey";
} | {
    type: "apikey";
    key: string;
} | {
    type: "session";
    token: string;
};
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
export interface BalanceInfo {
    chain: string;
    token: string;
    balance: string;
    balanceUsd?: string;
}
export interface VaultIdentity {
    agentId: string;
    name: string;
    registrationTx?: string;
    a2aCard?: unknown;
    kyaMetadata?: Record<string, unknown>;
    reputation?: ReputationProfile;
}
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
export declare class VaultError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly context: Record<string, unknown>;
    constructor(message: string, code: string, statusCode: number, context?: Record<string, unknown>);
}
export declare class PolicyViolationError extends VaultError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class InsufficientBalanceError extends VaultError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class UnauthorizedKeyError extends VaultError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class ChainError extends VaultError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class NetworkError extends VaultError {
    constructor(message: string, context?: Record<string, unknown>);
}
//# sourceMappingURL=index.d.ts.map