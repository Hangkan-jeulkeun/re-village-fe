import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Layout.module.css";

interface AppLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function AppLayout({
  children,
  className,
  ...props
}: AppLayoutProps) {
  return (
    <div className={styles.appShell}>
      <div
        className={[styles.appContent, className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
