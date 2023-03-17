export { type CxOptions, type CxReturn, cx } from './cx';

export {
  type VariantsConfig,
  type VariantsSchema,
  type VariantOptions,
  variants,
} from './variants';

export {
  type StyledComponent,
  type VariantPropsOf,
  type VariantsConfigOf,
  variantProps,
  extractVariantsConfig,
  styled,
} from './react';

/**
 * No-op function to mark template literals as tailwind strings.
 */
export const tw = String.raw;
