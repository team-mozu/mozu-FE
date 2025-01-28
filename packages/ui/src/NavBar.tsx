import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface INavType {
  children: string;
  isPath: boolean;
}

const Nav = ({ isPath, children }: INavType) => {
  return <NavContainer isPath={isPath}>{children}</NavContainer>;
};

export const NavBar = () => {
  const [isCurrentPricePath, setIsCurrentPricePath] = useState<boolean>(false);
  const [isItemPath, setIsItemPath] = useState<boolean>(false);
  const [isNewsPath, setIsNewsPath] = useState<boolean>(false);

  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes('/current-price')) {
      //시세정보 path
      setIsCurrentPricePath(true);
      setIsItemPath(false);
      setIsNewsPath(false);
    } else if (pathname.includes('/item')) {
      // 종목정보 path
      setIsCurrentPricePath(false);
      setIsItemPath(true);
      setIsNewsPath(false);
    } else if (pathname.includes('/news')) {
      // 뉴스 path
      setIsCurrentPricePath(false);
      setIsItemPath(false);
      setIsNewsPath(true);
    }
  }, [pathname]);

  return (
    <BarContainer>
      <Nav isPath={isCurrentPricePath}>시세정보</Nav>
      <Nav isPath={isItemPath}>종목정보</Nav>
      <Nav isPath={isNewsPath}>뉴스</Nav>
    </BarContainer>
  );
};

const BarContainer = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
`;

const NavContainer = styled.button<Pick<INavType, 'isPath'>>`
  outline: none;
  border: none;
  padding: 10px 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 36px;
  color: ${({ isPath }) => (isPath ? color.black : color.zinc[600])};
  font: ${font.b1};
  background-color: ${({ isPath }) =>
    isPath ? color.zinc[200] : 'transparent'};
`;
