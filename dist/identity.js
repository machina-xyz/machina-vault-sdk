export class IdentityManager {
    http;
    vaultId;
    constructor(http, vaultId) {
        this.http = http;
        this.vaultId = vaultId;
    }
    /**
     * Get the vault's identity.
     */
    async get() {
        return this.http.get(`/vault/${this.vaultId}/identity`);
    }
    /**
     * Get the agent's A2A card.
     */
    async getAgentCard() {
        return this.http.get(`/vault/${this.vaultId}/identity/agent-card`);
    }
    /**
     * Update the vault's identity profile.
     */
    async updateProfile(updates) {
        return this.http.put(`/vault/${this.vaultId}/identity`, updates);
    }
    /**
     * Register the vault's identity on-chain.
     */
    async registerOnChain(chain) {
        return this.http.post(`/vault/${this.vaultId}/identity/register`, { chain });
    }
}
//# sourceMappingURL=identity.js.map