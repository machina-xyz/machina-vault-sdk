// ── Auth ──────────────────────────────────────────────────────────────
// ── Errors ────────────────────────────────────────────────────────────
export class VaultError extends Error {
    code;
    statusCode;
    context;
    constructor(message, code, statusCode, context = {}) {
        super(message);
        this.name = "VaultError";
        this.code = code;
        this.statusCode = statusCode;
        this.context = context;
    }
}
export class PolicyViolationError extends VaultError {
    constructor(message, context = {}) {
        super(message, "POLICY_VIOLATION", 403, context);
        this.name = "PolicyViolationError";
    }
}
export class InsufficientBalanceError extends VaultError {
    constructor(message, context = {}) {
        super(message, "INSUFFICIENT_BALANCE", 400, context);
        this.name = "InsufficientBalanceError";
    }
}
export class UnauthorizedKeyError extends VaultError {
    constructor(message, context = {}) {
        super(message, "UNAUTHORIZED_KEY", 401, context);
        this.name = "UnauthorizedKeyError";
    }
}
export class ChainError extends VaultError {
    constructor(message, context = {}) {
        super(message, "CHAIN_ERROR", 502, context);
        this.name = "ChainError";
    }
}
export class NetworkError extends VaultError {
    constructor(message, context = {}) {
        super(message, "NETWORK_ERROR", 0, context);
        this.name = "NetworkError";
    }
}
//# sourceMappingURL=index.js.map