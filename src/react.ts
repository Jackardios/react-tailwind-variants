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
} from './variants';

const StyledComponentConfigKey = '$$tailwindVariantsConfig';

interface StyledComponentConfigProp<C extends VariantsConfig<any>> {
  readonly [StyledComponentConfigKey]: C;
}

export type StyledComponent<
  ForwardRefComponent extends ForwardRefExoticComponent<any>,
  C extends VariantsConfig<any>
> = ForwardRefComponent & StyledComponentConfigProp<C>;

export function variantProps<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = NonNullable<C['variants']>
>(config: C) {
  const variantsHandler = variants(config);

  type Props = VariantOptions<C> & {
    className?: string;
  };

  return function <P extends Props>(props: P) {
    const result: any = {};

    // Pass-through all unrelated props
    for (let prop in props) {
      if (
        !('variants' in config) ||
        !config.variants ||
        !(prop in config.variants)
      ) {
        result[prop] = props[prop];
      }
    }

    // Add the optionally passed className prop for chaining
    result.className = variantsHandler(props);

    return result as { className: string } & Omit<P, keyof Props>;
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
  V extends VariantsSchema = NonNullable<C['variants']>
>(baseType: T, config: C) {
  const propsHandler = variantProps(config);

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
    [StyledComponentConfigKey]: config,
  }) as StyledComponent<typeof component, typeof config>;
}

export type VariantsConfigOf<
  Component extends StyledComponent<ForwardRefExoticComponent<any>, C>,
  C extends VariantsConfig<V> = Component[typeof StyledComponentConfigKey],
  V extends VariantsSchema = NonNullable<C['variants']>
> = C;

export type VariantPropsOf<
  Component extends StyledComponent<ForwardRefExoticComponent<any>, C>,
  C extends VariantsConfig<V> = Component[typeof StyledComponentConfigKey],
  V extends VariantsSchema = NonNullable<C['variants']>
> = VariantOptions<C>;

export function extractVariantsConfig<
  C extends VariantsConfig<V>,
  V extends VariantsSchema = NonNullable<C['variants']>
>(styledComponent: StyledComponent<ForwardRefExoticComponent<any>, C>) {
  return styledComponent[StyledComponentConfigKey];
}
