import {
  utf8ToHex,
  arrayToUtf8,
  hexToArray,
  arrayToHex,
  // @ts-ignore
} from './sm2/utils';


describe('sm2-utils', () => {
  test('hexToArray', () => {
    expect(hexToArray(
      '000102030405060708090a0b0c0d0e0f10'
    )).toEqual(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    )
  })

  test('arrayToHex', () => {
    expect(arrayToHex(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    )).toEqual(
      '000102030405060708090a0b0c0d0e0f10'
    )
  })
});
