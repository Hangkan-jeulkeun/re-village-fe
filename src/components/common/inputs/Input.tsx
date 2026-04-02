import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Field, TextInput } from "@vapor-ui/core";
import styles from "./FieldControl.module.css";

type FieldRootProps = ComponentPropsWithoutRef<typeof Field.Root>;
type FieldLabelProps = ComponentPropsWithoutRef<typeof Field.Label>;
type FieldDescriptionProps = ComponentPropsWithoutRef<typeof Field.Description>;
type TextInputProps = ComponentPropsWithoutRef<typeof TextInput>;

export interface InputProps
  extends Omit<TextInputProps, "children">,
    Pick<FieldRootProps, "name" | "validationMode" | "disabled"> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  errorMatch?: ComponentPropsWithoutRef<typeof Field.Error>["match"];
  success?: ReactNode;
  successMatch?: ComponentPropsWithoutRef<typeof Field.Success>["match"];
  optionalText?: ReactNode;
  rootClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  inputClassName?: string;
  labelProps?: Omit<FieldLabelProps, "children" | "className">;
  descriptionProps?: Omit<FieldDescriptionProps, "children" | "className">;
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
      className={[styles.field, rootClassName].filter(Boolean).join(" ")}
    >
      {hasLabel ? (
        <Field.Label
          {...labelProps}
          className={[styles.label, labelClassName].filter(Boolean).join(" ")}
        >
          <span className={styles.labelText}>
            {label}
            {required ? (
              <span className={styles.requiredMark}>
                {" "}
                *
              </span>
            ) : null}
            {!required && optionalText ? (
              <span className={styles.optionalText}>
                {" "}
                {optionalText}
              </span>
            ) : null}
          </span>
          <TextInput
            {...inputProps}
            required={required}
            disabled={disabled}
            className={[styles.input, inputClassName].filter(Boolean).join(" ")}
          />
        </Field.Label>
      ) : (
        <TextInput
          {...inputProps}
          required={required}
          disabled={disabled}
          className={[styles.input, inputClassName].filter(Boolean).join(" ")}
        />
      )}

      {description ? (
        <Field.Description
          {...descriptionProps}
          className={[styles.description, descriptionClassName]
            .filter(Boolean)
            .join(" ")}
        >
          {description}
        </Field.Description>
      ) : null}

      {error ? (
        <Field.Error
          match={errorMatch}
          className={[styles.message, styles.error].join(" ")}
        >
          {error}
        </Field.Error>
      ) : null}

      {success ? (
        <Field.Success
          match={successMatch}
          className={[styles.message, styles.success].join(" ")}
        >
          {success}
        </Field.Success>
      ) : null}
    </Field.Root>
  );
}
