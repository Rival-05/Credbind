import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface WalletDB extends DBSchema {
  wallet: {
    key: string;
    value: {
      walletId: string;
      publicKey: string;
      privateKey: string;
      createdAt: number;
    };
  };
  credentials: {
    key: string;
    value: {
      cid: string;
      issuer: string;
      issuedDate: string;
      metadata: unknown;
    };
  };
}

export class WalletStorage {
  private db: IDBPDatabase<WalletDB> | null = null;

  async init() {
    this.db = await openDB<WalletDB>("CredBindWallet", 1, {
      upgrade(db) {
        db.createObjectStore("wallet");
        db.createObjectStore("credentials", { keyPath: "cid" });
      },
    });
  }

  async saveWallet(wallet: WalletDB["wallet"]["value"]) {
    await this.db!.put("wallet", wallet, "main");
  }

  async getWallet() {
    return this.db!.get("wallet", "main");
  }

  async addCredential(credential: WalletDB["credentials"]["value"]) {
    await this.db!.add("credentials", credential);
  }

  async getAllCredentials() {
    return this.db!.getAll("credentials");
  }
}