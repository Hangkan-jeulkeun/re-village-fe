'use client';

import type { ReactNode } from 'react';
import { Toast } from '@vapor-ui/core';

import styles from './AppToastProvider.module.css';

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.PortalPrimitive>
      <Toast.ViewportPrimitive className={styles.viewport}>
        {toasts.map((toast) => (
          <Toast.RootPrimitive key={toast.id} toast={toast}>
            <Toast.ContentPrimitive className={styles.content}>
              <div className={styles.body}>
                <span className={styles.iconWrap}>
                  <Toast.IconPrimitive />
                </span>
                <div>
                  <Toast.TitlePrimitive />
                  <Toast.DescriptionPrimitive />
                </div>
              </div>
              <div className={styles.actions}>
                <Toast.ActionPrimitive />
                <Toast.ClosePrimitive />
              </div>
            </Toast.ContentPrimitive>
          </Toast.RootPrimitive>
        ))}
      </Toast.ViewportPrimitive>
    </Toast.PortalPrimitive>
  );
}

export interface AppToastProviderProps {
  children: ReactNode;
}

export function AppToastProvider({ children }: AppToastProviderProps) {
  return (
    <Toast.ProviderPrimitive timeout={7000}>
      {children}
      <ToastList />
    </Toast.ProviderPrimitive>
  );
}
