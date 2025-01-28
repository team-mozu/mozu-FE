import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useState } from 'react';

interface INavType {
  children: string;
  isActive: boolean;
  onClick: () => void;
}

const Nav = ({ isActive, children, onClick }: INavType) => {
  return (
    <NavContainer isActive={isActive} onClick={onClick}>
      {children}
    </NavContainer>
  );
};

export const NavBar = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const navName = ['시세정보', '종목정보', '뉴스'];

  const navClick = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <BarContainer>
      {navName.map((data, index) => (
        <Nav onClick={() => navClick(index)} isActive={index === activeIndex}>
          {data}
        </Nav>
      ))}
    </BarContainer>
  );
};

const BarContainer = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
`;

const NavContainer = styled.button<Pick<INavType, 'isActive'>>`
  outline: none;
  border: none;
  padding: 10px 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 36px;
  color: ${({ isActive }) => (isActive ? color.black : color.zinc[600])};
  font: ${font.b1};
  background-color: ${({ isActive }) =>
    isActive ? color.zinc[200] : 'transparent'};
`;
