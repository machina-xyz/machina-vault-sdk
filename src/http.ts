import {
  VaultError,
  UnauthorizedKeyError,
  PolicyViolationError,
  InsufficientBalanceError,
  ChainError,
  NetworkError,
} from "./types/index.js";

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

export class HttpClient {
  private baseUrl: string;
  private getAuthHeaders: () => Promise<Record<string, string>>;

  constructor(
    baseUrl: string,
    getAuthHeaders: () => Promise<Record<string, string>>,
  ) {
    // Strip trailing slash
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.getAuthHeaders = getAuthHeaders;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>("GET", url);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", `${this.baseUrl}${path}`, body);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", `${this.baseUrl}${path}`, body);
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", `${this.baseUrl}${path}`);
  }

  // ── Internal ──────────────────────────────────────────────────────

  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    attempt = 0,
  ): Promise<T> {
    const authHeaders = await this.getAuthHeaders();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
    };

    const init: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        await this.backoff(attempt);
        return this.request<T>(method, url, body, attempt + 1);
      }
      throw new NetworkError(
        `Request failed: ${err instanceof Error ? err.message : String(err)}`,
        { url, method },
      );
    }

    // Retry on 429 / 5xx
    if (
      (response.status === 429 || response.status >= 500) &&
      attempt < MAX_RETRIES
    ) {
      await this.backoff(attempt);
      return this.request<T>(method, url, body, attempt + 1);
    }

    if (!response.ok) {
      await this.throwForStatus(response, url, method);
    }

    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private async throwForStatus(
    response: Response,
    url: string,
    method: string,
  ): Promise<never> {
    let detail: string;
    try {
      const body = await response.json();
      detail =
        (body as Record<string, unknown>).message as string ??
        (body as Record<string, unknown>).error as string ??
        JSON.stringify(body);
    } catch {
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
        throw new VaultError(
          detail,
          "API_ERROR",
          response.status,
          ctx,
        );
    }
  }

  private backoff(attempt: number): Promise<void> {
    const ms = RETRY_BASE_MS * 2 ** attempt + Math.random() * 100;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
