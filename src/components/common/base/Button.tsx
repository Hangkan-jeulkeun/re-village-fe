import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button as VaporButton } from "@vapor-ui/core";
import styles from "./Button.module.css";

type VaporButtonProps = ComponentPropsWithoutRef<typeof VaporButton>;
type ButtonTone = "primary" | "secondary";

export interface BaseButtonProps
  extends Omit<VaporButtonProps, "children" | "colorPalette" | "variant"> {
  children: ReactNode;
  tone?: ButtonTone;
}

export interface ButtonPairProps {
  leftButton: BaseButtonProps;
  rightButton: BaseButtonProps;
  className?: string;
}

const toneClassName = {
  primary: styles.primary,
  secondary: styles.secondary,
} satisfies Record<ButtonTone, string>;

export default function Button({
  children,
  className,
  tone = "primary",
  size = "lg",
  ...props
}: BaseButtonProps) {
  return (
    <VaporButton
      size={size}
      colorPalette={tone === "primary" ? "primary" : "contrast"}
      variant={tone === "primary" ? "fill" : "outline"}
      className={[styles.button, toneClassName[tone], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </VaporButton>
  );
}

export function ButtonPair({
  leftButton,
  rightButton,
  className,
}: ButtonPairProps) {
  const { className: leftClassName, ...leftButtonProps } = leftButton;
  const { className: rightClassName, ...rightButtonProps } = rightButton;

  return (
    <div className={[styles.buttonGroup, className].filter(Boolean).join(" ")}>
      <Button
        {...leftButtonProps}
        tone={leftButton.tone ?? "secondary"}
        className={[styles.buttonItem, leftClassName].filter(Boolean).join(" ")}
      >
        {leftButton.children}
      </Button>
      <Button
        {...rightButtonProps}
        tone={rightButton.tone ?? "primary"}
        className={[styles.buttonItem, rightClassName].filter(Boolean).join(" ")}
      >
        {rightButton.children}
      </Button>
    </div>
  );
}
