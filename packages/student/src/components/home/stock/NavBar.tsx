import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = ["종목정보", "시세정보"];
  const navRoutes = ["/stock-info", "/price-info"];

  const currentPath = location.pathname;
  const activeIndex = navRoutes.findIndex((route) =>
    currentPath.includes(route)
  );

  const navClick = (index: number) => {
    const newPath = currentPath.replace(
      /\/(price-info|stock-info)/,
      navRoutes[index]
    );
    if (newPath !== currentPath) {
      navigate(newPath);
    }
  };

  return (
    <BarContainer>
      {navItems.map((data, index) => (
        <Nav
          key={data}
          onClick={() => navClick(index)}
          isActive={index === activeIndex}
        >
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
  gap: 10px;
`;

const NavContainer = styled.button<Pick<INavType, "isActive">>`
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
  background-color: ${({ isActive }) =>
    isActive ? color.zinc[200] : "transparent"};
  transition: 0.2s ease-in-out;
  ${({ isActive }) =>
    !isActive &&
    `
      :hover {
        background-color: ${color.zinc[100]};
      }
    `}
`;
