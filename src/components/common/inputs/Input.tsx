import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Box, Field, Text, TextInput, VStack } from '@vapor-ui/core';

type FieldRootProps = ComponentPropsWithoutRef<typeof Field.Root>;
type FieldLabelProps = ComponentPropsWithoutRef<typeof Field.Label>;
type FieldDescriptionProps = ComponentPropsWithoutRef<typeof Field.Description>;
type TextInputProps = ComponentPropsWithoutRef<typeof TextInput>;

export interface InputProps
  extends
    Omit<TextInputProps, 'children'>,
    Pick<FieldRootProps, 'name' | 'validationMode' | 'disabled'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  errorMatch?: ComponentPropsWithoutRef<typeof Field.Error>['match'];
  success?: ReactNode;
  successMatch?: ComponentPropsWithoutRef<typeof Field.Success>['match'];
  optionalText?: ReactNode;
  rootClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  inputClassName?: string;
  labelProps?: Omit<FieldLabelProps, 'children' | 'className'>;
  descriptionProps?: Omit<FieldDescriptionProps, 'children' | 'className'>;
}

export default function Input({
  label,
  description,
  error,
  errorMatch,
  success,
  successMatch,
  optionalText,
  rootClassName,
  labelClassName,
  descriptionClassName,
  inputClassName,
  labelProps,
  descriptionProps,
  required,
  name,
  validationMode,
  disabled,
  ...inputProps
}: InputProps) {
  const hasLabel = label !== undefined && label !== null;

  return (
    <Field.Root
      name={name}
      validationMode={validationMode}
      disabled={disabled}
      className={rootClassName}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-sm)',
        width: '100%',
      }}
    >
      {hasLabel ? (
        <Field.Label
          {...labelProps}
          className={labelClassName}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--gap-xs)',
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--size-space-050)',
              flexWrap: 'wrap',
            }}
          >
            {required ? (
              <Text
                typography="body1"
                style={{ color: 'var(--color-error)', fontWeight: 700 }}
              >
                *
              </Text>
            ) : null}
            <Text
              typography="body1"
              style={{
                color: 'var(--color-fg-normal)',
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              {label}
            </Text>
            {!required && optionalText ? (
              <Text
                typography="body2"
                style={{
                  color: 'var(--color-fg-placeholder)',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {optionalText}
              </Text>
            ) : null}
          </Box>
          <TextInput
            {...inputProps}
            required={required}
            disabled={disabled}
            className={inputClassName}
            style={{
              width: '100%',
              minHeight: 'var(--size-senior-input)',
              borderRadius: 'var(--size-senior-radius)',
              fontSize: 'var(--size-senior-font)',
              color: 'var(--color-fg-subtle)',
              padding: '0 var(--size-space-250)',
              ...inputProps.style,
            }}
          />
        </Field.Label>
      ) : (
        <TextInput
          {...inputProps}
          required={required}
          disabled={disabled}
          className={inputClassName}
          style={{
            width: '100%',
            minHeight: 'var(--size-senior-input)',
            borderRadius: 'var(--size-senior-radius)',
            fontSize: 'var(--size-senior-font)',
            color: 'var(--color-fg-subtle)',
            padding: '0 var(--size-space-250)',
            ...inputProps.style,
          }}
        />
      )}

      {description ? (
        <Field.Description
          {...descriptionProps}
          className={descriptionClassName}
        >
          <Text
            typography="body2"
            style={{
              color: 'var(--color-fg-subtle)',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {description}
          </Text>
        </Field.Description>
      ) : null}

      <VStack style={{ gap: 'var(--size-space-050)' }}>
        {error ? (
          <Field.Error match={errorMatch}>
            <Text
              typography="body2"
              style={{
                color: 'var(--color-error)',
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {error}
            </Text>
          </Field.Error>
        ) : null}

        {success ? (
          <Field.Success match={successMatch}>
            <Text
              typography="body2"
              style={{
                color: 'var(--color-success)',
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {success}
            </Text>
          </Field.Success>
        ) : null}
      </VStack>
    </Field.Root>
  );
}
