import BigInteger from 'bigi';

export interface KeyPairHex {
  privateKey: string;
  publicKey: string;
}

export interface KeyPairPoint extends KeyPairHex {
  k: BigInteger;
  x1: BigInteger;
}

/**
 * Cipher Mode
 * - `0`：C1C2C3
 * - `1`：C1C3C2
 */
export type CipherMode = 0 | 1;

export type HexString = string;

export interface SM4ModeBase {
  padding?: "none" | "pkcs#5" | "pkcs#7";
  mode?: "ecb" | "cbc";
  iv?: number[] | HexString;
}

export interface SM4Mode_StringOutput extends SM4ModeBase {
  output: "string";
}

export interface SM4Mode_ArrayOutput extends SM4ModeBase {
  output: "array";
}

import sm2, {
  doSignature,
  getHash,
  getPoint,
  doVerifySignature,
  getPublicKeyFromPrivateKey,
} from './sm2';

import {
  generateKeyPairHex,
  compressPublicKeyHex,
  comparePublicKeyHex,
  verifyPublicKey,
} from './sm2/utils';

import sm3 from './sm3';
import sm4 from './sm4';

export {
  sm2,
  sm3,
  sm4,
  generateKeyPairHex,
  compressPublicKeyHex,
  comparePublicKeyHex,
  doSignature,
  getHash,
  getPoint,
  verifyPublicKey,
  doVerifySignature,
  getPublicKeyFromPrivateKey,
};
