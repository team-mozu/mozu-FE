import styled from "@emotion/styled";
import { Header, SideBar } from "@mozu/ui";
import { getCookies } from "@mozu/util-config";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageTransition } from "@/shared/ui";

// 데스크탑 반응형 브레이크포인트
const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

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
        <AnimatePresence mode="wait">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
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
  transition: all 0.3s ease;
  min-width: 0; /* flexbox 자식 요소의 너비 자동 축소 */
  overflow-x: auto; /* 가로 스크롤 허용 */

  /* Windows 일반 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    margin-left: ${({ isMargin }) => (isMargin ? "240px" : "0")};
    margin-top: 60px;
  }

  /* 중형 데스크탑 (1440px 이하) */
  ${desktopMediaQueries.medium} {
    margin-left: ${({ isMargin }) => (isMargin ? "260px" : "0")};
    margin-top: 62px;
  }

  /* 대형 데스크탑 (1680px 이하) */
  ${desktopMediaQueries.large} {
    margin-left: ${({ isMargin }) => (isMargin ? "270px" : "0")};
    margin-top: 64px;
  }
`;
