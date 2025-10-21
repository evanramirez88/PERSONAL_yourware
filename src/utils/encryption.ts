import CryptoJS from 'crypto-js';

const SECRET_STORAGE_KEY = 'yourware::crypto::secret';

function getOrCreateSecret(): string {
  let secret = localStorage.getItem(SECRET_STORAGE_KEY);
  if (!secret) {
    secret = CryptoJS.lib.WordArray.random(16).toString();
    localStorage.setItem(SECRET_STORAGE_KEY, secret);
  }
  return secret;
}

export function encrypt(value: string): string {
  const secret = getOrCreateSecret();
  return CryptoJS.AES.encrypt(value, secret).toString();
}

export function decrypt(value: string): string {
  try {
    const secret = getOrCreateSecret();
    const bytes = CryptoJS.AES.decrypt(value, secret);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return decoded || '';
  } catch (error) {
    console.error('Failed to decrypt value', error);
    return '';
  }
}
