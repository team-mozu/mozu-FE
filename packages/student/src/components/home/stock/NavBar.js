import { jsx as _jsx } from "react/jsx-runtime";
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Nav = ({ isActive, children, onClick }) => {
    return (_jsx(NavContainer, { isActive: isActive, onClick: onClick, children: children }));
};
export const NavBar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const navItems = ['시세정보', '종목정보'];
    const navRoutes = ['price-info', 'stock-info']; // 각 버튼의 경로
    const navClick = (index) => {
        setActiveIndex(index);
        navigate(navRoutes[index]);
    };
    return (_jsx(BarContainer, { children: navItems.map((data, index) => (_jsx(Nav, { onClick: () => navClick(index), isActive: index === activeIndex, children: data }, data))) }));
};
const BarContainer = styled.div `
  height: 40px;
  display: flex;
  justify-content: center;
`;
const NavContainer = styled.button `
  outline: none;
  border: none;
  padding: 10px 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 36px;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? color.black : color.zinc[600])};
  font: ${font.b1};
  background-color: ${({ isActive }) => isActive ? color.zinc[200] : 'transparent'};

  ${({ isActive }) => !isActive &&
    `
      :hover {
        background-color: ${color.zinc[100]};
      }
    `}
`;
