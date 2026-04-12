export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );

  return keyPair;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export async function exportPublicKey(publicKey: CryptoKey) {
  const spki = await window.crypto.subtle.exportKey("spki", publicKey);
  return arrayBufferToBase64(spki);
}

export async function exportPrivateKey(privateKey: CryptoKey) {
  const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  return arrayBufferToBase64(pkcs8);
}

function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function importPrivateKey(base64Key: string) {
  const buffer = base64ToArrayBuffer(base64Key);

  return await window.crypto.subtle.importKey(
    "pkcs8",
    buffer,
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign"]
  );
}

export async function signNonce(
  privateKey: CryptoKey,
  nonce: string
) {
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);

  const signature = await window.crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: "SHA-256",
    },
    privateKey,
    data
  );

  return arrayBufferToBase64(signature);
}