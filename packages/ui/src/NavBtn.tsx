import styled from '@emotion/styled';
import { color } from '@mozu/design-token';
import { ReactNode } from 'react';
import { ArticleIcon, ClassIcon, StockIcon } from './assets';

interface INavType {
  children?: ReactNode;
  isColor?: boolean;
  type?: 'classIcon' | 'stockIcon' | 'articleIcon';
}

export const NavBtn = ({ children, isColor, type }: INavType) => {
  const getIconColor = () => (isColor ? color.orange[600] : color.zinc[500]);

  const buttonIconType = {
    classIcon: <ClassIcon color={getIconColor()} />,
    stockIcon: <StockIcon color={getIconColor()} />,
    articleIcon: <ArticleIcon color={getIconColor()} />,
  };

  return (
    <NavContent isColor={isColor}>
      {type ? buttonIconType[type] : null}
      {children}
    </NavContent>
  );
};

const NavContent = styled.button<Pick<INavType, 'isColor'>>`
  width: 100%;
  height: 52px;
  background-color: ${({ isColor }) =>
    isColor ? color.orange[50] : 'transparent'};
  color: ${({ isColor }) => (isColor ? color.orange[600] : color.zinc[500])};
  display: flex;
  gap: 12px;
  padding-left: 20px;
  align-items: center;
  justify-content: start;
`;
