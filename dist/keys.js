export class KeyManager {
    http;
    vaultId;
    constructor(http, vaultId) {
        this.http = http;
        this.vaultId = vaultId;
    }
    /**
     * Create a new key in the vault.
     */
    async create(opts) {
        return this.http.post(`/vault/${this.vaultId}/keys`, opts);
    }
    /**
     * Get a specific key by ID.
     */
    async get(keyId) {
        return this.http.get(`/vault/${this.vaultId}/keys/${keyId}`);
    }
    /**
     * List keys, optionally filtered by tier or status.
     */
    async list(filter) {
        const params = {};
        if (filter?.tier)
            params.tier = filter.tier;
        if (filter?.status)
            params.status = filter.status;
        return this.http.get(`/vault/${this.vaultId}/keys`, params);
    }
    /**
     * Revoke (delete) a key.
     */
    async revoke(keyId) {
        await this.http.delete(`/vault/${this.vaultId}/keys/${keyId}`);
    }
    /**
     * Rotate a key, returning the new key info.
     */
    async rotate(keyId) {
        return this.http.post(`/vault/${this.vaultId}/keys/${keyId}/rotate`);
    }
    /**
     * Get spending usage for a key.
     */
    async getSpendingUsage(keyId) {
        return this.http.get(`/vault/${this.vaultId}/keys/${keyId}/spending`);
    }
}
//# sourceMappingURL=keys.js.map