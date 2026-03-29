import type { HttpClient } from "./http.js";
import type { SignRequest, SignedTransaction } from "./types/index.js";
export declare class SigningManager {
    private http;
    private vaultId;
    constructor(http: HttpClient, vaultId: string);
    /**
     * Sign a transaction without broadcasting.
     */
    sign(request: SignRequest): Promise<SignedTransaction>;
    /**
     * Sign and broadcast a transaction.
     */
    signAndBroadcast(request: SignRequest): Promise<{
        hash: string;
        status: string;
    }>;
    /**
     * Estimate gas for a transaction.
     */
    estimateGas(request: Omit<SignRequest, "gasLimit">): Promise<{
        gasLimit: string;
        gasCost: string;
    }>;
    /**
     * Get the status of a previously broadcast transaction.
     */
    getTransaction(hash: string, chain: string): Promise<{
        status: string;
        confirmations: number;
        blockNumber?: number;
    }>;
}
//# sourceMappingURL=signing.d.ts.map