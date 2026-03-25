import type { HttpClient } from "./http.js";
import type { SignRequest, SignedTransaction } from "./types/index.js";

export class SigningManager {
  constructor(
    private http: HttpClient,
    private vaultId: string,
  ) {}

  /**
   * Sign a transaction without broadcasting.
   */
  async sign(request: SignRequest): Promise<SignedTransaction> {
    return this.http.post<SignedTransaction>(
      `/vault/${this.vaultId}/sign`,
      request,
    );
  }

  /**
   * Sign and broadcast a transaction.
   */
  async signAndBroadcast(
    request: SignRequest,
  ): Promise<{ hash: string; status: string }> {
    return this.http.post<{ hash: string; status: string }>(
      `/vault/${this.vaultId}/sign-and-broadcast`,
      request,
    );
  }

  /**
   * Estimate gas for a transaction.
   */
  async estimateGas(
    request: Omit<SignRequest, "gasLimit">,
  ): Promise<{ gasLimit: string; gasCost: string }> {
    return this.http.post<{ gasLimit: string; gasCost: string }>(
      `/vault/${this.vaultId}/estimate-gas`,
      request,
    );
  }

  /**
   * Get the status of a previously broadcast transaction.
   */
  async getTransaction(
    hash: string,
    chain: string,
  ): Promise<{ status: string; confirmations: number; blockNumber?: number }> {
    return this.http.get<{
      status: string;
      confirmations: number;
      blockNumber?: number;
    }>(`/vault/${this.vaultId}/transactions/${hash}`, { chain });
  }
}
