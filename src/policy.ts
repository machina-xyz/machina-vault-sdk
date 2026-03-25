import type { HttpClient } from "./http.js";
import type { PolicyConfig, PolicyResult, SignRequest } from "./types/index.js";

export class PolicyManager {
  constructor(
    private http: HttpClient,
    private vaultId: string,
  ) {}

  /**
   * Get the current policy configuration.
   */
  async get(): Promise<PolicyConfig> {
    return this.http.get<PolicyConfig>(`/vault/${this.vaultId}/policy`);
  }

  /**
   * Set the vault's policy configuration.
   */
  async set(policy: PolicyConfig): Promise<void> {
    await this.http.put(`/vault/${this.vaultId}/policy`, policy);
  }

  /**
   * Dry-run evaluate a sign request against the current policy.
   */
  async evaluate(request: SignRequest): Promise<PolicyResult> {
    return this.http.post<PolicyResult>(
      `/vault/${this.vaultId}/policy/evaluate`,
      request,
    );
  }

  /**
   * Parse a natural language policy description into a PolicyConfig.
   */
  async setFromNaturalLanguage(description: string): Promise<PolicyConfig> {
    return this.http.post<PolicyConfig>(
      `/vault/${this.vaultId}/policy/parse`,
      { description },
    );
  }
}
