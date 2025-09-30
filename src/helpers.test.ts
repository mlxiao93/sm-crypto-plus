import {
  hexToBase64,
  base64ToHex,
  hexToArray,
  arrayToHex,
  toHex,
  generateKeyServerSide,
  utf8ToArray,
  arrayToUtf8,
  utf8ToBase64,
  base64ToUtf8,
} from './helpers';
import { isStandardBase64 } from './index.test';

describe('helper', () => {
  test('hexToBase64', () => {
    expect(hexToBase64(
      `e6fc1ebf890e6dc8fbcd7ee9574010f78c01361d900cfeaa37893fb4075faf3a`
    )).toBe(
      `5vwev4kObcj7zX7pV0AQ94wBNh2QDP6qN4k/tAdfrzo=`
    );
    expect(hexToBase64(
      `046649bf1eaf046b9aec078d866bd529a78d1c08584ee8b9896edb2c9acfd0d3ea5b1bc3dc1206a4e9cac7facd6910d508e774f7e67695edf6a8ae273268d55ff9`
    )).toBe(
      `BGZJvx6vBGua7AeNhmvVKaeNHAhYTui5iW7bLJrP0NPqWxvD3BIGpOnKx/rNaRDVCOd09+Z2le32qK4nMmjVX/k=`
    );
  });

  test('base64ToHex', () => {
    expect(base64ToHex(
      `5vwev4kObcj7zX7pV0AQ94wBNh2QDP6qN4k/tAdfrzo=`
    )).toBe(
      `e6fc1ebf890e6dc8fbcd7ee9574010f78c01361d900cfeaa37893fb4075faf3a`
    );
    expect(base64ToHex(
      `BGZJvx6vBGua7AeNhmvVKaeNHAhYTui5iW7bLJrP0NPqWxvD3BIGpOnKx/rNaRDVCOd09+Z2le32qK4nMmjVX/k=`
    )).toBe(
      `046649bf1eaf046b9aec078d866bd529a78d1c08584ee8b9896edb2c9acfd0d3ea5b1bc3dc1206a4e9cac7facd6910d508e774f7e67695edf6a8ae273268d55ff9`
    );
  });

  test('hexToArray', () => {
    expect(hexToArray(
      `000102030405060708090a0b0c0d0e0f10`
    )).toEqual(
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
      ]
    )
  })

  test('arrayToHex', () => {
    expect(arrayToHex(
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
      ]
    )).toBe(
      `000102030405060708090a0b0c0d0e0f10`
    );
  })

  test('utf8ToArray', () => {
    expect(utf8ToArray(`abc你好`)).toEqual(
      [97, 98, 99, 228, 189, 160, 229, 165, 189]
    )
  });

  test('arrayToUtf8', () => {
    expect(arrayToUtf8(
      [97, 98, 99, 228, 189, 160, 229, 165, 189]
    )).toEqual(
      `abc你好`
    )
  });

  test('utf8ToBase64', () => {
    expect(utf8ToBase64(`hello world! 我是 xiaomaolin.`))
      .toBe(`aGVsbG8gd29ybGQhIOaIkeaYryB4aWFvbWFvbGluLg==`)
  });

  test('base64ToUtf8', () => {
    expect(base64ToUtf8(`aGVsbG8gd29ybGQhIOaIkeaYryB4aWFvbWFvbGluLg==`))
      .toBe(`hello world! 我是 xiaomaolin.`)
  });

  test('toHex', () => {
    expect(toHex(
      `000102030405060708090a0b0c0d0e0f10`
    )).toBe(
      `000102030405060708090a0b0c0d0e0f10`
    );
    expect(toHex(
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
      ]
    )).toBe(
      `000102030405060708090a0b0c0d0e0f10`
    );
    expect(toHex(
      hexToBase64(`000102030405060708090a0b0c0d0e0f10`)
    )).toBe(
      `000102030405060708090a0b0c0d0e0f10`
    );
  })

  test('generateKeyServerSide', () => {
    const {
      hex,
      base64,
      array
    } = generateKeyServerSide(16)
    expect(array.length).toBe(16);
    expect(hex.length).toBe(32);
    expect(isStandardBase64(base64)).toBeTruthy();
  })
});


