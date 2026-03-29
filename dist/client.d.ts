import { KeyManager } from "./keys.js";
import { SigningManager } from "./signing.js";
import { BalanceManager } from "./balances.js";
import { IdentityManager } from "./identity.js";
import { ReputationManager } from "./reputation.js";
import { PolicyManager } from "./policy.js";
import type { VaultConfig, VaultInfo, CounterpartyProfile } from "./types/index.js";
export declare class MachinaVault {
    private http;
    private config;
    private vaultId;
    private _keys;
    private _signing;
    private _balances;
    private _identity;
    private _reputation;
    private _policy;
    private constructor();
    /**
     * Create a new vault (or authenticate to an existing one) and return
     * an initialized MachinaVault instance.
     */
    static create(config: VaultConfig): Promise<MachinaVault>;
    /**
     * Connect to an existing vault without creating one.
     */
    static connect(config: VaultConfig): Promise<MachinaVault>;
    get keys(): KeyManager;
    get signing(): SigningManager;
    get balances(): BalanceManager;
    get identity(): IdentityManager;
    get reputation(): ReputationManager;
    get policy(): PolicyManager;
    /**
     * Get vault info.
     */
    info(): Promise<VaultInfo>;
    /**
     * Check a counterparty address for reputation, sanctions, and risk.
     */
    checkCounterparty(address: string): Promise<CounterpartyProfile>;
    /**
     * Destroy the vault session and revoke any active sessions.
     */
    destroy(): Promise<void>;
    private authenticate;
    private authenticatePasskey;
    private validateApiKey;
    private buildAuthHeaders;
    private ensureConnected;
    private base64urlToBuffer;
    private bufferToBase64url;
}
//# sourceMappingURL=client.d.ts.map