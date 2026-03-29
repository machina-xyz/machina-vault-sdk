import { VaultError, UnauthorizedKeyError, PolicyViolationError, InsufficientBalanceError, ChainError, NetworkError, } from "./types/index.js";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;
export class HttpClient {
    baseUrl;
    getAuthHeaders;
    constructor(baseUrl, getAuthHeaders) {
        // Strip trailing slash
        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.getAuthHeaders = getAuthHeaders;
    }
    async get(path, params) {
        let url = `${this.baseUrl}${path}`;
        if (params) {
            const qs = new URLSearchParams(params).toString();
            if (qs)
                url += `?${qs}`;
        }
        return this.request("GET", url);
    }
    async post(path, body) {
        return this.request("POST", `${this.baseUrl}${path}`, body);
    }
    async put(path, body) {
        return this.request("PUT", `${this.baseUrl}${path}`, body);
    }
    async delete(path) {
        return this.request("DELETE", `${this.baseUrl}${path}`);
    }
    // ── Internal ──────────────────────────────────────────────────────
    async request(method, url, body, attempt = 0) {
        const authHeaders = await this.getAuthHeaders();
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...authHeaders,
        };
        const init = {
            method,
            headers,
            signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
        };
        if (body !== undefined) {
            init.body = JSON.stringify(body);
        }
        let response;
        try {
            response = await fetch(url, init);
        }
        catch (err) {
            if (attempt < MAX_RETRIES) {
                await this.backoff(attempt);
                return this.request(method, url, body, attempt + 1);
            }
            throw new NetworkError(`Request failed: ${err instanceof Error ? err.message : String(err)}`, { url, method });
        }
        // Retry on 429 / 5xx
        if ((response.status === 429 || response.status >= 500) &&
            attempt < MAX_RETRIES) {
            await this.backoff(attempt);
            return this.request(method, url, body, attempt + 1);
        }
        if (!response.ok) {
            await this.throwForStatus(response, url, method);
        }
        // 204 No Content
        if (response.status === 204) {
            return undefined;
        }
        return (await response.json());
    }
    async throwForStatus(response, url, method) {
        let detail;
        try {
            const body = await response.json();
            detail =
                body.message ??
                    body.error ??
                    JSON.stringify(body);
        }
        catch {
            detail = response.statusText || "Unknown error";
        }
        const ctx = { url, method, status: response.status };
        switch (response.status) {
            case 400:
                if (detail.toLowerCase().includes("insufficient")) {
                    throw new InsufficientBalanceError(detail, ctx);
                }
                throw new VaultError(detail, "BAD_REQUEST", 400, ctx);
            case 401:
                throw new UnauthorizedKeyError(detail, ctx);
            case 403:
                throw new PolicyViolationError(detail, ctx);
            case 502:
            case 503:
                throw new ChainError(detail, ctx);
            default:
                throw new VaultError(detail, "API_ERROR", response.status, ctx);
        }
    }
    backoff(attempt) {
        const ms = RETRY_BASE_MS * 2 ** attempt + Math.random() * 100;
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
//# sourceMappingURL=http.js.map