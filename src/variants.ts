/**
 * This is a modified version of the `classname-variants`
 * See https://github.com/fgnass/classname-variants/
 */

import { cx } from './cx';

type PickRequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
type OmitByValue<T, Value> = {
  [P in keyof T as T[P] extends Value ? never : P]: T[P];
};
type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;

export type ClassNameValue = string | null | undefined | ClassNameValue[];

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

export interface VariantsConfig<V extends VariantsSchema> {
  base?: ClassNameValue;
  variants?: V;
  defaultVariants?: keyof V extends never ? never : Partial<Variants<V>>;
  compoundVariants?: keyof V extends never ? never : CompoundVariant<V>[];
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
type BooleanVariants<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = NonNullable<C['variants']>
> = {
  [Variant in keyof V as V[Variant] extends { true: any } | { false: any }
    ? Variant
    : never]: V[Variant];
};

/**
 * Only the variants for which a default options is set.
 */
type DefaultVariants<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = NonNullable<C['variants']>
> = {
  [Variant in keyof V as Variant extends keyof OmitByValue<
    C['defaultVariants'],
    undefined
  >
    ? Variant
    : never]: V[Variant];
};

/**
 * Names of all optional variants, i.e. booleans or ones with default options.
 */
type OptionalVariantNames<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = NonNullable<C['variants']>
> = keyof BooleanVariants<C, V> | keyof DefaultVariants<C, V>;

/**
 * Extracts the possible options.
 */
export type VariantOptions<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = NonNullable<C['variants']>
> = keyof V extends never
  ? {}
  : Required<Omit<Variants<V>, OptionalVariantNames<C, V>>> &
      Partial<Pick<Variants<V>, OptionalVariantNames<C, V>>>;

type VariantsHandlerFn<P> = PickRequiredKeys<P> extends never
  ? (props?: P) => string
  : (props: P) => string;

export function variants<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = NonNullable<C['variants']>
>(config: C) {
  const { base, variants, compoundVariants, defaultVariants } = config;

  if (!('variants' in config) || !config.variants) {
    return (props?: { className?: ClassNameValue }) =>
      cx(base, props?.className);
  }

  function isBooleanVariant(name: keyof V) {
    const variant = variants?.[name];
    return variant && ('false' in variant || 'true' in variant);
  }

  return function (props?: { className?: ClassNameValue }) {
    const result = [base];

    const getSelectedVariant = (name: keyof V) =>
      (props as any)?.[name] ??
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
  } as VariantsHandlerFn<
    VariantOptions<C> & {
      className?: ClassNameValue;
    }
  >;
}
