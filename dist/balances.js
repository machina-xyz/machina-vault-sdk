export class BalanceManager {
    http;
    vaultId;
    constructor(http, vaultId) {
        this.http = http;
        this.vaultId = vaultId;
    }
    /**
     * Get balances, optionally filtered by chain.
     */
    async get(chain) {
        const params = {};
        if (chain)
            params.chain = chain;
        return this.http.get(`/vault/${this.vaultId}/balances`, params);
    }
    /**
     * Get the balance for a specific token on a specific chain.
     */
    async getByToken(chain, token) {
        return this.http.get(`/vault/${this.vaultId}/balances/${chain}/${token}`);
    }
    /**
     * Get aggregated balances across all chains.
     */
    async getAggregated() {
        return this.http.get(`/vault/${this.vaultId}/balances/aggregated`);
    }
    /**
     * Get historical balance data for a token on a chain.
     */
    async getHistory(chain, token, days) {
        const params = { chain, token };
        if (days !== undefined)
            params.days = String(days);
        return this.http.get(`/vault/${this.vaultId}/balances/history`, params);
    }
}
//# sourceMappingURL=balances.js.map