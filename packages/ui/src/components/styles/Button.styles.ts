import styled from "@emotion/styled";
import { font } from "@mozu/design-token";
import type { ButtonProps } from "../types";

export const ButtonContainer = styled.button<ButtonProps>`
  width: ${({ width }) => width ?? "auto"}px;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  border: 1px solid ${({ borderColor }) => borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font: ${font.b1};
  transition: 0.35s ease-in-out;

  &:hover {
    background-color: ${({ hoverBackgroundColor, backgroundColor }) =>
      hoverBackgroundColor || backgroundColor};
    color: ${({ hoverColor, color }) => hoverColor || color};
    border: 1px solid
      ${({ hoverBorderColor, borderColor }) => hoverBorderColor || borderColor};
  }

  &:active {
    background-color: ${({ activeBackgroundColor, backgroundColor }) =>
      activeBackgroundColor || backgroundColor};
    color: ${({ activeColor, color }) => activeColor || color};
    border: 1px solid
      ${({ activeBorderColor, borderColor }) =>
        activeBorderColor || borderColor};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
