import type { HttpClient } from "./http.js";
import type { BalanceInfo } from "./types/index.js";

export class BalanceManager {
  constructor(
    private http: HttpClient,
    private vaultId: string,
  ) {}

  /**
   * Get balances, optionally filtered by chain.
   */
  async get(chain?: string): Promise<BalanceInfo[]> {
    const params: Record<string, string> = {};
    if (chain) params.chain = chain;
    return this.http.get<BalanceInfo[]>(
      `/vault/${this.vaultId}/balances`,
      params,
    );
  }

  /**
   * Get the balance for a specific token on a specific chain.
   */
  async getByToken(chain: string, token: string): Promise<BalanceInfo> {
    return this.http.get<BalanceInfo>(
      `/vault/${this.vaultId}/balances/${chain}/${token}`,
    );
  }

  /**
   * Get aggregated balances across all chains.
   */
  async getAggregated(): Promise<{
    totalUsd: string;
    byChain: Record<string, string>;
  }> {
    return this.http.get<{ totalUsd: string; byChain: Record<string, string> }>(
      `/vault/${this.vaultId}/balances/aggregated`,
    );
  }

  /**
   * Get historical balance data for a token on a chain.
   */
  async getHistory(
    chain: string,
    token: string,
    days?: number,
  ): Promise<Array<{ timestamp: string; balance: string; balanceUsd?: string }>> {
    const params: Record<string, string> = { chain, token };
    if (days !== undefined) params.days = String(days);
    return this.http.get<
      Array<{ timestamp: string; balance: string; balanceUsd?: string }>
    >(`/vault/${this.vaultId}/balances/history`, params);
  }
}
