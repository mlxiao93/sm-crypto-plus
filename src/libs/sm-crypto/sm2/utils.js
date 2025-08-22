/* eslint-disable no-bitwise, no-mixed-operators, no-use-before-define, max-len */
import {BigInteger, SecureRandom} from '../../jsbn'
import {ECCurveFp} from  './ec'

const rng = new SecureRandom()
const {curve, G, n} = generateEcparam()

/**
 * 获取公共椭圆曲线
 */
function getGlobalCurve() {
  return curve
}

/**
 * 生成ecparam
 */
function generateEcparam() {
  // 椭圆曲线
  const p = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF', 16)
  const a = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC', 16)
  const b = new BigInteger('28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93', 16)
  const curve = new ECCurveFp(p, a, b)

  // 基点
  const gxHex = '32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7'
  const gyHex = 'BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0'
  const G = curve.decodePointHex('04' + gxHex + gyHex)

  const n = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123', 16)

  return {curve, G, n}
}

/**
 * 生成密钥对：publicKey = privateKey * G
 * @param [a] {any}
 * @param [b] {any}
 * @param [c] {any}
 * @returns {{privateKey: string, publicKey: string}}
 */
function generateKeyPairHex(a, b, c) {
  const random = a ? new BigInteger(a, b, c) : new BigInteger(n.bitLength(), rng)
  const d = random.mod(n.subtract(BigInteger.ONE)).add(BigInteger.ONE) // 随机数
  const privateKey = leftPad(d.toString(16), 64)

  const P = G.multiply(d) // P = dG，p 为公钥，d 为私钥
  const Px = leftPad(P.getX().toBigInteger().toString(16), 64)
  const Py = leftPad(P.getY().toBigInteger().toString(16), 64)
  const publicKey = '04' + Px + Py

  return {privateKey, publicKey}
}

/**
 * 生成压缩公钥
 */
function compressPublicKeyHex(s) {
  if (s.length !== 130) throw new Error('Invalid public key to compress')

  const len = (s.length - 2) / 2
  const xHex = s.substr(2, len)
  const y = new BigInteger(s.substr(len + 2, len), 16)

  let prefix = '03'
  if (y.mod(new BigInteger('2')).equals(BigInteger.ZERO)) prefix = '02'

  return prefix + xHex
}

/**
 * utf8串转16进制串
 */
function utf8ToHex(input) {
  input = unescape(encodeURIComponent(input))

  const length = input.length

  // 转换到字数组
  const words = []
  for (let i = 0; i < length; i++) {
    words[i >>> 2] |= (input.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8)
  }

  // 转换到16进制
  const hexChars = []
  for (let i = 0; i < length; i++) {
    const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    hexChars.push((bite >>> 4).toString(16))
    hexChars.push((bite & 0x0f).toString(16))
  }

  return hexChars.join('')
}

/**
 * 补全16进制字符串
 */
function leftPad(input, num) {
  if (input.length >= num) return input

  return (new Array(num - input.length + 1)).join('0') + input
}

/**
 * 转成16进制串
 */
function arrayToHex(arr) {
  return arr.map(item => {
    item = item.toString(16)
    return item.length === 1 ? '0' + item : item
  }).join('')
}

/**
 * 转成utf8串
 */
function arrayToUtf8(arr) {
  const words = []
  let j = 0
  for (let i = 0; i < arr.length * 2; i += 2) {
    words[i >>> 3] |= parseInt(arr[j], 10) << (24 - (i % 8) * 4)
    j++
  }

  try {
    const latin1Chars = []

    for (let i = 0; i < arr.length; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
      latin1Chars.push(String.fromCharCode(bite))
    }

    return decodeURIComponent(escape(latin1Chars.join('')))
  } catch (e) {
    throw new Error('Malformed UTF-8 data')
  }
}

/**
 * 转成字节数组
 */
function hexToArray(hexStr) {
  const words = []
  let hexStrLength = hexStr.length

  if (hexStrLength % 2 !== 0) {
    hexStr = leftPad(hexStr, hexStrLength + 1)
  }

  hexStrLength = hexStr.length

  for (let i = 0; i < hexStrLength; i += 2) {
    words.push(parseInt(hexStr.substr(i, 2), 16))
  }
  return words
}

