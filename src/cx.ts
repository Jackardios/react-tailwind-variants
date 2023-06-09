import { twMerge } from 'tailwind-merge';
import { type ClassNameValue } from './variants';

export type CxOptions = ClassNameValue[];
export type CxReturn = string;

export const cx = <T extends CxOptions>(...classes: T): CxReturn =>
  // @ts-ignore
  twMerge(classes.flat(Infinity).filter(Boolean).join(' '));
