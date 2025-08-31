import type { MouseEventHandler, ReactNode } from "react";

export type ButtonType =
  | "startImg"
  | "delImg"
  | "editImg"
  | "plusImg"
  | "saveImg"
  | "cancelImg"
  | "logOutImg"
  | "articleImg"
  | "classImg"
  | "rankingImg";

export interface ButtonProps {
  children?: ReactNode;
  backgroundColor?: string;
  color?: string;
  id?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  hoverBackgroundColor?: string;
  hoverBoxShadow?: string;
  hoverColor?: string;
  activeBorderColor?: string;
  activeBackgroundColor?: string;
  activeColor?: string;
  iconSize?: number;
  iconColor?: string;
  type?: ButtonType;
  isIcon?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  event?: MouseEventHandler<HTMLButtonElement>;
  onChange?: () => void;
  disabled?: boolean;
  width?: number;
}
