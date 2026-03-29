import type { HttpClient } from "./http.js";
import type { PolicyConfig, PolicyResult, SignRequest } from "./types/index.js";
export declare class PolicyManager {
    private http;
    private vaultId;
    constructor(http: HttpClient, vaultId: string);
    /**
     * Get the current policy configuration.
     */
    get(): Promise<PolicyConfig>;
    /**
     * Set the vault's policy configuration.
     */
    set(policy: PolicyConfig): Promise<void>;
    /**
     * Dry-run evaluate a sign request against the current policy.
     */
    evaluate(request: SignRequest): Promise<PolicyResult>;
    /**
     * Parse a natural language policy description into a PolicyConfig.
     */
    setFromNaturalLanguage(description: string): Promise<PolicyConfig>;
}
//# sourceMappingURL=policy.d.ts.map