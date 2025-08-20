import type React from "react";

export interface InputProps {
  variant?: "default";
  state?: "default" | "error";
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  type?: "text" | "password" | "number" | "search";
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  name?: string;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  label?: string;
  helperText?: string;
  errorMessage?: string;

  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  className?: string;
}
