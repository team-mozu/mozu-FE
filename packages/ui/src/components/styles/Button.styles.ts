import { css } from "@emotion/react";
import { font } from "@mozu/design-token";
import type { ButtonProps } from "../types/Button.types";

export const buttonStyles = ({
  width,
  backgroundColor,
  color,
  borderColor,
  hoverBorderColor,
  hoverBackgroundColor,
  hoverColor,
  hoverBoxShadow,
  activeBorderColor,
  activeBackgroundColor,
  activeColor,
}: ButtonProps) => css`
  width: ${width ? `${width}px` : "auto"};
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${backgroundColor};
  color: ${color};
  border: ${borderColor === "" ? "none" : `1px solid ${borderColor}`};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font: ${font.b1};
  transition: 0.35s ease-in-out;

  &:hover {
    background: ${hoverBackgroundColor || backgroundColor};
    color: ${hoverColor || color};
    border: 1px solid ${hoverBorderColor || borderColor || "none"};
    box-shadow: ${hoverBoxShadow || "none"};
  }

  &:active {
    background: ${activeBackgroundColor || backgroundColor};
    color: ${activeColor || color};
    border: 1px solid ${activeBorderColor || borderColor};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
