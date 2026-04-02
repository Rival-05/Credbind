export class KeyManager {
  static async generateKeyPair(): Promise<CryptoKeyPair> {
    return window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"],
    );
  }

  static async exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const jwk = await window.crypto.subtle.exportKey("jwk", publicKey);
    return JSON.stringify(jwk);
  }

  static async exportPrivateKey(
    privateKey: CryptoKey,
    password: string,
  ): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("jwk", privateKey);
    return this.encryptPrivateKey(JSON.stringify(exported), password);
  }

  private static async encryptPrivateKey(
    payload: string,
    password: string,
  ): Promise<string> {
    const encoder = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const baseKey = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"],
    );

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encoder.encode(payload),
    );

    const envelope = {
      v: 1,
      alg: "AES-GCM",
      kdf: "PBKDF2",
      salt: this.arrayBufferToBase64(salt.buffer),
      iv: this.arrayBufferToBase64(iv.buffer),
      data: this.arrayBufferToBase64(ciphertext),
    };

    return JSON.stringify(envelope);
  }

  static async signChallenge(
    privateKey: CryptoKey,
    challenge: string,
  ): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(challenge);

    const signature = await window.crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: { name: "SHA-256" },
      },
      privateKey,
      data,
    );

    return this.arrayBufferToBase64(signature);
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }
    return window.btoa(binary);
  }
}