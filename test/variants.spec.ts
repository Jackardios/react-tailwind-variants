import { describe, expect, test } from 'vitest';
import { variants } from '../src';

type VariantParameters<Component extends (...args: any) => any> =
  Parameters<Component>[0];

describe('variants', () => {
  describe('without base', () => {
    describe('without variants', () => {
      test('empty', () => {
        // @ts-expect-error
        expect(() => variants()).toThrowError(
          'variants configuration must not be empty'
        );

        // @ts-expect-error
        expect(() => variants(null)).toThrowError(
          'variants configuration must not be empty'
        );

        // @ts-expect-error
        expect(() => variants(undefined)).toThrowError(
          'variants configuration must not be empty'
        );

        // @ts-expect-error
        expect(() => variants({})).toThrowError(
          'variants configuration must not be empty'
        );

        // @ts-expect-error
        expect(() => variants({ variants: undefined })).toThrowError(
          'variants configuration must not be empty'
        );

        // @ts-expect-error
        expect(() => variants({ variants: null })).toThrowError(
          'variants configuration must not be empty'
        );

        // @ts-expect-error
        expect(() => variants({ base: 'foo bar' })).toThrowError(
          'variants configuration must not be empty'
        );
      });
    });

    describe('without defaults', () => {
      const buttonWithoutBaseWithoutDefaultsWithClassNameString = variants({
        variants: {
          intent: {
            primary:
              'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
            secondary:
              'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
            warning:
              'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
            danger:
              'button--danger bg-red-500 text-white border-transparent hover:bg-red-600',
          },
          disabled: {
            true: 'button--disabled opacity-050 cursor-not-allowed',
            false: 'button--enabled cursor-pointer',
          },
          size: {
            none: null,
            small: 'button--small text-sm py-1 px-2',
            medium: 'button--medium text-base py-2 px-4',
            large: 'button--large text-lg py-2.5 px-4',
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: 'button--primary-medium uppercase',
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: 'button--warning-enabled text-gray-800',
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: 'button--warning-disabled text-black',
          },
        ],
      });

      const buttonWithoutBaseWithoutDefaultsWithClassNameArray = variants({
        variants: {
          intent: {
            primary: [
              'button--primary',
              'bg-blue-500',
              'text-white',
              'border-transparent',
              'hover:bg-blue-600',
            ],
            secondary: [
              'button--secondary',
              'bg-white',
              'text-gray-800',
              'border-gray-400',
              'hover:bg-gray-100',
            ],
            warning: [
              'button--warning',
              'bg-yellow-500',
              'border-transparent',
              'hover:bg-yellow-600',
            ],
            danger: [
              'button--danger',
              'bg-red-500',
              'text-white',
              'border-transparent',
              'hover:bg-red-600',
            ],
          },
          disabled: {
            true: ['button--disabled', 'opacity-050', 'cursor-not-allowed'],
            false: ['button--enabled', 'cursor-pointer'],
          },
          size: {
            none: [],
            small: ['button--small', 'text-sm', 'py-1', 'px-2'],
            medium: ['button--medium', 'text-base', 'py-2', 'px-4'],
            large: ['button--large', 'text-lg', 'py-2.5', 'px-4'],
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: ['button--warning-disabled', 'text-black'],
          },
        ],
      });

      type ButtonWithoutDefaultsWithoutBaseProps =
        | VariantParameters<
            typeof buttonWithoutBaseWithoutDefaultsWithClassNameString
          >
        | VariantParameters<
            typeof buttonWithoutBaseWithoutDefaultsWithClassNameArray
          >;

      describe.each<[ButtonWithoutDefaultsWithoutBaseProps, string]>([
        [
          // @ts-expect-error
          undefined,
          'button--enabled cursor-pointer',
        ],
        [
          // @ts-expect-error
          {},
          'button--enabled cursor-pointer',
        ],
        [
          // @ts-expect-error
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithoutDefaultsWithoutBaseProps,
          'button--enabled cursor-pointer',
        ],
        [
          // @ts-expect-error
          { intent: 'secondary', className: 'text-blue-900' },
          'button--secondary bg-white border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer text-blue-900',
        ],
        [
          // @ts-expect-error
          { size: 'small', className: 'text-blue-900' },
          'button--enabled cursor-pointer button--small text-sm py-1 px-2 text-blue-900',
        ],
        // @ts-expect-error
        [{ disabled: true }, 'button--disabled opacity-050 cursor-not-allowed'],
        [
          // @ts-expect-error
          {
            intent: 'secondary',
            size: 'none',
            className: ['pt-0', 'text-blue-900', 'text-gray-300', 'mt-0'],
          },
          'button--secondary bg-white border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer pt-0 text-gray-300 mt-0',
        ],
        [
          // @ts-expect-error
          { intent: 'danger', size: 'medium' },
          'button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4',
        ],
        [
          // @ts-expect-error
          { intent: 'warning', size: 'large' },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800',
        ],
        [
          // @ts-expect-error
          { intent: 'warning', size: 'large', disabled: true },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black',
        ],
        [
          // @ts-expect-error
          { intent: 'primary', m: 0 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer m-0',
        ],
        [
          // @ts-expect-error
          { intent: 'primary', m: 1 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer m-1',
        ],
        [
          {
            size: 'large',
            intent: 'primary',
            m: 1,
            className: 'adhoc-class',
          },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-1 adhoc-class',
        ],
        // typings needed
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(
            buttonWithoutBaseWithoutDefaultsWithClassNameString(options)
          ).toBe(expected);
          expect(
            buttonWithoutBaseWithoutDefaultsWithClassNameArray(options)
          ).toBe(expected);
        });
      });
    });

    describe('with defaults', () => {
      const buttonWithoutBaseWithDefaultsWithClassNameString = variants({
        variants: {
          intent: {
            primary:
              'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
            secondary:
              'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
            warning:
              'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
            danger:
              'button--danger bg-red-500 text-white border-transparent hover:bg-red-600',
          },
          disabled: {
            true: 'button--disabled opacity-050 cursor-not-allowed',
            false: 'button--enabled cursor-pointer',
          },
          size: {
            none: null,
            small: 'button--small text-sm py-1 px-2',
            medium: 'button--medium text-base py-2 px-4',
            large: 'button--large text-lg py-2.5 px-4',
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: 'button--primary-medium uppercase',
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: 'button--warning-enabled text-gray-800',
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: 'button--warning-disabled text-black',
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: true,
          intent: 'primary',
          size: 'medium',
        },
      });

      const buttonWithoutBaseWithDefaultsWithClassNameArray = variants({
        variants: {
          intent: {
            primary: [
              'button--primary',
              'bg-blue-500',
              'text-white',
              'border-transparent',
              'hover:bg-blue-600',
            ],
            secondary: [
              'button--secondary',
              'bg-white',
              'text-gray-800',
              'border-gray-400',
              'hover:bg-gray-100',
            ],
            warning: [
              'button--warning',
              'bg-yellow-500',
              'border-transparent',
              'hover:bg-yellow-600',
            ],
            danger: [
              'button--danger',
              'bg-red-500',
              'text-white',
              'border-transparent',
              'hover:bg-red-600',
            ],
          },
          disabled: {
            true: ['button--disabled', 'opacity-050', 'cursor-not-allowed'],
            false: ['button--enabled', 'cursor-pointer'],
          },
          size: {
            none: [],
            small: ['button--small', 'text-sm', 'py-1', 'px-2'],
            medium: ['button--medium', 'text-base', 'py-2', 'px-4'],
            large: ['button--large', 'text-lg', 'py-2.5', 'px-4'],
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: ['button--warning-disabled', 'text-black'],
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: true,
          intent: 'primary',
          size: 'medium',
        },
      });

      type ButtonWithDefaultsWithoutBaseProps =
        | VariantParameters<
            typeof buttonWithoutBaseWithDefaultsWithClassNameString
          >
        | VariantParameters<
            typeof buttonWithoutBaseWithDefaultsWithClassNameArray
          >;

      describe.each<[ButtonWithDefaultsWithoutBaseProps, string]>([
        [
          undefined,
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {},
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {
            // @ts-expect-error
            aCheekyInvalidProp: 'lol',
          },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          { intent: 'secondary', className: 'text-blue-900' },
          'button--secondary bg-white border-gray-400 hover:bg-gray-100 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 text-blue-900',
        ],
        [
          { size: 'small', className: 'text-blue-900' },
          'button--primary bg-blue-500 border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--small text-sm py-1 px-2 m-0 text-blue-900',
        ],
        [
          { disabled: false },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {
            intent: 'secondary',
            size: 'none',
            className: ['pt-0', 'text-blue-900', 'text-gray-300', 'mt-0'],
          },
          'button--secondary bg-white border-gray-400 hover:bg-gray-100 button--disabled opacity-050 cursor-not-allowed m-0 pt-0 text-gray-300 mt-0',
        ],
        [
          { intent: 'danger', size: 'medium' },
          'button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0',
        ],
        [
          { intent: 'warning', size: 'large' },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 m-0 button--warning-disabled text-black',
        ],
        [
          { intent: 'warning', size: 'large', disabled: false },
          'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-0 button--warning-enabled text-gray-800',
        ],
        [
          { intent: 'primary', m: 0 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          { intent: 'primary', m: 1 },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase',
        ],
        [
          {
            size: 'large',
            intent: 'primary',
            m: 1,
            disabled: false,
            className: 'adhoc-class',
          },
          'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-1 adhoc-class',
        ],
        // typings needed
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(
            buttonWithoutBaseWithDefaultsWithClassNameString(options)
          ).toBe(expected);
          expect(buttonWithoutBaseWithDefaultsWithClassNameArray(options)).toBe(
            expected
          );
        });
      });
    });
  });

  // ====================================

  describe('with base', () => {
    describe('without defaults', () => {
      const buttonWithBaseWithoutDefaultsWithClassNameString = variants({
        base: 'text-center bg-purple-600 text-purple-100',
        variants: {
          intent: {
            primary:
              'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
            secondary:
              'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
            warning:
              'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
            danger:
              'button--danger bg-red-500 text-white border-transparent hover:bg-red-600',
          },
          disabled: {
            true: 'button--disabled opacity-050 cursor-not-allowed',
            false: 'button--enabled cursor-pointer',
          },
          size: {
            none: null,
            small: 'button--small text-sm py-1 px-2',
            medium: 'button--medium text-base py-2 px-4',
            large: 'button--large text-lg py-2.5 px-4',
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: 'button--primary-medium uppercase',
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: 'button--warning-enabled text-gray-800',
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: 'button--warning-disabled text-black',
          },
        ],
      });

      const buttonWithBaseWithoutDefaultsWithClassNameArray = variants({
        base: ['text-center', 'bg-purple-600', 'text-purple-100'],
        variants: {
          intent: {
            primary: [
              'button--primary',
              'bg-blue-500',
              'text-white',
              'border-transparent',
              'hover:bg-blue-600',
            ],
            secondary: [
              'button--secondary',
              'bg-white',
              'text-gray-800',
              'border-gray-400',
              'hover:bg-gray-100',
            ],
            warning: [
              'button--warning',
              'bg-yellow-500',
              'border-transparent',
              'hover:bg-yellow-600',
            ],
            danger: [
              'button--danger',
              'bg-red-500',
              'text-white',
              'border-transparent',
              'hover:bg-red-600',
            ],
          },
          disabled: {
            true: ['button--disabled', 'opacity-050', 'cursor-not-allowed'],
            false: ['button--enabled', 'cursor-pointer'],
          },
          size: {
            none: [],
            small: ['button--small', 'text-sm', 'py-1', 'px-2'],
            medium: ['button--medium', 'text-base', 'py-2', 'px-4'],
            large: ['button--large', 'text-lg', 'py-2.5', 'px-4'],
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: ['button--warning-disabled', 'text-black'],
          },
        ],
      });

      type ButtonWithoutDefaultsWithBaseProps =
        | VariantParameters<
            typeof buttonWithBaseWithoutDefaultsWithClassNameString
          >
        | VariantParameters<
            typeof buttonWithBaseWithoutDefaultsWithClassNameArray
          >;

      describe.each<[ButtonWithoutDefaultsWithBaseProps, string]>([
        [
          // @ts-expect-error
          undefined,
          'text-center bg-purple-600 text-purple-100 button--enabled cursor-pointer',
        ],
        [
          // @ts-expect-error
          {},
          'text-center bg-purple-600 text-purple-100 button--enabled cursor-pointer',
        ],
        [
          // @ts-expect-error
          {
            aCheekyInvalidProp: 'lol',
          } as ButtonWithoutDefaultsWithBaseProps,
          'text-center bg-purple-600 text-purple-100 button--enabled cursor-pointer',
        ],
        [
          // @ts-expect-error
          { intent: 'secondary', className: 'text-blue-900' },
          'text-center button--secondary bg-white border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer text-blue-900',
        ],
        [
          // @ts-expect-error
          { size: 'small', className: 'text-blue-900' },
          'text-center bg-purple-600 button--enabled cursor-pointer button--small text-sm py-1 px-2 text-blue-900',
        ],
        [
          // @ts-expect-error
          { disabled: true },
          'text-center bg-purple-600 text-purple-100 button--disabled opacity-050 cursor-not-allowed',
        ],
        [
          // @ts-expect-error
          {
            intent: 'secondary',
            size: 'none',
            className: ['pt-0', 'text-blue-900', 'text-gray-300', 'mt-0'],
          },
          'text-center button--secondary bg-white border-gray-400 hover:bg-gray-100 button--enabled cursor-pointer pt-0 text-gray-300 mt-0',
        ],
        [
          // @ts-expect-error
          { intent: 'danger', size: 'medium' },
          'text-center button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--enabled cursor-pointer button--medium text-base py-2 px-4',
        ],
        [
          // @ts-expect-error
          { intent: 'warning', size: 'large' },
          'text-center button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 button--warning-enabled text-gray-800',
        ],
        [
          // @ts-expect-error
          { intent: 'warning', size: 'large', disabled: true },
          'text-center button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 button--warning-disabled text-black',
        ],
        [
          // @ts-expect-error
          { intent: 'primary', m: 0 },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer m-0',
        ],
        [
          // @ts-expect-error
          { intent: 'primary', m: 1 },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer m-1',
        ],
        [
          {
            size: 'large',
            intent: 'primary',
            m: 1,
            className: 'adhoc-class',
          },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-1 adhoc-class',
        ],
        // typings needed
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(
            buttonWithBaseWithoutDefaultsWithClassNameString(options)
          ).toBe(expected);
          expect(buttonWithBaseWithoutDefaultsWithClassNameArray(options)).toBe(
            expected
          );
        });
      });
    });

    describe('with defaults', () => {
      const buttonWithBaseWithDefaultsWithClassNameString = variants({
        base: 'text-center bg-purple-600 text-purple-100',
        variants: {
          intent: {
            primary:
              'button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600',
            secondary:
              'button--secondary bg-white text-gray-800 border-gray-400 hover:bg-gray-100',
            warning:
              'button--warning bg-yellow-500 border-transparent hover:bg-yellow-600',
            danger:
              'button--danger bg-red-500 text-white border-transparent hover:bg-red-600',
          },
          disabled: {
            true: 'button--disabled opacity-050 cursor-not-allowed',
            false: 'button--enabled cursor-pointer',
          },
          size: {
            none: null,
            small: 'button--small text-sm py-1 px-2',
            medium: 'button--medium text-base py-2 px-4',
            large: 'button--large text-lg py-2.5 px-4',
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: 'button--primary-medium uppercase',
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: 'button--warning-enabled text-gray-800',
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: 'button--warning-disabled text-black',
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: true,
          intent: 'primary',
          size: 'medium',
        },
      });

      const buttonWithBaseWithDefaultsWithClassNameArray = variants({
        base: ['text-center', 'bg-purple-600', 'text-purple-100'],
        variants: {
          intent: {
            primary: [
              'button--primary',
              'bg-blue-500',
              'text-white',
              'border-transparent',
              'hover:bg-blue-600',
            ],
            secondary: [
              'button--secondary',
              'bg-white',
              'text-gray-800',
              'border-gray-400',
              'hover:bg-gray-100',
            ],
            warning: [
              'button--warning',
              'bg-yellow-500',
              'border-transparent',
              'hover:bg-yellow-600',
            ],
            danger: [
              'button--danger',
              'bg-red-500',
              'text-white',
              'border-transparent',
              'hover:bg-red-600',
            ],
          },
          disabled: {
            true: ['button--disabled', 'opacity-050', 'cursor-not-allowed'],
            false: ['button--enabled', 'cursor-pointer'],
          },
          size: {
            none: [],
            small: ['button--small', 'text-sm', 'py-1', 'px-2'],
            medium: ['button--medium', 'text-base', 'py-2', 'px-4'],
            large: ['button--large', 'text-lg', 'py-2.5', 'px-4'],
          },
          m: {
            0: 'm-0',
            1: 'm-1',
          },
        },
        compoundVariants: [
          {
            variants: {
              intent: 'primary',
              size: 'medium',
            },
            className: ['button--primary-medium', 'uppercase'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: false,
            },
            className: ['button--warning-enabled', 'text-gray-800'],
          },
          {
            variants: {
              intent: 'warning',
              disabled: true,
            },
            className: ['button--warning-disabled', 'text-black'],
          },
        ],
        defaultVariants: {
          m: 0,
          disabled: true,
          intent: 'primary',
          size: 'medium',
        },
      });

      type ButtonWithDefaultsWithBaseProps =
        | VariantParameters<
            typeof buttonWithBaseWithDefaultsWithClassNameString
          >
        | VariantParameters<
            typeof buttonWithBaseWithDefaultsWithClassNameArray
          >;

      describe.each<[ButtonWithDefaultsWithBaseProps, string]>([
        [
          undefined,
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {},
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {
            // @ts-expect-error
            aCheekyInvalidProp: 'lol',
          },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          { intent: 'secondary', className: 'text-blue-900' },
          'text-center button--secondary bg-white border-gray-400 hover:bg-gray-100 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 text-blue-900',
        ],
        [
          { size: 'small', className: 'text-blue-900' },
          'text-center button--primary bg-blue-500 border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--small text-sm py-1 px-2 m-0 text-blue-900',
        ],
        [
          { disabled: false },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          {
            intent: 'secondary',
            size: 'none',
            className: ['pt-0', 'text-blue-900', 'text-gray-300', 'mt-0'],
          },
          'text-center button--secondary bg-white border-gray-400 hover:bg-gray-100 button--disabled opacity-050 cursor-not-allowed m-0 pt-0 text-gray-300 mt-0',
        ],
        [
          { intent: 'danger', size: 'medium' },
          'text-center button--danger bg-red-500 text-white border-transparent hover:bg-red-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0',
        ],
        [
          { intent: 'warning', size: 'large' },
          'text-center button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--disabled opacity-050 cursor-not-allowed button--large text-lg py-2.5 px-4 m-0 button--warning-disabled text-black',
        ],
        [
          { intent: 'warning', size: 'large', disabled: false },
          'text-center button--warning bg-yellow-500 border-transparent hover:bg-yellow-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-0 button--warning-enabled text-gray-800',
        ],
        [
          { intent: 'primary', m: 0 },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-0 button--primary-medium uppercase',
        ],
        [
          { intent: 'primary', m: 1 },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--disabled opacity-050 cursor-not-allowed button--medium text-base py-2 px-4 m-1 button--primary-medium uppercase',
        ],
        [
          {
            size: 'large',
            intent: 'primary',
            m: 1,
            disabled: false,
            className: 'adhoc-class',
          },
          'text-center button--primary bg-blue-500 text-white border-transparent hover:bg-blue-600 button--enabled cursor-pointer button--large text-lg py-2.5 px-4 m-1 adhoc-class',
        ],
        // typings needed
      ])('button(%o)', (options, expected) => {
        test(`returns ${expected}`, () => {
          expect(buttonWithBaseWithDefaultsWithClassNameString(options)).toBe(
            expected
          );
          expect(buttonWithBaseWithDefaultsWithClassNameArray(options)).toBe(
            expected
          );
        });
      });
    });
  });
});
