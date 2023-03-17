import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ElementType,
  type ForwardRefExoticComponent,
  createElement,
  forwardRef,
} from 'react';

import { Slot } from '@radix-ui/react-slot';

import {
  type VariantsConfig,
  type VariantsSchema,
  type VariantOptions,
  variants,
  Simplify,
} from './variants';

const StyledComponentConfigKey = '$$tailwindVariantsConfig';

type StyledComponentConfigProp<Config extends VariantsConfig> = {
  readonly [StyledComponentConfigKey]: Config;
};

export type StyledComponent<
  ForwardRefComponent extends ForwardRefExoticComponent<any>,
  Config extends VariantsConfig
> = ForwardRefComponent & StyledComponentConfigProp<Config>;

export function variantProps<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C['variants']
>(config: C) {
  const variantsHandler = variants(config);

  return function <
    P extends VariantOptions<C> & {
      className?: string;
    }
  >(props: P) {
    const result: any = {};

    // Pass-through all unrelated props
    for (let prop in props) {
      if (!config.variants || !(prop in config.variants)) {
        result[prop] = props[prop];
      }
    }

    // Add the optionally passed className prop for chaining
    result.className = variantsHandler(props as any);

    return result as { className: string } & Omit<typeof props, keyof V>;
  };
}

type SlottableProps<
  T extends ElementType,
  P
> = T extends keyof JSX.IntrinsicElements
  ? Omit<P, 'asChild'> & {
      asChild?: boolean;
    }
  : P;

export function styled<
  T extends ElementType,
  C extends VariantsConfig<V>,
  V extends VariantsSchema = C extends VariantsConfig ? C['variants'] : {}
>(baseType: T, config: string | Simplify<C>) {
  const preparedConfig =
    typeof config === 'string'
      ? ({ base: config, variants: {} } as Simplify<C>)
      : config;

  const propsHandler = variantProps(preparedConfig);

  type ConfigVariants = VariantOptions<C>;
  type Props = SlottableProps<
    T,
    ConfigVariants & Omit<ComponentPropsWithoutRef<T>, keyof ConfigVariants>
  >;

  const component = forwardRef<ComponentRef<T>, Props>((props, ref) => {
    // only JSX.IntrinsicElements can be slottable
    if (typeof baseType === 'string' && 'asChild' in props && props.asChild) {
      const { asChild, ...otherProps } = props;

      return createElement(Slot, {
        ...propsHandler(otherProps as any),
        ref: ref as any,
      });
    }

    return createElement(baseType, {
      ...propsHandler(props as any),
      ref: ref as any,
    });
  });

  return Object.assign(component, {
    [StyledComponentConfigKey]: preparedConfig,
  }) as StyledComponent<typeof component, typeof preparedConfig>;
}

export type VariantsConfigOf<
  Component extends StyledComponent<ForwardRefExoticComponent<any>, Config>,
  Config extends VariantsConfig = Component[typeof StyledComponentConfigKey]
> = Config;

export type VariantPropsOf<
  Component extends StyledComponent<ForwardRefExoticComponent<any>, Config>,
  Config extends VariantsConfig = Component[typeof StyledComponentConfigKey]
> = VariantOptions<Config>;

export function extractVariantsConfig<
  Component extends ForwardRefExoticComponent<any>,
  Config extends VariantsConfig
>(styledComponent: StyledComponent<Component, Config>) {
  return styledComponent[StyledComponentConfigKey];
}
