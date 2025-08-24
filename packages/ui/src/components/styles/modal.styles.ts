import { css } from "@emotion/react";
import { color, font } from "@mozu/design-token";

export const modalWrapperStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const modalContainerStyles = css`
  width: 100%;
  max-width: 520px;
  border: 1px solid ${color.zinc[200]};
  background: ${color.white};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  position: relative;
  animation: modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${color.white},
      transparent
    );
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

export const modalUpperStyles = css`
  padding: 32px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid ${color.zinc[100]};
  background: linear-gradient(
    135deg,
    ${color.white} 0%,
    ${color.zinc[50]} 100%
  );
`;

export const modalLowerStyles = css`
  width: 100%;
  padding: 20px 28px;
  padding: 12px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid ${color.zinc[200]};
`;

export const modalMainTitleStyles = css`
  font: ${font.h4};
  color: ${color.zinc[900]};
  margin: 0;
  letter-spacing: -0.02em;
`;

export const modalSubTitleStyles = css`
  font: ${font.b1};
  color: ${color.zinc[600]};
  margin: 0;
`;

const baseIconWrapperStyles = css`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  position: relative;
`;

export const iconWrapperStyles = {
  delete: css`
    ${baseIconWrapperStyles};
    border: 2px solid ${color.red[200]};
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    background: linear-gradient(
      135deg,
      ${color.red[50]} 0%,
      ${color.red[50]} 100%
    );
    &::before {
      content: "";
      position: absolute;
      inset: -1px;
      background: linear-gradient(135deg, ${color.red[200]}, ${color.red[100]});
      border-radius: 12px;
      z-index: -1;
    }
  `,
  complete: css`
    ${baseIconWrapperStyles}
    border: 1px solid ${color.orange[200]};
    background-color: ${color.orange[50]};
  `,
};

export const buttonWrapperStyles = css`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const titleWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const iconContentStyles = css`
  width: 24px;
  height: 24px;
`;
