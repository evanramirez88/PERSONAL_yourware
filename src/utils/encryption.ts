import CryptoJS from 'crypto-js';

const SECRET = 'youware-local-secret';

export const encrypt = (value: string) => {
  return CryptoJS.AES.encrypt(value, SECRET).toString();
};

export const decrypt = (value: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(value, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Failed to decrypt value', error);
    return '';
  }
};
