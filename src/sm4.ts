import {
  type SM4ModeBase,
} from './libs/sm-crypto';
import {
  encrypt as legacyEncrypt,
  decrypt as legacyDecrypt,
} from './libs/sm-crypto/sm4'
import { hexToBase64, TextEncode, toHex } from './helpers';

export function encrypt(
  input: string | number[],
  key: string | number[],
  option: SM4ModeBase & {
    keyEncode?: TextEncode;
    ivEncode?: TextEncode;
    output?: 'hex' | 'base64';
  } = {}
): string {
  const { output = 'hex', iv, ivEncode, keyEncode } = option;
  const keyHex = key ? toHex(key, keyEncode) : key;
  const ivHex = iv ? toHex(iv, ivEncode ?? keyEncode) : iv;
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
  option: SM4ModeBase & {
    keyEncode?: TextEncode;
    inputEncode?: TextEncode;
  } = {}
): string {
  const { iv, keyEncode, inputEncode } = option;
  let ciphertextHex = toHex(input, inputEncode);
  const keyHex = key ? toHex(key, keyEncode) : key;
  const ivHex = iv ? toHex(iv, keyEncode) : iv;
  return legacyDecrypt(ciphertextHex, keyHex, {
    ...option,
    iv: ivHex,
    output: 'string',
  });
}
