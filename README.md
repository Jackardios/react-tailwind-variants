# React Tailwind Variants

[![npm package][npm-img]][npm-url]
[![npm bundle size][bundle-size-img]][bundle-size-url]
[![Downloads][downloads-img]][downloads-url]

`Stitches.js`-like API for creating composable components. You can define a single variant, multiple variants, and even compound variants which allow you to define classes based on a combination of variants.

## Features

- 📦 Lightweight
- 📜 Fully type-safe
- 💅🏼 Elegant [Stitches-like](https://github.com/stitchesjs/stitches) variants API
- 🗑️ Automatic tailwindcss classes conflict resolution via [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- ♻️ Polymorphic components via [@radix-ui/slot](https://www.radix-ui.com/docs/primitives/utilities/slot)

## Installation

```bash
npm install tailwind-merge react-tailwind-variants
```

## Usage

- [Basics](#basics)
- [Boolean variants](#boolean-variants)
- [Compound variants](#compound-variants)
- [Default variants](#default-variants)
- [Components without variants](#components-without-variants)
- [Polymorphic components](#polymorphic-components)
- [Composing components](#composing-components)

### Basics

Let's assume we want to build a button component with Tailwind CSS that comes in different sizes and colors.

It consists of some _base classes_ that are always present as well as some optional classes that need to be added depending on the desired _variants_.

```tsx
const Button = styled('button', {
  base: 'rounded text-white',
  variants: {
    color: {
      brand: 'bg-sky-500',
      accent: 'bg-teal-500',
    },
    size: {
      small: 'px-5 py-3 text-xs',
      large: 'px-6 py-4 text-base',
    },
  },
});
```

The result is a react component:

```tsx
<Button type="submit" color="brand" size="large">
  Click me!
</Button>
```

Component will be rendered as:

```html
<button
  type="submit"
  className="rounded text-white bg-sky-500 px-6 py-4 text-base"
>
  Click me!
</button>
```

### Boolean variants

Variants can be of type `boolean` by using `"true"` or/and `"false"` as the key:

```ts
const Button = styled('button', {
  base: 'text-white',
  variants: {
    rounded: {
      true: 'rounded-full',
    },
  },
});
```

### Compound variants

The `compoundVariants` option can be used to apply class names based on a combination of other variants.

```tsx
const Button = styled('button', {
  variants: {
    color: {
      neutral: 'bg-gray-200',
      accent: 'bg-teal-400',
    },
    outlined: {
      true: 'border-2',
    },
  },
  compoundVariants: [
    {
      variants: {
        color: 'accent',
        outlined: true,
      },
      className: 'border-teal-500',
    },
  ],
});
```

### Default variants

The `defaultVariants` option can be used to select a variant by default.
All variants for which no default values are specified are required.

Below is an example with a component that has a required `size` and an optional `color` variants

```ts
const Button = styled('button', {
  variants: {
    color: {
      brand: 'bg-sky-500',
      accent: 'bg-teal-500',
    },
    size: {
      small: 'px-5 py-3 text-xs',
      large: 'px-6 py-4 text-base',
    },
  },
  defaultVariants: {
    color: 'neutral',
  },
});
```

### Components without variants

If the component does not have any options, you can specify a string with classes instead of a configuration object

```tsx
const Button = styled('button', 'bg-blue-500 text-white px-4 py-2');
```

### Polymorphic components

If you want to keep all the variants you have defined for a component but want to render a different HTML tag or a different custom component, you can use the `"asChild"` prop to do so:

```tsx
const Button = styled('button', {
  base: 'rounded text-white',
  variants: {
    color: {
      brand: 'bg-sky-500',
      accent: 'bg-teal-500',
    },
    size: {
      small: 'px-5 py-3 text-xs',
      large: 'px-6 py-4 text-base',
    },
  },
});
```

```tsx
<Button asChild color="brand" size="large">
  <a href="/test" className="mt-4 mb-2">
    Link as button
  </a>
</Button>
```

will be rendered as:

```html
<a
  href="/test"
  className="rounded text-white bg-sky-500 px-6 py-4 text-base mt-4 mb-2"
>
  Link as button
</a>
```

### Composing components

Composing one styled component into another.

1. Components can be composed via the `styled` function.

```tsx
const BaseButton = styled('button', {
  base: 'text-center bg-blue-500 text-white',
  variants: {
    size: {
      small: 'px-5 py-3 text-xs',
      large: 'px-6 py-4 text-base',
    },
  },
});

const Button = styled(BaseButton, {
  base: 'rounded text-white',
  variants: {
    color: {
      brand: 'bg-sky-500',
      accent: 'bg-teal-500',
    },
  },
});
```

```tsx
<Button type="submit" color="brand" size="large">
  Link as button
</Button>
```

will be rendered as:

```html
<button
  type="submit"
  className="text-center text-white px-6 py-4 text-base rounded text-white bg-sky-500"
>
  Link as button
</button>
```

2. You can also achieve the same result using `"asChild"` prop:

```tsx
const BaseButton = styled('button', {
  base: 'text-center bg-blue-500 text-white',
  variants: {
    size: {
      small: 'px-5 py-3 text-xs',
      large: 'px-6 py-4 text-base',
    },
  },
});

const Button = styled('button', {
  base: 'rounded text-white',
  variants: {
    color: {
      brand: 'bg-sky-500',
      accent: 'bg-teal-500',
    },
  },
});
```

```tsx
<BaseButton asChild size="large">
  <Button type="submit" color="brand">
    Link as button
  </Button>
</Button>
```

will be rendered as:

```html
<button
  type="submit"
  className="text-center text-white px-6 py-4 text-base rounded text-white bg-sky-500"
>
  Link as button
</button>
```

[npm-img]: https://img.shields.io/npm/v/react-tailwind-variants
[npm-url]: https://www.npmjs.com/package/react-tailwind-variants
[bundle-size-img]: https://img.shields.io/bundlephobia/minzip/react-tailwind-variants
[bundle-size-url]: https://bundlephobia.com/package/react-tailwind-variants
[downloads-img]: https://img.shields.io/npm/dt/react-tailwind-variants
[downloads-url]: https://www.npmtrends.com/react-tailwind-variants
