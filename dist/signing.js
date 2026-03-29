export class SigningManager {
    http;
    vaultId;
    constructor(http, vaultId) {
        this.http = http;
        this.vaultId = vaultId;
    }
    /**
     * Sign a transaction without broadcasting.
     */
    async sign(request) {
        return this.http.post(`/vault/${this.vaultId}/sign`, request);
    }
    /**
     * Sign and broadcast a transaction.
     */
    async signAndBroadcast(request) {
        return this.http.post(`/vault/${this.vaultId}/sign-and-broadcast`, request);
    }
    /**
     * Estimate gas for a transaction.
     */
    async estimateGas(request) {
        return this.http.post(`/vault/${this.vaultId}/estimate-gas`, request);
    }
    /**
     * Get the status of a previously broadcast transaction.
     */
    async getTransaction(hash, chain) {
        return this.http.get(`/vault/${this.vaultId}/transactions/${hash}`, { chain });
    }
}
//# sourceMappingURL=signing.js.map