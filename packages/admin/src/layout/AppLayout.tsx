import styled from "@emotion/styled";
import { Header, SideBar } from "@mozu/ui";
import { getCookies } from "@mozu/util-config";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AppLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const accessToken = getCookies<string>("accessToken");

  useEffect(() => {
    if (accessToken === undefined)
      navigate("signin", {
        replace: true,
      });
    if (pathname === "/")
      navigate("/class-management", {
        replace: true,
      });
  }, [
    pathname,
    navigate,
    accessToken,
  ]);

  return (
    <AppContainer>
      <Header
        isAdmin={true}
        showNav={false}
        showRound={false}
      />
      <SideBar
        name={"대전시 진로융합원 창업마을"}
        role={"관리자"}
        navTitle={"관리"}
      />
      <MainContent
        isMargin={
          !(
            pathname.split("/")[1] === "class-management" &&
            (pathname.split("/")[3] === "start" || pathname.split("/")[3] === "monitoring")
          )
        }>
        <Outlet />
      </MainContent>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
`;

const MainContent = styled.div<{
  isMargin: boolean;
}>`
  margin-left: ${({ isMargin }) => (isMargin ? "280px" : "0")};
  margin-top: 64px;
  flex: 1;
`;
