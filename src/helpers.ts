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
  return str.length % 4 === 0;


}

/**
 * UTF-8 字符串 → 10 进制字节数组
 */
export function utf8ToArray(str: string): number[] {

  if (typeof Buffer !== 'undefined') {
    // Node.js
    return Array.prototype.slice.call(Buffer.from(str, 'utf8'));
  }

  if (typeof TextEncoder !== 'undefined') {
    return Array.prototype.slice.call(new TextEncoder().encode(str));
  }

  /** 兼容IE11 */
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);

    if (c < 128) {
      bytes.push(c);
    } else if (c < 2048) {
      bytes.push((c >> 6) | 192);
      bytes.push((c & 63) | 128);
    } else if (c >= 0xD800 && c < 0xDC00) {
      // 处理 Unicode 代理对（如表情符号）
      const high = c;
      const low = str.charCodeAt(++i);
      c = ((high & 0x3FF) << 10) | (low & 0x3FF);
      bytes.push((c >> 18) | 240);
      bytes.push(((c >> 12) & 63) | 128);
      bytes.push(((c >> 6) & 63) | 128);
      bytes.push((c & 63) | 128);
    } else {
      bytes.push((c >> 12) | 224);
      bytes.push(((c >> 6) & 63) | 128);
      bytes.push((c & 63) | 128);
    }
  }

  return bytes;
}

/**
 * 10 进制字节数组 → UTF-8 字符串
 */
export function arrayToUtf8(arr: number[]): string {
  if (!Array.isArray(arr) || arr.some(v => v < 0 || v > 255))
    throw new TypeError('Invalid byte array');

  if (typeof Buffer !== 'undefined') {
    // Node.js
    return Buffer.from(new Uint8Array(arr)).toString('utf8');
  }

  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(new Uint8Array(arr));
  }

  /** 兼容IE11 */
  const chars: string[] = [];
  let i = 0;

  while (i < arr.length) {
    let c = arr[i++];

    if (c < 128) {
      chars.push(String.fromCharCode(c));
    } else if (c > 191 && c < 224) {
      chars.push(String.fromCharCode(((c & 31) << 6) | (arr[i++] & 63)));
    } else if (c > 223 && c < 240) {
      chars.push(String.fromCharCode(
        ((c & 15) << 12) | ((arr[i++] & 63) << 6) | (arr[i++] & 63)
      ));
    } else {
      chars.push(String.fromCharCode(
        ((c & 7) << 18) | ((arr[i++] & 63) << 12) | ((arr[i++] & 63) << 6) | (arr[i++] & 63)
      ));
    }
  }

  return chars.join('');
}

export function utf8ToHex(str: string): string {
  return arrayToHex(utf8ToArray(str));
}

export function hexToUtf8(str: string): string {
  return arrayToUtf8(hexToArray(str));
}

/**
 * UTF-8 字符串 → Base64
 */
export function utf8ToBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    // Node.js
    return Buffer.from(str, 'utf8').toString('base64');
  }

  const utf8 = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p) =>
    String.fromCharCode(parseInt(p, 16))
  );
  return btoa(utf8);
}

/**
 * Base64 → UTF-8 字符串
 */
export function base64ToUtf8(b64: string): string {
  if (typeof Buffer !== 'undefined') {
    // Node.js
    return Buffer.from(b64, 'base64').toString('utf8');
  }

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return decodeURIComponent(
    Array.prototype.map.call(bytes, (b: number) => '%' + padHex(b)).join('')
  );
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
