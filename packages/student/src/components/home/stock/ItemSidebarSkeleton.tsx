/** @jsxImportSource @emotion/react */

import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { color } from "@mozu/design-token";

export const ItemSidebarSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <SideBarContainer>
      <Title>전체 종목</Title>
      <ItemContentContainer>
        {Array.from({
          length: count,
        }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </ItemContentContainer>
    </SideBarContainer>
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

const shimmerStyle = css`
  background: linear-gradient(
    90deg,
    ${color.zinc[200]} 0%,
    ${color.zinc[100]} 50%,
    ${color.zinc[200]} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonItem = () => {
  return (
    <ItemContainer>
      <LogoContainer>
        <SkeletonCircle />
        <ItemTitleContainer>
          <SkeletonLine
            width="80px"
            height="16px"
          />
          <SkeletonLine
            width="40px"
            height="12px"
          />
        </ItemTitleContainer>
      </LogoContainer>
      <ItemPriceContainer>
        <SkeletonLine
          width="80px"
          height="16px"
        />
        <SkeletonLine
          width="60px"
          height="12px"
        />
      </ItemPriceContainer>
    </ItemContainer>
  );
};

// 재사용 가능한 공통 스켈레톤 박스
const SkeletonLine = styled.div<{
  width: string;
  height: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 4px;
  ${shimmerStyle}
`;

const SkeletonCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  ${shimmerStyle}
`;

const ItemContainer = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 74px;
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ItemPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: end;
`;

const ItemTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
`;

const SideBarContainer = styled.div`
  position: fixed;
  left: 0;
  border-right: 1px solid ${color.zinc[200]};
  width: 320px;
  height: 100%;
  background-color: ${color.white};
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 2px 0 4px rgba(93, 93, 93, 0.1);
  z-index: 1;
`;

const ItemContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: start;
  align-items: start;
`;

const Title = styled.div`
  font: 600 16px/24px sans-serif;
  color: ${color.zinc[600]};
  padding-left: 16px;
`;
