import type { HttpClient } from "./http.js";
import type { BalanceInfo } from "./types/index.js";
export declare class BalanceManager {
    private http;
    private vaultId;
    constructor(http: HttpClient, vaultId: string);
    /**
     * Get balances, optionally filtered by chain.
     */
    get(chain?: string): Promise<BalanceInfo[]>;
    /**
     * Get the balance for a specific token on a specific chain.
     */
    getByToken(chain: string, token: string): Promise<BalanceInfo>;
    /**
     * Get aggregated balances across all chains.
     */
    getAggregated(): Promise<{
        totalUsd: string;
        byChain: Record<string, string>;
    }>;
    /**
     * Get historical balance data for a token on a chain.
     */
    getHistory(chain: string, token: string, days?: number): Promise<Array<{
        timestamp: string;
        balance: string;
        balanceUsd?: string;
    }>>;
}
//# sourceMappingURL=balances.d.ts.map