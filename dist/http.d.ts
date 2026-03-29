export declare class HttpClient {
    private baseUrl;
    private getAuthHeaders;
    constructor(baseUrl: string, getAuthHeaders: () => Promise<Record<string, string>>);
    get<T>(path: string, params?: Record<string, string>): Promise<T>;
    post<T>(path: string, body?: unknown): Promise<T>;
    put<T>(path: string, body?: unknown): Promise<T>;
    delete<T>(path: string): Promise<T>;
    private request;
    private throwForStatus;
    private backoff;
}
//# sourceMappingURL=http.d.ts.map