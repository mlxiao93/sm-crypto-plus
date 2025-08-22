import {
  type SM4ModeBase,
} from './libs/sm-crypto';
import {
  encrypt as legacyEncrypt,
  decrypt as legacyDecrypt,
} from './libs/sm-crypto/sm4'
import { hexToBase64, toHex } from './helpers';

export function encrypt(
  input: string | number[],
  key: string | number[],
  option: SM4ModeBase & {
    output?: 'hex' | 'base64';
  } = {}
): string {
  const { output = 'hex', iv } = option;
  const keyHex = key ? toHex(key) : key;
  const ivHex = iv ? toHex(iv) : iv;
  const ciphertext = legacyEncrypt(input, keyHex, {
    ...option,
    iv: ivHex,
    output: 'string',
  });

  if (output === 'base64') {
    return hexToBase64(ciphertext);
  }

  return ciphertext;
}

export function decrypt(
  input: number[] | string,
  key: number[] | string,
  option: SM4ModeBase = {}
): string {
  const { iv } = option;
  let ciphertextHex = toHex(input);
  const keyHex = key ? toHex(key) : key;
  const ivHex = iv ? toHex(iv) : iv;
  return legacyDecrypt(ciphertextHex, keyHex, {
    ...option,
    iv: ivHex,
    output: 'string',
  });
}
