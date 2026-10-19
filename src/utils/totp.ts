/**
 * RFC 6238 Time-Based One-Time Password (TOTP) Implementation in TypeScript
 * Compatible with Google Authenticator, Microsoft Authenticator, Authy, etc.
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Decode base32 string into Uint8Array
export function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
  }
  return bytes;
}

// Convert 64-bit integer counter to 8-byte big-endian ArrayBuffer
function counterToBuffer(counter: number): ArrayBuffer {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  // High 32 bits (0 for current epoch times)
  view.setUint32(0, 0, false);
  view.setUint32(4, counter, false);
  return buffer;
}

// Generate 6-digit TOTP code for a given secret and optional time step
export async function generateTOTP(secret: string, timeStepOffset = 0): Promise<string> {
  try {
    const keyBytes = base32ToBytes(secret);
    const counter = Math.floor(Date.now() / 1000 / 30) + timeStepOffset;
    const counterBuffer = counterToBuffer(counter);

    // SubtleCrypto HMAC-SHA1
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBytes as any,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
    const sigBytes = new Uint8Array(signature);

    const offset = sigBytes[sigBytes.length - 1] & 0x0f;
    const binary =
      ((sigBytes[offset] & 0x7f) << 24) |
      ((sigBytes[offset + 1] & 0xff) << 16) |
      ((sigBytes[offset + 2] & 0xff) << 8) |
      (sigBytes[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  } catch (err) {
    console.error('Error generating TOTP:', err);
    return '000000';
  }
}

// Verify 6-digit code with window tolerance (allows -1, 0, +1 time steps to handle clock drift)
export async function verifyTOTP(secret: string, inputCode: string, window = 1): Promise<boolean> {
  const cleanCode = inputCode.replace(/\s+/g, '').trim();
  if (cleanCode.length !== 6) return false;

  for (let offset = -window; offset <= window; offset++) {
    const valid = await generateTOTP(secret, offset);
    if (valid === cleanCode) {
      return true;
    }
  }
  return false;
}
