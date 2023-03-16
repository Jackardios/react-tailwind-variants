import { describe, expect, test } from 'vitest';

import { type CxOptions, cx } from '../src';

describe('cx', () => {
  describe.each<CxOptions>([
    [null, ''],
    [undefined, ''],
    [
      ['text-lg', undefined, 'xl:text-lg', 'text-xl', undefined, 'bg-gray-100'],
      'xl:text-lg text-xl bg-gray-100',
    ],
    [
      [
        'foo',
        [
          undefined,
          ['text-lg'],
          [
            undefined,
            [
              'baz',
              'xl:text-lg',
              'bg-gray-100',
              'quuz',
              [[[[[[[[['text-xl', 'grault']]]]], 'garply']]]],
            ],
          ],
        ],
      ],
      'foo baz xl:text-lg bg-gray-100 quuz text-xl grault garply',
    ],
  ])('cx(%o)', (options, expected) => {
    test(`returns ${expected}`, () => {
      expect(cx(options)).toBe(expected);
    });
  });
});
