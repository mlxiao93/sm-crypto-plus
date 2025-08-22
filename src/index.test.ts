import {
  sm2,
  sm3,
  sm4,
  isHexString, toHex
} from './index';

describe('sm crypto pro', () => {
  const plaintext = `hello world! 我是 xiaomaolin.`;

  test('sm2', () => {
    const publicKey = `BJ1ACOj7ZxkXInkM0eFAqEKUzxxRHqMiuXp1rP2LqNRH7PgkoKxkkrpbQjcNB/GeS7qGWtmO/PIsBxK68srQM1g=`;
    const privateKey = `AOwciozA+K5h2xGvYpcmVf+waPO4vaKAn/mRz3qhJ46B`
    const ciphertext = `BP46mJ6IPKIQxijrbuusHTjtiA5HqThTXgwHdQNRJgSBP7YHj8xklc6QUhi4empXaYWNam8t0+TVpKL/KNJ2sNK3MFOsdtAha/A7p/658B8DJ5vBNOnCYYr98nSv2H7gKcGMfU+MNOqNFW0MXJR3J2im1vJM3uqeSYKa50oLVDQ=`;

    expect(sm2.decrypt(ciphertext, privateKey))
      .toBe(plaintext);
    const ciphertext2 = sm2.encrypt(plaintext, publicKey)
    expect(isHexString(ciphertext2)).toBeTruthy();
    const ciphertext3 = sm2.encrypt(plaintext, publicKey, { output: 'base64' })
    expect(isStandardBase64(ciphertext3)).toBeTruthy();
    expect(sm2.decrypt(ciphertext2, privateKey))
      .toBe(plaintext);
    expect(sm2.decrypt(ciphertext3, privateKey))
      .toBe(plaintext);
  })

  test('sm2 长明文', () => {
    // const plaintext = 'hello world! 我是 xiaomaolin.';
    const plaintext = `{"version":"V1.0.1","ppkgVersion":"V1.0.0.2","reqId":"30acFSEbUMuizLzqPNVy9v","urlId":"urlid00000001","authAplyNo":"AP2025031700000001","idntyIdNm":"测试企业","idntyIdType":"01","idntyIdNo":"TEST00000000000001","infUseOrgCode":"B10411000H0001","loginChanl":"01","operatorType":"1","operatorNm":"测试","operatorIp":"127.0.0.1","operatorIdType":"10","operatorIdNo":"510724199911111111","sendTm":"2025-09-17 11:07:45","orgQueryInf":{"accessPltfmFlag":"01","orgStat":"3007638","delFlag":"0","inOutFlag":"1"},"encKey":"sbgM8tvh4t+MrsLgveHTbA=="} `;
    const publicKey = `BJ1ACOj7ZxkXInkM0eFAqEKUzxxRHqMiuXp1rP2LqNRH7PgkoKxkkrpbQjcNB/GeS7qGWtmO/PIsBxK68srQM1g=`;
    const privateKey = `AOwciozA+K5h2xGvYpcmVf+waPO4vaKAn/mRz3qhJ46B`

    expect(sm2.getPublicKeyFromPrivateKey(toHex(privateKey))).toBe(toHex(publicKey))


    expect(sm2.decrypt(
      sm2.encrypt(plaintext, publicKey),
      privateKey
    )).toBe(plaintext);
  });

  test('sm3', () => {
    expect(sm3(plaintext, {
      key: [1,2,3,4,5]
    })).toBe(`9dff369c8180f1fc5be9efe485a7c0aa67f1f1555959e1803845c2e459772090`);
    expect(sm3(plaintext)).toBe(`af326881aacb0c1e44f7fcc9f637a9cecde4473d6e0323b0ef964502911dfb36`);
    expect(isStandardBase64(sm3(plaintext, { output: 'base64' }))).toBeTruthy();
  })

  test('sm4', () => {
    const key = '0123456789abcdeffedcba9876543210';
    const iv = 'fedcba98765432100123456789abcdef';
    expect(sm4.encrypt(plaintext, key, { mode: 'cbc', iv, output: 'base64' }))
      .toBe('DWz6c8gjsqwNapLFZBcYksB33VUs42uFntKIC1qWSY8=');

    expect(sm4.encrypt(plaintext, key))
      .toBe('0E395DEB10F6E8A17E17823E1FD9BD98C71F4A651E34BA279ED3238BE3FDEFA4'.toLowerCase());

    expect(sm4.decrypt('DWz6c8gjsqwNapLFZBcYksB33VUs42uFntKIC1qWSY8=', key, { mode: 'cbc', iv }))
      .toBe(plaintext);

    expect(sm4.decrypt('0E395DEB10F6E8A17E17823E1FD9BD98C71F4A651E34BA279ED3238BE3FDEFA4', key))
      .toBe(plaintext);
  })
});

export function isStandardBase64(str: string): boolean {
  if (!str) {
    return false;
  }

  // 1. 正则表达式验证字符集和填充符
  const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$|^[A-Za-z0-9+/]+=$/;
  if (!base64Regex.test(str)) {
    return false;
  }

  // 2. 检查字符串长度是否为 4 的倍数
  if (str.length % 4 !== 0) {
    return false;
  }

  // 3. 使用 Buffer 进行实际解码验证
  try {
    const buffer = Buffer.from(str, 'base64');
    const decodedStr = buffer.toString('base64');
    // 解码后重新编码的结果必须与原字符串完全一致
    return decodedStr === str;
  } catch (error) {
    return false;
  }
}
