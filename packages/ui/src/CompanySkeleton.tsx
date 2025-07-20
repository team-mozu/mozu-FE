/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { color } from '@mozu/design-token';

export const CompanySkeleton = () => {
  return (
    <div css={CompanyContainer}>
      <div css={TextBarWrapper}>
        <div css={TextBarShort} />
        <div css={TextAreaBlock} />
      </div>
    </div>
  );
};

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const CompanyContainer = css`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  height: 200px;
  border-radius: 12px;
  background-color: ${color.zinc[100]};
  padding: 24px;
  display: flex;
  align-items: flex-start;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(204, 204, 204, 0) 0%,
      rgba(229, 229, 229, 0.8) 50%,
      rgba(204, 204, 204, 0) 100%
    );
    animation: ${shimmer} 1.4s ease-in-out infinite;
    transform: translateX(-100%);
    z-index: 1;
  }
`;

const TextBarWrapper = css`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const TextBarShort = css`
  width: 30%;
  height: 16px;
  border-radius: 6px;
  background-color: ${color.zinc[200]};
`;

const TextAreaBlock = css`
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background-color: ${color.zinc[200]};
`;
