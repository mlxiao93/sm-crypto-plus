import {
  sm2 as legacySm2,
  sm3 as legacySm3,
  sm4 as legacySm4,
} from './libs/sm-crypto';

export {
  hexToArray,
  arrayToHex,
  base64ToHex,
  hexToBase64,
  toHex,
  isHexString,
  generateKey,
  generateKeyServerSide,
  base64ToArray,
  arrayToBase64
} from './helpers';

import {
  encrypt as sm2Encrypt,
  decrypt as sm2Decrypt,
  generateKeyPairHex,
  compressPublicKeyHex,
  comparePublicKeyHex,
  doSignature,
  getHash,
  getPoint,
  verifyPublicKey,
  doVerifySignature,
  getPublicKeyFromPrivateKey,
} from './sm2';

import sm3 from './sm3'

import {
  encrypt as sm4Encrypt,
  decrypt as sm4Decrypt,
} from './sm4';

const sm2 = {
  encrypt: sm2Encrypt,
  decrypt: sm2Decrypt,
  doEncrypt: sm2Encrypt,
  doDecrypt: sm2Decrypt,
  generateKeyPairHex,
  compressPublicKeyHex,
  comparePublicKeyHex,
  doSignature,
  getHash,
  getPoint,
  verifyPublicKey,
  doVerifySignature,
  getPublicKeyFromPrivateKey,
}

const sm4 = {
  encrypt: sm4Encrypt,
  decrypt: sm4Decrypt,
}

export {
  legacySm2,
  legacySm3,
  legacySm4,

  sm2,
  sm2Encrypt,
  sm2Decrypt,
  sm3,
  sm4,
  sm4Encrypt,
  sm4Decrypt,
};
