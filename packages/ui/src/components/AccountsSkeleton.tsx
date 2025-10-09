/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { color } from "@mozu/design-token";

export const AccountsSkeleton = () => {
  return (
    <div css={AccountsContainer}>
      <div css={TextBarWrapper}>
        <div css={TextBarShort} />
        <div css={TextBarLong} />
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

const AccountsContainer = css`
  position: relative;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
  height: 108px;
  border-radius: 12px;
  background-color: ${color.zinc[100]};
  padding: 24px;
  display: flex;
  align-items: center;

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
  gap: 12px;
  width: 100%;
`;

const TextBarShort = css`
  width: 40%;
  height: 14px;
  border-radius: 6px;
  background-color: ${color.zinc[200]};
`;

const TextBarLong = css`
  width: 80%;
  height: 14px;
  border-radius: 6px;
  background-color: ${color.zinc[200]};
`;
