import {
  doEncrypt as legacyEncrypt,
  doDecrypt as legacyDecrypt,
} from './libs/sm-crypto/sm2';
import { hexToBase64, toHex } from './helpers';

export {
  generateKeyPairHex,
  compressPublicKeyHex,
  comparePublicKeyHex,
  doSignature,
  getHash,
  getPoint,
  verifyPublicKey,
  doVerifySignature,
  getPublicKeyFromPrivateKey,
} from './libs/sm-crypto/sm2'

export function encrypt(
  input: string | number[],
  publicKey: string | number[],
  option: {
    mode?: 'c1c3c2' | 'c1c2c3'
    output?: 'hex' | 'base64';
    prefix04?: boolean;
  } = {}
): string {
  const publicKeyHex = toHex(publicKey);

  const { output = 'hex', prefix04 = true, mode = 'c1c3c2' } = option;

  let ciphertextHex = legacyEncrypt(input, publicKeyHex, mode === 'c1c2c3' ? 0 : 1);

  if (prefix04) {
    ciphertextHex = `04${ciphertextHex}`;
  }

  if (output === 'base64') {
    return hexToBase64(ciphertextHex);
  }

  return ciphertextHex;
}

export function decrypt(
  input: string | number[],
  privateKey: string | number[],
  option: {
    mode?: 'c1c3c2' | 'c1c2c3'
    prefix04?: boolean;
  } = {}
): string {
  const { prefix04 = true, mode = 'c1c3c2' } = option;

  let ciphertextHex = toHex(input);
  const privateKeyHex = toHex(privateKey);

  if (prefix04) {
    ciphertextHex = ciphertextHex.replace(/^04/, '');
  }

  return legacyDecrypt(ciphertextHex, privateKeyHex, mode === 'c1c2c3' ? 0 : 1, {
    output: 'string',
  }) as string;
}
