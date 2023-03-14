import {
  type ComponentProps,
  type ComponentRef,
  type ElementType,
  type ForwardRefExoticComponent,
  createElement,
  forwardRef,
} from 'react';

import { Slot } from '@radix-ui/react-slot';

import {
  type Config,
  type VariantsSchema,
  type VariantsOf,
  type Variants,
  variants,
} from './base';

const StyledComponentConfigKey = '$$classnameVariantsConfig';

type StyledComponentConfigProp<Config> = {
  readonly [StyledComponentConfigKey]: Config;
};

export type StyledComponent<
  ForwardRefComponent extends ForwardRefExoticComponent<any>,
  Config
> = ForwardRefComponent & StyledComponentConfigProp<Config>;

export function createStyledPropsHandler<V extends VariantsSchema>(
  config: Config<V>
) {
  const variantsHandler = variants(config);

  return function <P = {}>(props: P) {
    const result: any = {};

    // Pass-through all unrelated props
    for (let prop in props) {
      if (
        prop !== 'className' ||
        !config.variants ||
        !(prop in config.variants)
      ) {
        result[prop] = props[prop];
      }
    }

    // Add the optionally passed className prop for chaining
    result.className = variantsHandler(props as any);

    return result as { className: string } & Omit<typeof props, keyof V>;
  };
}

export function styled<T extends ElementType, V extends VariantsSchema>(
  baseType: T,
  config: string | Config<V>
) {
  const preparedConfig =
    typeof config === 'string'
      ? ({ base: config, variants: {} } as Config<V>)
      : config;

  const propsHandler = createStyledPropsHandler(preparedConfig);

  type ConfigVariants = Variants<V>;
  type P = Omit<
    ConfigVariants & Omit<ComponentProps<T>, keyof ConfigVariants>,
    'asChild'
  > & {
    asChild?: boolean;
  };

  const component = forwardRef<ComponentRef<T>, P>(
    ({ asChild, ...props }, ref) => {
      const type = asChild ? Slot : baseType;

      return createElement(type, {
        ...propsHandler(props as any),
        ref: ref as any,
      });
    }
  );

  return Object.assign(component, {
    [StyledComponentConfigKey]: preparedConfig,
  }) as StyledComponent<typeof component, typeof preparedConfig>;
}

export type ConfigOf<Component> = Component extends StyledComponent<
  ForwardRefExoticComponent<any>,
  infer Config
>
  ? Config
  : never;

export type VariantPropsOf<Component> = VariantsOf<ConfigOf<Component>>;

export function extractVariantsConfig<
  Component extends ForwardRefExoticComponent<any>,
  Config
>(styledComponent: StyledComponent<Component, Config>) {
  return styledComponent[StyledComponentConfigKey];
}

/**
 * No-op function to mark template literals as tailwind strings.
 */
export const tw = String.raw;