/**
 * 验证公钥是否为椭圆曲线上的点
 */
function verifyPublicKey(publicKey) {
  const point = curve.decodePointHex(publicKey)
  if (!point) return false

  const x = point.getX()
  const y = point.getY()

  // 验证 y^2 是否等于 x^3 + ax + b
  return y.square().equals(x.multiply(x.square()).add(x.multiply(curve.a)).add(curve.b))
}

/**
 * 验证公钥是否等价，等价返回true
 */
function comparePublicKeyHex(publicKey1, publicKey2) {
  const point1 = curve.decodePointHex(publicKey1)
  if (!point1) return false

  const point2 = curve.decodePointHex(publicKey2)
  if (!point2) return false

  return point1.equals(point2)
}

function trunc(n) {
  if (Math.trunc) {
    return Math.trunc(n);
  }
  const num = Number(n);
  if (isNaN(num)) return NaN;

  // 特殊值处理
  if (num === Infinity) return Infinity;
  if (num === -Infinity) return -Infinity;

  // 根据符号选择 floor 或 ceil
  return num < 0 ? Math.ceil(num) : Math.floor(num);
}

function codePointAt(s, pos) {
  if (String.prototype.codePointAt) {
    return s.codePointAt(pos);
  }
  const len = s.length;
  const posNum = Number(pos);
  if (isNaN(posNum)) return undefined;

  const index = trunc(posNum);
  if (index < 0 || index >= len) return undefined;

  const c0 = s.charCodeAt(index);

  if (c0 >= 0xD800 && c0 <= 0xDBFF && index + 1 < len) {
    const c1 = s.charCodeAt(index + 1);
    if (c1 >= 0xDC00 && c1 <= 0xDFFF) {
      return (c0 - 0xD800) * 0x400 + (c1 - 0xDC00) + 0x10000;
    }
  }

  return c0;
}

function arrayFill(arr, value, start = 0, end) {
  if (Array.prototype.fill) {
    arr.fill(value, start, end);
    return arr;
  }
  const len = arr.length;

  // 1. 转整数（处理 NaN）
  const toInteger = (n) => {
    n = Number(n);
    if (isNaN(n)) return 0; // 模拟原生 fill 的行为（或抛出错误？）
    return trunc(n);
  };

  let s = toInteger(start);
  let e = end === undefined ? len : toInteger(end);

  // 2. 处理负数索引
  if (s < 0) s += len;
  if (s < 0) s = 0;
  if (s > len) s = len;

  if (e < 0) e += len;
  if (e < 0) e = 0;
  if (e > len) e = len;

  // 3. 保证 s <= e
  const left = Math.min(s, e);
  const right = Math.max(s, e);

  // 4. 填充
  for (let i = left; i < right; i++) {
    arr[i] = value;
  }

  return arr;
}

function fromCodePoint(...codePoints) {
  if (String.fromCodePoint) {
    return String.fromCodePoint(...codePoints)
  }
  let result = '';

  for (let code of codePoints) {
    // 1. 转换为数字
    let num = Number(code);
    if (isNaN(num)) {
      throw new TypeError("Invalid code point");
    }

    // 2. 转换为整数（模拟 ToInteger）
    num = trunc(num);

    // 3. 检查码点是否合法
    if (num < 0 || num > 0x10FFFF || (num >= 0xD800 && num <= 0xDFFF)) {
      throw new RangeError("Code point out of range");
    }

    // 4. 处理码点
    if (num <= 0xFFFF) {
      result += String.fromCharCode(num);
    } else {
      const surrogate = num - 0x10000;
      const high = 0xD800 + (surrogate >> 10);
      const low = 0xDC00 + (surrogate & 0x3FF);
      result += String.fromCharCode(high, low);
    }
  }

  return result;
}

export {
  getGlobalCurve,
  generateEcparam,
  generateKeyPairHex,
  compressPublicKeyHex,
  utf8ToHex,
  leftPad,
  arrayToHex,
  arrayToUtf8,
  hexToArray,
  verifyPublicKey,
  comparePublicKeyHex,
  codePointAt,
  arrayFill,
  fromCodePoint,
}
