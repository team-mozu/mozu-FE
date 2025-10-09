import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import type { ReactNode } from "react";
import { ArticleIcon, ClassIcon, StockIcon } from "../assets";

interface INavType {
  children?: ReactNode;
  isColor?: boolean;
  type?: "classIcon" | "stockIcon" | "articleIcon";
  onClick?: () => void;
}

export const NavBtn = ({ children, isColor, type, onClick }: INavType) => {
  const getIconColor = () => (isColor ? color.orange[600] : color.zinc[500]);

  const buttonIconType = {
    classIcon: <ClassIcon color={getIconColor()} />,
    stockIcon: <StockIcon color={getIconColor()} />,
    articleIcon: <ArticleIcon color={getIconColor()} />,
  };

  return (
    <NavContent
      isColor={isColor}
      onClick={onClick}
      data-tooltip={children}>
      {type ? buttonIconType[type] : null}
      <span>{children}</span>
    </NavContent>
  );
};

const NavContent = styled.button<Pick<INavType, "isColor">>`
  width: 100%;
  height: 52px;
  background-color: ${({ isColor }) => (isColor ? color.orange[50] : "transparent")};
  color: ${({ isColor }) => (isColor ? color.orange[600] : color.zinc[500])};
  display: flex;
  border: none;
  cursor: pointer;
  gap: 12px;
  padding-left: 20px;
  align-items: center;
  justify-content: start;
  font: ${font.t3};
  transition: all 0.3s ease;
  
  ${({ isColor }) =>
    !isColor &&
    `
    :hover {
      background-color: ${color.zinc[50]};
    }
  `}

  /* 데스크탑 반응형 - 작은 화면에서 패딩 조정 */
  @media (max-width: 1200px) {
    padding-left: 16px;
    gap: 10px;
    font: ${font.b1};
  }

  @media (max-width: 1024px) {
    padding-left: 12px;
    gap: 8px;
    font: ${font.b2};
  }

  /* 축소 모드 - 텍스트 숨기고 아이콘만 표시 */
  @media (max-width: 900px) {
    justify-content: center;
    padding-left: 0;
    gap: 0;
    position: relative;
    
    /* 텍스트 숨기기 */
    & > span,
    & > div {
      display: none;
    }
    
    /* 툴팁 표시를 위한 hover 효과 */
    &:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      left: 72px;
      top: 50%;
      transform: translateY(-50%);
      background: ${color.zinc[800]};
      color: ${color.white};
      padding: 8px 12px;
      border-radius: 6px;
      font: ${font.b2};
      white-space: nowrap;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      opacity: 0;
      animation: tooltipFadeIn 0.2s ease forwards;
    }
    
    &:hover::before {
      content: '';
      position: absolute;
      left: 64px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 4px 4px 4px 0;
      border-color: transparent ${color.zinc[800]} transparent transparent;
      z-index: 1001;
    }
  }

  @keyframes tooltipFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
