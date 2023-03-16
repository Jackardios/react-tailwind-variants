/**
 * This is a modified version of the `classname-variants`
 * See https://github.com/fgnass/classname-variants/
 */

import { twMerge } from 'tailwind-merge';
import { type ClassNameValue } from './variants';

export type CxOptions = ClassNameValue[];
export type CxReturn = string;

export const cx = <T extends CxOptions>(...classes: T): CxReturn =>
  // @ts-ignore
  twMerge(classes.flat(Infinity).filter(Boolean).join(' '));
