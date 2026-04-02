type CertificateDetails = Record<string, string>;

async function importCryptoKey(
  jwk: JsonWebKey,
  usages: KeyUsage[],
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    usages,
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [],
  );
  return bytes.buffer;
}

async function signOrVerifyPayload(details: CertificateDetails) {
  const encoder = new TextEncoder();
  return encoder.encode(JSON.stringify(details));
}

export async function signCertificate(
  details: CertificateDetails,
  privateKeyJwk: JsonWebKey,
) {
  const data = await signOrVerifyPayload(details);
  const cryptoKey = await importCryptoKey(privateKeyJwk, ["sign"]);

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    cryptoKey,
    data,
  );

  return toHex(signature);
}

export async function verifyCertificate(
  details: CertificateDetails,
  signatureHex: string,
  publicKeyJwk: JsonWebKey,
) {
  const data = await signOrVerifyPayload(details);
  const cryptoKey = await importCryptoKey(publicKeyJwk, ["verify"]);

  return crypto.subtle.verify(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    cryptoKey,
    hexToBuffer(signatureHex),
    data,
  );
}