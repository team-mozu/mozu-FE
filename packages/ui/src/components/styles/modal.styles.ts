import { css } from "@emotion/react";
import { color, font } from "@mozu/design-token";

export const modalWrapperStyles = css`
  width: 100vw;
  height: 100vh;
  background-color: hsla(0, 0%, 0%, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

export const modalContainerStyles = css`
  display: flex;
  flex-direction: column;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  width: 480px;
  height: fit-content;
`;

export const modalUpperStyles = css`
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const modalLowerStyles = css`
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: end;
  border-top: 1px solid ${color.zinc[200]};
`

export const modalMainTitleStyles = css`
  font: ${font.h4};
  color: ${color.black};
`;

export const modalSubTitleStyles = css`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;

const baseIconWrapperStyles = css`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

export const iconWrapperStyles = {
  delete: css`
    ${baseIconWrapperStyles};
    border: 1px solid ${color.red[200]};
    background-color: ${color.red[50]};
  `,
  complete: css`
    ${baseIconWrapperStyles}
    border: 1px solid ${color.orange[200]};
    background-color: ${color.orange[50]};
  `
}

export const buttonWrapperStyles = css`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const titleWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const iconContentStyles = css`
  width: 24px;
  height: 24px;
`