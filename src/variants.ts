/**
 * This is a modified version of the `classname-variants`
 * See https://github.com/fgnass/classname-variants/
 */

import { twMerge } from 'tailwind-merge';

/** =======================================
 *  Utils
 *  ======================================= */

type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;

type ClassNameValue = string | null | undefined | ClassNameValue[];

type CxOptions = ClassNameValue[];
type CxReturn = string;

const cx = <T extends CxOptions>(...classes: T): CxReturn =>
  // @ts-ignore
  twMerge(classes.flat(Infinity).filter(Boolean).join(' '));

/**
 * No-op function to mark template literals as tailwind strings.
 */
export const tw = String.raw;

/** =======================================
 *  Variants
 *  ======================================= */

/**
 * Definition of the available variants and their options.
 * @example
 * {
 *   color: {
 *     white: "bg-white"
 *     green: "bg-green-500",
 *   },
 *   size: {
 *     small: "text-xs",
 *     large: "text-lg"
 *   }
 * }
 */
export type VariantsSchema = Record<string, Record<string, ClassNameValue>>;

/**
 * Configuration including defaults and compound variants.
 */
export interface VariantsConfig<V extends VariantsSchema = {}> {
  base?: ClassNameValue;
  variants: V;
  compoundVariants?: CompoundVariant<V>[];
  defaultVariants?: Partial<Variants<V>>;
}

/**
 * Rules for class names that are applied for certain variant combinations.
 */
interface CompoundVariant<V extends VariantsSchema> {
  variants: Partial<VariantsMulti<V>>;
  className: ClassNameValue;
}

type Variants<V extends VariantsSchema> = {
  [Variant in keyof V]: StringToBoolean<keyof V[Variant]>;
};

type VariantsMulti<V extends VariantsSchema> = {
  [Variant in keyof V]:
    | StringToBoolean<keyof V[Variant]>
    | StringToBoolean<keyof V[Variant]>[];
};

/**
 * Only the boolean variants, i.e. ones that have "true" or "false" as options.
 */
type BooleanVariants<V extends VariantsSchema> = {
  [Variant in keyof V as V[Variant] extends { true: any } | { false: any }
    ? Variant
    : never]: V[Variant];
};

/**
 * Only the variants for which a default options is set.
 */
type DefaultVariants<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C['variants']
> = {
  [Variant in keyof V as Variant extends keyof C['defaultVariants']
    ? Variant
    : never]: C['variants'][Variant];
};

/**
 * Names of all optional variants, i.e. booleans or ones with default options.
 */
type OptionalVariantNames<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C['variants']
> = keyof BooleanVariants<V> | keyof DefaultVariants<C>;

/**
 * Possible options for all the optional variants.
 *
 * @example
 * {
 *   color?: "white" | "green",
 *   rounded?: boolean | undefined
 * }
 */
type OptionalOptions<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C['variants']
> = {
  [Variant in keyof V as Variant extends OptionalVariantNames<C>
    ? Variant
    : never]?: Variants<V>[Variant];
};

/**
 * Possible options for all required variants.
 *
 * @example {
 *   size: "small" | "large"
 * }
 */
type RequiredOptions<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C['variants']
> = {
  [K in keyof V as K extends OptionalVariantNames<C>
    ? never
    : K]: Variants<V>[K];
};

/**
 * Extracts the possible options.
 */
export type VariantOptions<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C['variants']
> = RequiredOptions<C> & OptionalOptions<C>;

/**
 * Without this conversion step, defaultVariants and compoundVariants will
 * allow extra keys, i.e. non-existent variants.
 * See https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts
 */
export type Simplify<T> = {
  [K in keyof T]: T[K];
};

export function variants<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C['variants']
>(config: Simplify<C>) {
  const { base, variants, compoundVariants, defaultVariants } = config;

  function isBooleanVariant(name: keyof V) {
    const variant = variants?.[name];
    return variant && ('false' in variant || 'true' in variant);
  }

  return function (props?: VariantOptions<C> & { className?: ClassNameValue }) {
    const result = [base];

    const getSelectedVariant = (name: keyof V) =>
      (props as any)[name] ??
      defaultVariants?.[name] ??
      (isBooleanVariant(name) ? false : undefined);

    for (let name in variants) {
      const selected = getSelectedVariant(name);
      if (selected !== undefined) result.push(variants[name]?.[selected]);
    }

    for (let { variants, className } of compoundVariants ?? []) {
      function isSelectedVariant(name: string) {
        const selected = getSelectedVariant(name);
        const cvSelector = variants[name];

        return Array.isArray(cvSelector)
          ? cvSelector.includes(selected)
          : selected === cvSelector;
      }

      if (Object.keys(variants).every(isSelectedVariant)) {
        result.push(className);
      }
    }

    if (props?.className) {
      result.push(props.className);
    }

    return cx(result);
  };
}
