import type { HttpClient } from "./http.js";
import type { CreateKeyOptions, KeyInfo, SpendingLimits } from "./types/index.js";
export declare class KeyManager {
    private http;
    private vaultId;
    constructor(http: HttpClient, vaultId: string);
    /**
     * Create a new key in the vault.
     */
    create(opts: CreateKeyOptions): Promise<KeyInfo>;
    /**
     * Get a specific key by ID.
     */
    get(keyId: string): Promise<KeyInfo>;
    /**
     * List keys, optionally filtered by tier or status.
     */
    list(filter?: {
        tier?: string;
        status?: string;
    }): Promise<KeyInfo[]>;
    /**
     * Revoke (delete) a key.
     */
    revoke(keyId: string): Promise<void>;
    /**
     * Rotate a key, returning the new key info.
     */
    rotate(keyId: string): Promise<KeyInfo>;
    /**
     * Get spending usage for a key.
     */
    getSpendingUsage(keyId: string): Promise<SpendingLimits>;
}
//# sourceMappingURL=keys.d.ts.map