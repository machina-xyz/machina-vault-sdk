import type { HttpClient } from "./http.js";
import type { ReputationProfile } from "./types/index.js";
export declare class ReputationManager {
    private http;
    private vaultId;
    constructor(http: HttpClient, vaultId: string);
    /**
     * Get the vault's reputation profile.
     */
    get(): Promise<ReputationProfile>;
    /**
     * Get the reputation profile for any address.
     */
    getForAddress(address: string): Promise<ReputationProfile>;
    /**
     * Request an attestation from a peer.
     */
    requestAttestation(peerAddress: string): Promise<{
        requestId: string;
    }>;
    /**
     * Check if the vault meets a reputation threshold.
     */
    meetsThreshold(minScore?: number, minTier?: string): Promise<boolean>;
}
//# sourceMappingURL=reputation.d.ts.map