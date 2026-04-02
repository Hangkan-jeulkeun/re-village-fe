import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Field, Select as VaporSelect } from '@vapor-ui/core';
import styles from './FieldControl.module.css';

type FieldRootProps = ComponentPropsWithoutRef<typeof Field.Root>;
type FieldErrorProps = ComponentPropsWithoutRef<typeof Field.Error>;

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  errorMatch?: FieldErrorProps['match'];
  required?: boolean;
  disabled?: FieldRootProps['disabled'];
  name?: FieldRootProps['name'];
  rootClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
}

export default function Select({
  options,
  value,
  onValueChange,
  placeholder,
  label,
  description,
  error,
  errorMatch,
  required,
  disabled,
  name,
  rootClassName,
  labelClassName,
  triggerClassName,
}: SelectProps) {
  const hasLabel = label !== undefined && label !== null;

  return (
    <Field.Root
      name={name}
      disabled={disabled}
      className={[styles.field, rootClassName].filter(Boolean).join(' ')}
    >
      {hasLabel ? (
        <Field.Label
          className={[styles.label, labelClassName].filter(Boolean).join(' ')}
        >
          <span className={styles.labelText}>
            {label}
            {required ? <span className={styles.requiredMark}> *</span> : null}
          </span>
        </Field.Label>
      ) : null}

      <VaporSelect.Root
        value={value}
        onValueChange={(val) => onValueChange?.(val as string)}
        placeholder={placeholder}
        disabled={disabled}
      >
        <VaporSelect.Trigger
          className={[styles.selectTrigger, triggerClassName]
            .filter(Boolean)
            .join(' ')}
        />
        <VaporSelect.Popup>
          {options.map((opt) => (
            <VaporSelect.Item key={opt.value} value={opt.value}>
              {opt.label}
            </VaporSelect.Item>
          ))}
        </VaporSelect.Popup>
      </VaporSelect.Root>

      {description ? (
        <Field.Description className={styles.description}>
          {description}
        </Field.Description>
      ) : null}

      {error ? (
        <Field.Error
          match={errorMatch}
          className={[styles.message, styles.error].join(' ')}
        >
          {error}
        </Field.Error>
      ) : null}
    </Field.Root>
  );
}
