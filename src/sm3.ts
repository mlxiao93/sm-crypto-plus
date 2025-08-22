import legacySm3 from './libs/sm-crypto/sm3';
import { hexToBase64, toHex } from './helpers';

export default function sm3(
  input: string | number[],
  option: {
    key?: string | number[];
    mode?: 'hmac';
    output?: 'hex' | 'base64';
  } = {}
): string {
  const { key, mode = 'hmac', output = 'hex' } = option;

  const keyHex = key ? toHex(key) : key;

  const ciphertext = legacySm3(input, {
    key: keyHex,
    mode,
  });

  if (output === 'base64') {
    return hexToBase64(ciphertext);
  }

  return ciphertext;
}
