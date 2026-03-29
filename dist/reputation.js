export class ReputationManager {
    http;
    vaultId;
    constructor(http, vaultId) {
        this.http = http;
        this.vaultId = vaultId;
    }
    /**
     * Get the vault's reputation profile.
     */
    async get() {
        return this.http.get(`/vault/${this.vaultId}/reputation`);
    }
    /**
     * Get the reputation profile for any address.
     */
    async getForAddress(address) {
        return this.http.get(`/reputation/${address}`);
    }
    /**
     * Request an attestation from a peer.
     */
    async requestAttestation(peerAddress) {
        return this.http.post(`/vault/${this.vaultId}/reputation/attestation`, { peerAddress });
    }
    /**
     * Check if the vault meets a reputation threshold.
     */
    async meetsThreshold(minScore, minTier) {
        const params = {};
        if (minScore !== undefined)
            params.minScore = String(minScore);
        if (minTier !== undefined)
            params.minTier = minTier;
        const result = await this.http.get(`/vault/${this.vaultId}/reputation/threshold`, params);
        return result.meets;
    }
}
//# sourceMappingURL=reputation.js.map