import { css } from "@emotion/react";
import { color, font } from "@mozu/design-token";

export const inputWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const labelStyles = css`
  font: ${font.b1};
  color: ${color.zinc[800]};
`;

export const inputContainerStyles = css`
  position: relative;
  display: flex;
  align-items: center;
`;

export const baseInputStyles = css`
  width: 100%;
  padding: 14px 16px;
  border: none;
  outline: none;
  font: ${font.b2};
  transition: all 0.2s ease-in-out;
  border-radius: 8px;

  &::placeholder {
    color: ${color.zinc[500]};
    font: ${font.b2};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: ${color.zinc[50]};
  }
  
  &:read-only {
    background-color: ${color.zinc[50]};
    cursor: default;
  }

  &[type="search"]::-webkit-search-cancel-button,
  &[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }
`;

export const variantStyles = {
  default: css`
    background-color: ${color.zinc[50]};
    border: 1px solid ${color.zinc[200]};
    
    &:focus {
      border: 1px solid ${color.orange[300]};
    }
    
    &:hover:not(:disabled):not(:focus) {
      border-color: ${color.zinc[100]};
    }
  `,
};

export const stateStyles = {
  default: css``,
  error: css`
    border-color: ${color.red[500]} !important;
    
    &:focus {
      border-color: ${color.red[500]} !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
  `,
};

export const fullWidthStyle = css`
  width: 100%;
`;

export const iconStyles = css`
  position: absolute;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const startIconStyles = css`
  ${iconStyles}
  left: 12px;
`;

export const endIconStyles = css`
  ${iconStyles}
  right: 12px;
`;

export const rightTextStyles = css`
  font: ${font.t4};
  color: ${color.black}
`;

export const inputWithStartIconStyles = css`
  padding-left: 40px;
`;

export const inputWithEndIconStyles = css`
  padding-right: 40px;
`;

export const helperTextStyles = css`
  font: ${font.t4};
  color: ${color.black};
`;

export const errorMessageStyles = css`
  font-size: 12px;
  color: ${color.red[500]};
`;
