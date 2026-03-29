import type { HttpClient } from "./http.js";
import type { VaultIdentity } from "./types/index.js";
export declare class IdentityManager {
    private http;
    private vaultId;
    constructor(http: HttpClient, vaultId: string);
    /**
     * Get the vault's identity.
     */
    get(): Promise<VaultIdentity>;
    /**
     * Get the agent's A2A card.
     */
    getAgentCard(): Promise<unknown>;
    /**
     * Update the vault's identity profile.
     */
    updateProfile(updates: {
        name?: string;
        description?: string;
        capabilities?: string[];
    }): Promise<VaultIdentity>;
    /**
     * Register the vault's identity on-chain.
     */
    registerOnChain(chain: string): Promise<{
        txHash: string;
    }>;
}
//# sourceMappingURL=identity.d.ts.map