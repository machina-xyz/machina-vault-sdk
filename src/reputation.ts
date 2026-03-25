import type { HttpClient } from "./http.js";
import type { ReputationProfile } from "./types/index.js";

export class ReputationManager {
  constructor(
    private http: HttpClient,
    private vaultId: string,
  ) {}

  /**
   * Get the vault's reputation profile.
   */
  async get(): Promise<ReputationProfile> {
    return this.http.get<ReputationProfile>(
      `/vault/${this.vaultId}/reputation`,
    );
  }

  /**
   * Get the reputation profile for any address.
   */
  async getForAddress(address: string): Promise<ReputationProfile> {
    return this.http.get<ReputationProfile>(`/reputation/${address}`);
  }

  /**
   * Request an attestation from a peer.
   */
  async requestAttestation(
    peerAddress: string,
  ): Promise<{ requestId: string }> {
    return this.http.post<{ requestId: string }>(
      `/vault/${this.vaultId}/reputation/attestation`,
      { peerAddress },
    );
  }

  /**
   * Check if the vault meets a reputation threshold.
   */
  async meetsThreshold(
    minScore?: number,
    minTier?: string,
  ): Promise<boolean> {
    const params: Record<string, string> = {};
    if (minScore !== undefined) params.minScore = String(minScore);
    if (minTier !== undefined) params.minTier = minTier;
    const result = await this.http.get<{ meets: boolean }>(
      `/vault/${this.vaultId}/reputation/threshold`,
      params,
    );
    return result.meets;
  }
}
