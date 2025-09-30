# sm-crypto-plus

国密算法sm2、sm3、sm4的TS实现

基于 [sm-crypto](https://github.com/JuneAndGreen/sm-crypto) ，做了如下改动：

1. 补充TS类型。
2. 使用 ESM 组织代码，支持打包工具tree-shaking。
3. sm2默认添加04前缀，解决与Java hultool等其它库加解密不兼容的问题。（相关issues: https://github.com/JuneAndGreen/sm-crypto/issues/123 ）
4. 加密可选输出base64和hex、解密支持密文hex、array和base64格式。
5. 密钥支持hex、array和base64格式。
6. 替换了一些原生函数，兼容IE11。
7. 新增一些帮助函数：generateKey、hexToBase64、base64ToHex等，详见`src/helpers.ts`

## 安装

```shell
npm install sm-crypto-plus
```

## 示例

## sm2
### 获取密钥对
```ts
import {
  generateKeyPairHex,
  compressPublicKeyHex,
  verifyPublicKey,
  comparePublicKeyHex,
  getPublicKeyFromPrivateKey,
} from 'sm-crypto-plus/sm2';

// 生成密钥，hex格式
const {
  // 公钥65字节(非压缩，包含1字压缩识符)
  publicKey,
  // 私钥32字节
  privateKey,
} = generateKeyPairHex();

console.log('publicKey: ', publicKey);
//publicKey:  048b0447085665eb717f40fab26c219707334745f895e4b2cbbee044e4315997d4b54818c9134264e2ddc8d632587cfbf067af6a8901241048915c7da4daee844a
console.log('privateKey: ', privateKey);
//privateKey:  2111cc0ab3e721bd6a549c2c936bef25a73367406bea528505d580fb7617880f


/* ----------------------------更多功能示例------------------------------------- */

// 压缩公钥，压缩后33字节
const compressedPublicKey = compressPublicKeyHex(publicKey);
console.log('compressedPublicKey: ', compressedPublicKey);
//compressedPublicKey:  028b0447085665eb717f40fab26c219707334745f895e4b2cbbee044e4315997d4

// 验证公钥
verifyPublicKey(publicKey);
verifyPublicKey(compressedPublicKey)

// 判断压缩前后公钥是否等价
comparePublicKeyHex(publicKey, compressedPublicKey)

// 从私钥中获取公钥
getPublicKeyFromPrivateKey(privateKey);
```
### 加解密
```ts
import {
  generateKeyPairHex,
  encrypt,
  decrypt,
} from 'sm-crypto-plus/sm2';

// 生成hex密钥
const {
  // 公钥65字节(非压缩，包含1字压缩识符)
  publicKey,
  // 私钥32字节
  privateKey,
} = generateKeyPairHex();
console.log('公钥：', publicKey);
console.log('私钥：', privateKey);

const plaintext = `hello, sm-crypto-plus!`;

// 加密
const ciphertext = encrypt(
  plaintext,
  publicKey,
  // {
  //   mode: 'c1c3c2', // 加密模式: 'c1c3c2' | 'c1c2c3'。 默认为'c1c3c2'
  //   output: 'hex', // 'hex' | 'base64'。 输出格式，默认为hex
  //   prefix04: true, // 是否有04前缀。 默认有
  // }
);
console.log('密文：', ciphertext);
//密文： 04b19b984e9f607edcefd00652988743b048907f5584431c3d0c6f326d4772e56c7f71c3b0ce8de2cd5f90c4bfff7a0c779dd4c023e873526890ebdee041719bb02defeb6bd02b886c43e4dda75d2fd4257230724ad2a7b982c1762e301b790e8d3164ddfdee6175326ce00567eca17977ad306cb02b6d

// 解密
const plaintext2 = decrypt(
  ciphertext,
  privateKey,
  // {
  //   mode: 'c1c3c2', // 加密模式: 'c1c3c2' | 'c1c2c3'。 默认为'c1c3c2'
  //   prefix04: true, // 是否有04前缀。 默认有
  // }
);
console.log('明文：', plaintext2);

```

### 签名

> 参考 https://github.com/JuneAndGreen/sm-crypto?tab=readme-ov-file#签名验签

```ts
import {
  generateKeyPairHex,
  doSignature,
  doVerifySignature,
} from 'sm-crypto-plus/sm2'

const {
  publicKey,
  privateKey,
} = generateKeyPairHex();

const msg = `hello, sm-crypto-plus!`;

const sigValueHex = doSignature(msg, privateKey) // 签名
console.log(sigValueHex)

const verifyResult = doVerifySignature(msg, sigValueHex, publicKey) // 验签结果
console.log(verifyResult)
```


## sm3
```ts
import sm3 from 'sm-crypto-plus/sm3'

// const plaintext = `hello, sm-crypto-plus!`;
const plaintext = `hello, sm-crypto-plus!`;

// 基础sm3
const hash = sm3(plaintext);
console.log(hash);
// 4b3dad2df481ec61f5b1be2f567c4b869def8233b6b8d67413de36776fe8e622

// 加盐
const hash2 = sm3(
  plaintext,
  {
    key: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], // 盐值（通常为16字节），格式可以为array、hex和base64，
    output: 'hex', // 'hex' | 'base64' 。 默认'hex'
  }
)
console.log(hash2);
// 340af5cfd9d603d1285ee5618e64b589a31c900f5b648b60242ae80bb5588064
```

## sm4
```ts
import {
  encrypt,
  decrypt,
} from 'sm-crypto-plus/sm4'

// 密钥为16字节，可以使用hex、array、base64
const key = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]; // array
// const key = '0102030405060708090a0b0c0d0e0f10';  // hex
// const key = AQIDBAUGBwgJCgsMDQ4PEA==; // base64


const plaintext = `hello, sm-crypto-plus!`;

// 加密
const ciphertext = encrypt(
  plaintext,
  key,
  // {
  //   output: 'hex' , // 'hex' | 'base64'。 输出格式，默认为hex
  //   padding: 'pkcs#7', // 填充模式，默认'pkcs#7'，可选"none" | "pkcs#5" | "pkcs#7"
  //   mode: 'ecb', // 模式， 'ecb' | 'cbc' 默认使用ecb模式，可选传入cbc
  //   iv: undefined, // 初始向量，长度和格式同key，默认undefined，cbc模式必传
  // }
)

console.log(ciphertext);
// d88996601244967983f3a8414532cad29e18be9834732fc7526a919ba2be5103

// 解密
const plaintext2 = decrypt(
  ciphertext,
  key,
  // {
  //   padding: 'pkcs#7', // 填充模式，默认'pkcs#7'，可选"none" | "pkcs#5" | "pkcs#7"
  //   mode: 'ecb', // 模式， 'ecb' | 'cbc' 默认使用ecb模式，可选传入cbc
  //   iv: undefined, // 初始向量，长度和格式同key，默认undefined，cbc模式必传
  // }
)
console.log('明文：', plaintext2);

// cbc模式
// const iv = [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32]
const iv = '1112131415161718191a1b1c1d1e1f20'
const ciphertextCbc = encrypt(plaintext, key, { mode: 'cbc', iv })
console.log(ciphertextCbc);
// ede860aed47efed413fd19e4b4b3658cb01890a6c2a3694730a65cd4054f6f92
decrypt(ciphertextCbc, key, { mode: 'cbc', iv})
```

## 帮助函数
> 参考 `src/helpers.ts`

```ts
/**
 * 将十六进制字符串转换为十进制数组 (number[])
 * @param hex - 十六进制字符串，可以包含或不包含 "0x" 前缀
 * @returns number[] - 每个元素代表一个字节 (0-255)
 */
export declare function hexToArray(hex: string): number[];
/**
 * 将十进制数组 (number[]) 转换为十六进制字符串
 * @param array - 字节数组，每个元素应为 0-255 之间的整数
 * @returns string - 对应的十六进制字符串（小写字母，无 "0x" 前缀）
 */
export declare function arrayToHex(array: number[]): string;
/**
 * 将十六进制字符串转换为 Base64 编码
 * @param hex - 十六进制字符串（可带 "0x" 前缀）
 * @returns Base64 编码的字符串
 */
export declare function hexToBase64(hex: string): string;
/**
 * 将 Base64 编码转换为十六进制字符串
 * @param base64 - Base64 编码的字符串
 * @returns 十六进制字符串（小写字母，无 "0x" 前缀）
 */
export declare function base64ToHex(base64: string): string;
/**
 * base64转十进制数组
 *
 * @param {string} base64 - Base64 编码的字符串
 * @return {number[]} 十进制数组
 */
export declare function base64ToArray(base64: string): number[];
/**
 * 十进制数组转base64
 * @param {number[]} array - 十进制数组
 * @return {string} Base64 编码的字符串
 */
export declare function arrayToBase64(array: number[]): string;
/**
 * 检查是否 hexString
 * @param str - 要检查的字符串
 * @returns 如果是有效的十六进制字符串返回 true
 */
export declare function isHexString(str: string): boolean;
/**
 * UTF-8 字符串 → 10 进制字节数组
 */
export declare function utf8ToArray(str: string): number[];
/**
 * 10 进制字节数组 → UTF-8 字符串
 */
export declare function arrayToUtf8(arr: number[]): string;
export declare function utf8ToHex(str: string): string;
export declare function hexToUtf8(str: string): string;
/**
 * UTF-8 字符串 → Base64
 */
export declare function utf8ToBase64(str: string): string;
/**
 * Base64 → UTF-8 字符串
 */
export declare function base64ToUtf8(b64: string): string;
/**
 * 十进制数组、base64转hex
 * @param input 十进制数组或base64串
 */
export declare function toHex(input: string | number[]): string;
/**
 * 随机生成密钥
 * @param byteCount 字节数，默认16
 */
export declare function generateKey(byteCount?: number): {
  hex: string;
  base64: string;
  array: number[];
};
/**
 * 随机生成密钥(node适用)
 * @param byteCount 字节数，默认16
 */
export declare function generateKeyServerSide(byteCount?: number): {
  hex: string;
  base64: string;
  array: number[];
};
```
