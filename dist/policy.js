export class PolicyManager {
    http;
    vaultId;
    constructor(http, vaultId) {
        this.http = http;
        this.vaultId = vaultId;
    }
    /**
     * Get the current policy configuration.
     */
    async get() {
        return this.http.get(`/vault/${this.vaultId}/policy`);
    }
    /**
     * Set the vault's policy configuration.
     */
    async set(policy) {
        await this.http.put(`/vault/${this.vaultId}/policy`, policy);
    }
    /**
     * Dry-run evaluate a sign request against the current policy.
     */
    async evaluate(request) {
        return this.http.post(`/vault/${this.vaultId}/policy/evaluate`, request);
    }
    /**
     * Parse a natural language policy description into a PolicyConfig.
     */
    async setFromNaturalLanguage(description) {
        return this.http.post(`/vault/${this.vaultId}/policy/parse`, { description });
    }
}
//# sourceMappingURL=policy.js.map