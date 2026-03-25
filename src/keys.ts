import type { HttpClient } from "./http.js";
import type { CreateKeyOptions, KeyInfo, SpendingLimits } from "./types/index.js";

export class KeyManager {
  constructor(
    private http: HttpClient,
    private vaultId: string,
  ) {}

  /**
   * Create a new key in the vault.
   */
  async create(opts: CreateKeyOptions): Promise<KeyInfo> {
    return this.http.post<KeyInfo>(`/vault/${this.vaultId}/keys`, opts);
  }

  /**
   * Get a specific key by ID.
   */
  async get(keyId: string): Promise<KeyInfo> {
    return this.http.get<KeyInfo>(`/vault/${this.vaultId}/keys/${keyId}`);
  }

  /**
   * List keys, optionally filtered by tier or status.
   */
  async list(filter?: { tier?: string; status?: string }): Promise<KeyInfo[]> {
    const params: Record<string, string> = {};
    if (filter?.tier) params.tier = filter.tier;
    if (filter?.status) params.status = filter.status;
    return this.http.get<KeyInfo[]>(`/vault/${this.vaultId}/keys`, params);
  }

  /**
   * Revoke (delete) a key.
   */
  async revoke(keyId: string): Promise<void> {
    await this.http.delete(`/vault/${this.vaultId}/keys/${keyId}`);
  }

  /**
   * Rotate a key, returning the new key info.
   */
  async rotate(keyId: string): Promise<KeyInfo> {
    return this.http.post<KeyInfo>(
      `/vault/${this.vaultId}/keys/${keyId}/rotate`,
    );
  }

  /**
   * Get spending usage for a key.
   */
  async getSpendingUsage(
    keyId: string,
  ): Promise<SpendingLimits> {
    return this.http.get<SpendingLimits>(
      `/vault/${this.vaultId}/keys/${keyId}/spending`,
    );
  }
}
