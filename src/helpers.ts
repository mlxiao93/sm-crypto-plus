/**
 * 将十六进制字符串转换为十进制数组 (number[])
 * @param hex - 十六进制字符串，可以包含或不包含 "0x" 前缀
 * @returns number[] - 每个元素代表一个字节 (0-255)
 */
export function hexToArray(hex: string): number[] {
  if (hex === '') {
    return [];
  }
  if (!isHexString(hex)) {
    throw new Error(`Invalid hex string: "${hex}"`);
  }

  // 移除可能存在的 "0x" 或 "0X" 前缀
  const cleanedHex = hex.replace(/^0x/i, '');

  const array: number[] = [];
  for (let i = 0; i < cleanedHex.length; i += 2) {
    const hexByte = cleanedHex.slice(i, i + 2);
    array.push(parseInt(hexByte, 16));
  }
  return array;
}

/**
 * 将十进制数组 (number[]) 转换为十六进制字符串
 * @param array - 字节数组，每个元素应为 0-255 之间的整数
 * @returns string - 对应的十六进制字符串（小写字母，无 "0x" 前缀）
 */
export function arrayToHex(array: number[]): string {
  return array
    .map(byte => {
      const value = byte & 0xFF; // 确保是8位无符号整数
      return padHex(value);
    })
    .join('');
}

/**
 * 将十六进制字符串转换为 Base64 编码
 * @param hex - 十六进制字符串（可带 "0x" 前缀）
 * @returns Base64 编码的字符串
 */
export function hexToBase64(hex: string): string {
  if (!isHexString(hex)) {
    throw new Error(`Invalid hex string: "${hex}"`);
  }

  const bytes = hexToArray(hex);

  // 将字节数组转换为二进制字符串
  const binaryStr = String.fromCharCode(...bytes);

  // 根据环境选择 Base64 编码方式
  if (typeof btoa === 'function') {
    // 浏览器环境
    return btoa(binaryStr);
  } else if (typeof Buffer !== 'undefined') {
    // Node.js 环境
    return Buffer.from(binaryStr).toString('base64');
  } else {
    throw new Error('Unsupported environment for Base64 encoding');
  }
}

/**
 * 将 Base64 编码转换为十六进制字符串
 * @param base64 - Base64 编码的字符串
 * @returns 十六进制字符串（小写字母，无 "0x" 前缀）
 */
export function base64ToHex(base64: string): string {
  if (!base64) {
    return base64;
  }

  let bytes = base64ToArray(base64);

  return arrayToHex(bytes);
}

/**
 * base64转十进制数组
 *
 * @param {string} base64 - Base64 编码的字符串
 * @return {number[]} 十进制数组
 */
export function base64ToArray(base64: string): number[] {
  if (!base64) {
    return [];
  }

  let bytes: number[] = [];

  if (typeof Buffer !== 'undefined' && Buffer.from) {
    // Node.js 环境
    const buffer = Buffer.from(base64, 'base64');
    bytes = Array.from(buffer);
  } else if (typeof atob === 'function') {
    // 浏览器环境
    const str = atob(base64);
    bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
  } else {
    console.error('Unsupported environment for Base64 decoding');
    throw new Error('Unsupported environment for Base64 decoding');
  }

  return bytes;
}

/**
 * 十进制数组转base64
 * @param {number[]} array - 十进制数组
 * @return {string} Base64 编码的字符串
 */
export function arrayToBase64(array: number[]): string {
  return hexToBase64(arrayToHex(array));
}

/**
 * 为字节补零，确保两位十六进制字符串
 * @param value - 字节值 (0-255)
 * @returns 补零后的两位十六进制字符串（小写）
 */
function padHex(value: number): string {
  const hex = value.toString(16).toLowerCase();
  return hex.length === 1 ? `0${hex}` : hex;
}

/**
 * 检查是否 hexString
 * @param str - 要检查的字符串
 * @returns 如果是有效的十六进制字符串返回 true
 */
export function isHexString(str: string): boolean {
  if (!str) {
    return false;
  }

  const cleanedHex = str.replace(/^0x/i, '');

  // 检查长度是否为偶数
  if (cleanedHex.length % 2 !== 0) {
    return false;
  }

  // 检查是否只包含有效的十六进制字符
  return /^[0-9A-Fa-f]+$/.test(cleanedHex);
}

/**
 * 简单判断字符串是否Base64字符串
 * @param str - 要检查的字符串
 * @param options - 可选参数：是否允许 URL 安全字符（默认 false）
 * @returns 如果是有效的 Base64 编码返回 true
 */
function isBase64Like(str: string, options: { urlSafe?: boolean } = {}): boolean {
  if (!str) {
    return false;
  }

  const { urlSafe = false } = options;

  // 正则表达式匹配标准 Base64 字符
  const base64Regex = urlSafe
    ? /^([A-Za-z0-9+/_-]*={0,2})$/
    : /^([A-Za-z0-9+/]*={0,2})$/;

  if (!base64Regex.test(str)) {
    return false;
  }

  // 检查字符串长度是否为 4 的倍数
  if (str.length % 4 !== 0) {
    return false;
  }

  return true;
}

/**
 * 十进制数组、base64转hex
 * @param input 十进制数组或base64串
 */
export function toHex(input: string | number[]): string {

  if (Array.isArray(input)) {
    return arrayToHex(input);
  }

  if (isHexString(input)) {
    return input;
  }

  if (isBase64Like(input)) {
    try {
      return base64ToHex(input);
    } catch (e) {}
  }

  return input;
}

/**
 * 随机生成密钥
 * @param byteCount 字节数，默认16
 */
export function generateKey(
  byteCount: number = 16,
): {
  hex: string;
  base64: string;
  array: number[];
} {
  // @ts-ignore
  const crypto = window.crypto || window.msCrypto;
  const u8Array = crypto.getRandomValues(new Uint8Array(byteCount))
  const array = [].slice.call(u8Array);
  const hex = arrayToHex(array);
  const base64 = hexToBase64(hex)

  return {
    hex,
    base64,
    array,
  }
}

/**
 * 随机生成密钥(node适用)
 * @param byteCount 字节数，默认16
 */
export function generateKeyServerSide(
  byteCount: number = 16,
): {
  hex: string;
  base64: string;
  array: number[];
}  {
  const crypto = require('crypto');
  const hex = crypto.randomBytes(byteCount).toString('hex');
  const base64 = hexToBase64(hex);
  const array = hexToArray(hex);

  return {
    hex,
    base64,
    array,
  }
}
