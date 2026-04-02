"use client";

import { useState } from "react";

import { Container } from "@/components/common/Container";
import { KeyManager } from "@/lib/wallet/keyManager";
import { WalletStorage } from "@/lib/wallet/walletdb";

export function WalletSetup() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const createWallet = async () => {
    setLoading(true);

    try {
      const keyPair = await KeyManager.generateKeyPair();
      const publicKey = await KeyManager.exportPublicKey(keyPair.publicKey);
      const privateKey = await KeyManager.exportPrivateKey(
        keyPair.privateKey,
        password,
      );

      const wallet = {
        walletId: crypto.randomUUID(),
        publicKey,
        privateKey,
        createdAt: Date.now(),
      };

      const storage = new WalletStorage();
      await storage.init();
      await storage.saveWallet(wallet);

      alert("Wallet created! Public Key:\n" + publicKey);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selection:bg-primary/20 relative w-full">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)",
        }}
      />
      <Container>
        <h2>Create Your CredBind Wallet</h2>
        <input
          type="password"
          placeholder="Set wallet password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={createWallet}
          disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
          type="button"
        >
          {loading ? "Generating..." : "Create Wallet"}
        </button>
      </Container>
    </div>
  );
}
