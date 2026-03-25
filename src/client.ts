import { HttpClient } from "./http.js";
import { KeyManager } from "./keys.js";
import { SigningManager } from "./signing.js";
import { BalanceManager } from "./balances.js";
import { IdentityManager } from "./identity.js";
import { ReputationManager } from "./reputation.js";
import { PolicyManager } from "./policy.js";
import type {
  VaultConfig,
  VaultInfo,
  CounterpartyProfile,
} from "./types/index.js";
import { VaultError } from "./types/index.js";

export class MachinaVault {
  private http: HttpClient;
  private config: VaultConfig;
  private vaultId: string | null = null;

  private _keys: KeyManager | null = null;
  private _signing: SigningManager | null = null;
  private _balances: BalanceManager | null = null;
  private _identity: IdentityManager | null = null;
  private _reputation: ReputationManager | null = null;
  private _policy: PolicyManager | null = null;

  private constructor(config: VaultConfig) {
    this.config = config;
    this.http = new HttpClient(config.apiUrl, () => this.buildAuthHeaders());
  }

  /**
   * Create a new vault (or authenticate to an existing one) and return
   * an initialized MachinaVault instance.
   */
  static async create(config: VaultConfig): Promise<MachinaVault> {
    const vault = new MachinaVault(config);
    await vault.authenticate();
    const vaultInfo = await vault.http.post<VaultInfo>("/vault");
    vault.vaultId = vaultInfo.id;
    return vault;
  }

  /**
   * Connect to an existing vault without creating one.
   */
  static async connect(config: VaultConfig): Promise<MachinaVault> {
    const vault = new MachinaVault(config);
    await vault.authenticate();
    const vaultInfo = await vault.http.get<VaultInfo>("/vault");
    vault.vaultId = vaultInfo.id;
    return vault;
  }

  // ── Sub-module accessors ────────────────────────────────────────────

  get keys(): KeyManager {
    this.ensureConnected();
    if (!this._keys) {
      this._keys = new KeyManager(this.http, this.vaultId!);
    }
    return this._keys;
  }

  get signing(): SigningManager {
    this.ensureConnected();
    if (!this._signing) {
      this._signing = new SigningManager(this.http, this.vaultId!);
    }
    return this._signing;
  }

  get balances(): BalanceManager {
    this.ensureConnected();
    if (!this._balances) {
      this._balances = new BalanceManager(this.http, this.vaultId!);
    }
    return this._balances;
  }

  get identity(): IdentityManager {
    this.ensureConnected();
    if (!this._identity) {
      this._identity = new IdentityManager(this.http, this.vaultId!);
    }
    return this._identity;
  }

  get reputation(): ReputationManager {
    this.ensureConnected();
    if (!this._reputation) {
      this._reputation = new ReputationManager(this.http, this.vaultId!);
    }
    return this._reputation;
  }

  get policy(): PolicyManager {
    this.ensureConnected();
    if (!this._policy) {
      this._policy = new PolicyManager(this.http, this.vaultId!);
    }
    return this._policy;
  }

  // ── Instance methods ───────────────────────────────────────────────

  /**
   * Get vault info.
   */
  async info(): Promise<VaultInfo> {
    this.ensureConnected();
    return this.http.get<VaultInfo>(`/vault/${this.vaultId}`);
  }

  /**
   * Check a counterparty address for reputation, sanctions, and risk.
   */
  async checkCounterparty(address: string): Promise<CounterpartyProfile> {
    this.ensureConnected();
    return this.http.get<CounterpartyProfile>(
      `/vault/${this.vaultId}/counterparty/${address}`,
    );
  }

  /**
   * Destroy the vault session and revoke any active sessions.
   */
  async destroy(): Promise<void> {
    if (this.vaultId) {
      await this.http.post(`/vault/${this.vaultId}/destroy`);
    }
    this.vaultId = null;
    this._keys = null;
    this._signing = null;
    this._balances = null;
    this._identity = null;
    this._reputation = null;
    this._policy = null;
  }

  // ── Private ─────────────────────────────────────────────────────────

  private async authenticate(): Promise<void> {
    const auth = this.config.auth;

    switch (auth.type) {
      case "passkey":
        await this.authenticatePasskey();
        break;
      case "apikey":
        this.validateApiKey(auth.key);
        break;
      case "session":
        // Session token is used directly in headers; no pre-auth needed.
        break;
    }
  }

  private async authenticatePasskey(): Promise<void> {
    if (typeof globalThis.navigator === "undefined" || !navigator.credentials) {
      throw new VaultError(
        "WebAuthn is not available in this environment",
        "WEBAUTHN_UNAVAILABLE",
        0,
        {},
      );
    }

    // Request a challenge from the server
    const challenge = await this.http.post<{
      challenge: string;
      rpId: string;
      allowCredentials?: Array<{ id: string; type: string }>;
    }>("/auth/passkey/challenge");

    // Decode the base64url challenge
    const challengeBuffer = this.base64urlToBuffer(challenge.challenge);

    const allowCredentials = challenge.allowCredentials?.map((c) => ({
      id: this.base64urlToBuffer(c.id),
      type: "public-key" as const,
    }));

    const credential = (await navigator.credentials.get({
      publicKey: {
        challenge: challengeBuffer,
        rpId: challenge.rpId,
        allowCredentials,
        userVerification: "preferred",
      },
    })) as PublicKeyCredential | null;

    if (!credential) {
      throw new VaultError(
        "Passkey authentication was cancelled",
        "PASSKEY_CANCELLED",
        0,
        {},
      );
    }

    const assertionResponse =
      credential.response as AuthenticatorAssertionResponse;

    // Send assertion to the server to get a session token
    await this.http.post("/auth/passkey/verify", {
      credentialId: credential.id,
      authenticatorData: this.bufferToBase64url(
        assertionResponse.authenticatorData,
      ),
      clientDataJSON: this.bufferToBase64url(
        assertionResponse.clientDataJSON,
      ),
      signature: this.bufferToBase64url(assertionResponse.signature),
    });
  }

  private validateApiKey(key: string): void {
    if (!key || key.length < 16) {
      throw new VaultError(
        "Invalid API key format: key must be at least 16 characters",
        "INVALID_API_KEY",
        0,
        {},
      );
    }
  }

  private async buildAuthHeaders(): Promise<Record<string, string>> {
    const auth = this.config.auth;
    switch (auth.type) {
      case "apikey":
        return { Authorization: `Bearer ${auth.key}` };
      case "session":
        return { Authorization: `Bearer ${auth.token}` };
      case "passkey":
        // After passkey auth, the server sets a session cookie or
        // the challenge/verify flow returns a token stored internally.
        // For now, rely on cookie-based sessions.
        return {};
      default:
        return {};
    }
  }

  private ensureConnected(): void {
    if (!this.vaultId) {
      throw new VaultError(
        "Vault is not connected. Call MachinaVault.create() or MachinaVault.connect() first.",
        "NOT_CONNECTED",
        0,
        {},
      );
    }
  }

  // ── Base64url helpers (browser-safe, no Node.js Buffer) ────────────

  private base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
}
