import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Button as VaporButton, HStack, Text } from '@vapor-ui/core';

type VaporButtonProps = ComponentPropsWithoutRef<typeof VaporButton>;
type ButtonTone = 'primary' | 'secondary';

export interface BaseButtonProps extends Omit<
  VaporButtonProps,
  'children' | 'colorPalette' | 'variant'
> {
  children: ReactNode;
  tone?: ButtonTone;
}

export interface ButtonPairProps {
  leftButton: BaseButtonProps;
  rightButton: BaseButtonProps;
  className?: string;
}

const toneStyle = {
  primary: {
    background: 'var(--color-brand-interactive)',
    color: 'var(--color-fg-inverse)',
    border: 'none',
  },
  secondary: {
    background: 'var(--color-bg-canvas)',
    color: 'var(--color-fg-subtle)',
    border: 'var(--size-senior-border) solid var(--color-border-normal)',
  },
} satisfies Record<ButtonTone, CSSProperties>;

export default function Button({
  children,
  tone = 'primary',
  size = 'lg',
  style,
  ...props
}: BaseButtonProps) {
  return (
    <VaporButton
      size={size}
      colorPalette={tone === 'primary' ? 'primary' : 'contrast'}
      variant={tone === 'primary' ? 'fill' : 'outline'}
      style={{
        width: '100%',
        minHeight: 'var(--size-senior-btn)',
        borderRadius: 'var(--size-senior-radius)',
        fontSize: 'var(--size-senior-font)',
        fontWeight: 700,
        lineHeight: 1.2,
        ...toneStyle[tone],
        ...style,
      }}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          typography="heading4"
          style={{
            color:
              tone === 'primary'
                ? 'var(--color-fg-inverse)'
                : 'var(--color-fg-subtle)',
            fontWeight: 700,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </VaporButton>
  );
}

export function ButtonPair({ leftButton, rightButton }: ButtonPairProps) {
  return (
    <HStack
      style={{
        width: '100%',
        gap: 'var(--gap-sm)',
      }}
    >
      <Button
        {...leftButton}
        tone={leftButton.tone ?? 'secondary'}
        style={{ flex: 1, ...(leftButton.style ?? {}) }}
      >
        {leftButton.children}
      </Button>
      <Button
        {...rightButton}
        tone={rightButton.tone ?? 'primary'}
        style={{ flex: 1, ...(rightButton.style ?? {}) }}
      >
        {rightButton.children}
      </Button>
    </HStack>
  );
}
