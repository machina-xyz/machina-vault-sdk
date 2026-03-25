import type { HttpClient } from "./http.js";
import type { VaultIdentity } from "./types/index.js";

export class IdentityManager {
  constructor(
    private http: HttpClient,
    private vaultId: string,
  ) {}

  /**
   * Get the vault's identity.
   */
  async get(): Promise<VaultIdentity> {
    return this.http.get<VaultIdentity>(`/vault/${this.vaultId}/identity`);
  }

  /**
   * Get the agent's A2A card.
   */
  async getAgentCard(): Promise<unknown> {
    return this.http.get<unknown>(
      `/vault/${this.vaultId}/identity/agent-card`,
    );
  }

  /**
   * Update the vault's identity profile.
   */
  async updateProfile(updates: {
    name?: string;
    description?: string;
    capabilities?: string[];
  }): Promise<VaultIdentity> {
    return this.http.put<VaultIdentity>(
      `/vault/${this.vaultId}/identity`,
      updates,
    );
  }

  /**
   * Register the vault's identity on-chain.
   */
  async registerOnChain(chain: string): Promise<{ txHash: string }> {
    return this.http.post<{ txHash: string }>(
      `/vault/${this.vaultId}/identity/register`,
      { chain },
    );
  }
}
