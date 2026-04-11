import { describe, it, expect } from "vitest";

describe("@machina-xyz/vault", () => {
  it("exports expected modules", async () => {
    const mod = await import("../index.js");
    expect(mod.MachinaVault).toBeDefined();
    expect(mod.KeyManager).toBeDefined();
    expect(mod.SigningManager).toBeDefined();
    expect(mod.BalanceManager).toBeDefined();
    expect(mod.IdentityManager).toBeDefined();
    expect(mod.ReputationManager).toBeDefined();
    expect(mod.PolicyManager).toBeDefined();
  });
});
