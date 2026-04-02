import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Layout.module.css";

interface PCLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function PCLayout({
  children,
  className,
  ...props
}: PCLayoutProps) {
  return (
    <div className={styles.pcShell}>
      <div
        className={[styles.pcContent, className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
