import React, { forwardRef } from 'react';
import { describe, expect, it, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { variantProps, extractVariantsConfig, styled } from '../src';

const StyledComponent = styled('button', {
  base: 'px-5 py-2 text-white disabled:bg-gray-400 disabled:text-gray-300',
  variants: {
    color: {
      neutral: 'bg-slate-500 hover:bg-slate-400',
      accent: 'bg-teal-500 hover:bg-teal-400',
    },
    outlined: {
      true: 'border-2',
    },
    size: {
      small: 'text-xs px-4',
      large: 'text-base px-6',
    },
  },
  compoundVariants: [
    {
      variants: { color: 'accent', outlined: true },
      className: 'border-teal-600',
    },
  ],
  defaultVariants: {
    size: 'small',
  },
});

// ============================================

const StyledComponentWithoutVariants = styled('div', {
  base: 'bg-white p-4 border-2 rounded-lg',
});

// ============================================

interface CustomComponentProps {
  className?: string;
  content: string;
}
const CustomComponent = forwardRef<HTMLDivElement, CustomComponentProps>(
  ({ content, className }, ref) => {
    return (
      <section data-testid="CustomComponent" className={className} ref={ref}>
        {content}
      </section>
    );
  }
);

const StyledComponentExtendingAnotherComponent = styled(CustomComponent, {
  base: 'px-5 py-2 w-16 text-white',
  variants: {
    color: {
      neutral: 'bg-slate-500 hover:bg-slate-400',
      accent: 'bg-teal-500 hover:bg-teal-400',
    },
  },
});

// ============================================

const FirstLevelStyledComponent = styled('article', {
  base: 'flex',
  variants: {
    wrap: {
      true: 'flex-wrap',
      false: '',
    },
    indents: {
      none: '',
      normal: 'px-16 my-4 mx-8',
      relaxed: 'px-24 my-8 mx-12',
    },
  },
  defaultVariants: {
    wrap: true,
  },
});

const SecondLevelStyledComponent = styled(FirstLevelStyledComponent, {
  base: 'px-8 py-4 text-center',
  variants: {
    size: {
      small: 'w-12 h-10',
      large: 'w-14 h-10',
    },
    variant: {
      elevated: 'rounded-lg shadow',
      outlined: 'rounded-sm border',
    },
  },
  defaultVariants: {
    variant: 'elevated',
  },
});

const StyledComponentExtendingDeepStyledComponent = styled(
  SecondLevelStyledComponent,
  {
    base: 'px-5 py-2 w-16 text-white disabled:bg-gray-400 disabled:text-gray-300',
    variants: {
      color: {
        neutral: 'bg-slate-500 hover:bg-slate-400',
        accent: 'bg-teal-500 hover:bg-teal-400',
      },
    },
  }
);

// ============================================

styled('div', {
  variants: {
    color: {
      neutral: 'grey',
      accent: 'hotpink',
    },
  },
  compoundVariants: [
    {
      variants: {
        // @ts-expect-error
        color: 'foobar',
      },
      className: '',
    },
  ],
});

styled('div', {
  variants: {
    color: {
      neutral: 'grey',
      accent: 'hotpink',
    },
  },
  defaultVariants: {
    // @ts-expect-error
    color: 'foobar',
  },
});

styled('div', {
  variants: {
    color: {
      neutral: 'grey',
      accent: 'hotpink',
    },
  },
  defaultVariants: {
    // @ts-expect-error
    test: 'invalid',
  },
});

styled('div', {
  variants: {
    color: {
      neutral: 'grey',
      accent: 'hotpink',
    },
  },
  defaultVariants: {
    // @ts-expect-error
    outlined: true,
  },
});

// ============================================

describe('variantProps', () => {
  it('should pass-through all unrelated props', () => {
    const propsHandler = variantProps({
      base: 'px-5 py-2 text-white disabled:bg-gray-400',
      variants: {
        color: {
          neutral: 'bg-slate-500 hover:bg-slate-400',
          accent: 'bg-teal-500 hover:bg-teal-400',
        },
        outlined: {
          true: 'border-2',
        },
        size: {
          small: 'text-xs px-4',
          large: 'text-base px-6',
        },
      },
      compoundVariants: [
        {
          variants: { color: 'accent', outlined: true },
          className: 'border-teal-600',
        },
      ],
      defaultVariants: {
        size: 'small',
      },
    });

    expect(
      propsHandler({
        color: 'neutral',
        // @ts-expect-error
        size: 'not-existent',
        foo: 'bar',
        'data-test': 'true',
      })
    ).toEqual({
      foo: 'bar',
      'data-test': 'true',
      className:
        'px-5 py-2 text-white disabled:bg-gray-400 bg-slate-500 hover:bg-slate-400',
    });

    expect(
      propsHandler({
        color: 'neutral',
        // @ts-expect-error
        size: 'not-existent',
        foo: 'bar',
        className: 'px-8',
      })
    ).toEqual({
      foo: 'bar',
      className:
        'py-2 text-white disabled:bg-gray-400 bg-slate-500 hover:bg-slate-400 px-8',
    });

    expect(
      propsHandler({
        color: 'neutral',
        foo: 'bar',
      })
    ).toEqual({
      foo: 'bar',
      className:
        'py-2 text-white disabled:bg-gray-400 bg-slate-500 hover:bg-slate-400 text-xs px-4',
    });
  });
});

describe('extractVariantsConfig', () => {
  it('extracts variants config from styled component', () => {
    expect(extractVariantsConfig(StyledComponent)).toEqual({
      base: 'px-5 py-2 text-white disabled:bg-gray-400 disabled:text-gray-300',
      variants: {
        color: {
          neutral: 'bg-slate-500 hover:bg-slate-400',
          accent: 'bg-teal-500 hover:bg-teal-400',
        },
        outlined: {
          true: 'border-2',
        },
        size: {
          small: 'text-xs px-4',
          large: 'text-base px-6',
        },
      },
      compoundVariants: [
        {
          variants: { color: 'accent', outlined: true },
          className: 'border-teal-600',
        },
      ],
      defaultVariants: {
        size: 'small',
      },
    });
  });

  it('extracts variants config from styled component without variants', () => {
    expect(extractVariantsConfig(StyledComponentWithoutVariants)).toEqual({
      base: 'bg-white p-4 border-2 rounded-lg',
    });
  });
});

describe('styled', () => {
  describe('styled component', () => {
    test('render without props', () => {
      render(
        // @ts-expect-error
        <StyledComponent>Button</StyledComponent>
      );

      expect(screen.getByText('Button')).toMatchInlineSnapshot(`
        <button
          class="py-2 text-white disabled:bg-gray-400 disabled:text-gray-300 text-xs px-4"
        >
          Button
        </button>
      `);
    });

    test('render with variants', () => {
      render(<StyledComponent color="neutral">Button</StyledComponent>);

      expect(screen.getByText('Button')).toMatchInlineSnapshot(`
        <button
          class="py-2 text-white disabled:bg-gray-400 disabled:text-gray-300 bg-slate-500 hover:bg-slate-400 text-xs px-4"
        >
          Button
        </button>
      `);
    });

    test('render with variants and unrelated props', () => {
      render(
        <StyledComponent
          color="neutral"
          data-foo="bar"
          className="py-6 bg-gray-700"
        >
          Button
        </StyledComponent>
      );

      const button = screen.getByText('Button');

      expect(button).toMatchInlineSnapshot(`
        <button
          class="text-white disabled:bg-gray-400 disabled:text-gray-300 hover:bg-slate-400 text-xs px-4 py-6 bg-gray-700"
          data-foo="bar"
        >
          Button
        </button>
      `);
    });

    test('render as child with variants and unrelated props', () => {
      render(
        <StyledComponent
          asChild
          color="neutral"
          data-foo="bar"
          className="py-6 bg-gray-700"
        >
          <a href="/some/link" className="py-1 text-gray-200">
            Link
          </a>
        </StyledComponent>
      );

      const link = screen.getByText('Link');

      expect(link).toMatchInlineSnapshot(`
        <a
          class="text-white disabled:bg-gray-400 disabled:text-gray-300 hover:bg-slate-400 text-xs px-4 py-6 bg-gray-700 py-1 text-gray-200"
          data-foo="bar"
          href="/some/link"
        >
          Link
        </a>
      `);
    });
  });

  describe('styled component without variants', () => {
    test('render without props', () => {
      render(
        <StyledComponentWithoutVariants>Button</StyledComponentWithoutVariants>
      );

      expect(screen.getByText('Button')).toMatchInlineSnapshot(`
        <div
          class="bg-white p-4 border-2 rounded-lg"
        >
          Button
        </div>
      `);
    });

    test('render with unrelated props', () => {
      render(
        <StyledComponentWithoutVariants
          data-foo="bar"
          className="py-6 bg-gray-700"
        >
          Button
        </StyledComponentWithoutVariants>
      );

      const button = screen.getByText('Button');

      expect(button).toMatchInlineSnapshot(`
        <div
          class="p-4 border-2 rounded-lg py-6 bg-gray-700"
          data-foo="bar"
        >
          Button
        </div>
      `);
    });

    test('render as child with unrelated props', () => {
      render(
        <StyledComponentWithoutVariants
          asChild
          data-foo="bar"
          className="py-6 bg-gray-700"
        >
          <a href="/some/link" className="py-1 text-gray-200">
            Link
          </a>
        </StyledComponentWithoutVariants>
      );

      const link = screen.getByText('Link');

      expect(link).toMatchInlineSnapshot(`
        <a
          class="p-4 border-2 rounded-lg py-6 bg-gray-700 py-1 text-gray-200"
          data-foo="bar"
          href="/some/link"
        >
          Link
        </a>
      `);
    });
  });

  describe('styled component that extends another deep styled component', () => {
    test('render with unrelated props', () => {
      render(
        // @ts-expect-error
        <StyledComponentExtendingDeepStyledComponent
          data-foo="bar"
          data-testid="StyledComponentExtendingDeepStyledComponent"
          className="py-6 bg-gray-700"
          color="accent"
          size="small"
        >
          <div className="py-8" data-foo="testing">
            Some inner text
          </div>
        </StyledComponentExtendingDeepStyledComponent>
      );

      expect(screen.getByTestId('StyledComponentExtendingDeepStyledComponent'))
        .toMatchInlineSnapshot(`
        <article
          class="flex flex-wrap text-center h-10 rounded-lg shadow px-5 w-16 text-white disabled:bg-gray-400 disabled:text-gray-300 hover:bg-teal-400 py-6 bg-gray-700"
          data-foo="bar"
          data-testid="StyledComponentExtendingDeepStyledComponent"
        >
          <div
            class="py-8"
            data-foo="testing"
          >
            Some inner text
          </div>
        </article>
      `);
    });

    test('render as child with unrelated props', () => {
      render(
        <StyledComponentExtendingDeepStyledComponent
          asChild
          data-foo="bar"
          data-testid="StyledComponentExtendingDeepStyledComponent"
          className="py-6 bg-gray-700"
          color="accent"
          size="small"
          indents="relaxed"
        >
          <header color="gray" data-foo="testing">
            <div className="py-8" data-foo="hello world">
              Some inner text
            </div>
          </header>
        </StyledComponentExtendingDeepStyledComponent>
      );

      expect(screen.getByTestId('StyledComponentExtendingDeepStyledComponent'))
        .toMatchInlineSnapshot(`
        <header
          class="flex flex-wrap my-8 mx-12 text-center h-10 rounded-lg shadow px-5 w-16 text-white disabled:bg-gray-400 disabled:text-gray-300 hover:bg-teal-400 py-6 bg-gray-700"
          color="gray"
          data-foo="testing"
          data-testid="StyledComponentExtendingDeepStyledComponent"
        >
          <div
            class="py-8"
            data-foo="hello world"
          >
            Some inner text
          </div>
        </header>
      `);
    });
  });

  describe('styled component that extends another component', () => {
    test('render with unrelated props', () => {
      render(
        // @ts-expect-error
        <StyledComponentExtendingAnotherComponent
          data-foo="bar"
          className="py-6 bg-gray-700"
          color="accent"
          content="Some content"
        >
          <div className="py-8" data-foo="testing">
            Some inner text
          </div>
        </StyledComponentExtendingAnotherComponent>
      );

      expect(screen.getByTestId('CustomComponent')).toMatchInlineSnapshot(`
        <section
          class="px-5 w-16 text-white hover:bg-teal-400 py-6 bg-gray-700"
          data-testid="CustomComponent"
        >
          Some content
        </section>
      `);
    });

    test('render as child with unrelated props', () => {
      render(
        // @ts-expect-error
        <StyledComponentExtendingAnotherComponent
          asChild
          data-foo="bar"
          className="py-6 bg-gray-700"
          color="accent"
          content="Some content"
        >
          <header color="gray" data-foo="testing">
            <div className="py-8" data-foo="hello world">
              Some inner text
            </div>
          </header>
        </StyledComponentExtendingAnotherComponent>
      );

      expect(screen.getByTestId('CustomComponent')).toMatchInlineSnapshot(`
        <section
          class="px-5 w-16 text-white hover:bg-teal-400 py-6 bg-gray-700"
          data-testid="CustomComponent"
        >
          Some content
        </section>
      `);
    });
  });
});
