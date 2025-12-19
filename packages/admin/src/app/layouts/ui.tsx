import styled from "@emotion/styled";
import { Header, SideBar } from "@mozu/ui";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { PageTransition } from "@/shared/ui";
import {
  shouldApplyMargin,
  shouldUsePageTransition,
} from "./model";

const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

export const AppLayoutUI = () => {
  const { pathname } = useLocation();

  const isMargin = shouldApplyMargin(pathname);
  const useTransition = shouldUsePageTransition(pathname);

  return (
    <AppContainer>
      <Header
        isAdmin
        showNav={false}
        showRound={false}
      />
      <SideBar
        name={"대전진로융합교육원\n창업경영마을"}
        role={"관리자"}
        navTitle={"관리"}
      />
      <MainContent isMargin={isMargin}>
        {useTransition ? (
          <AnimatePresence mode="wait">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        ) : (
          <Outlet />
        )}
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

const MainContent = styled.div<{ isMargin: boolean }>`
  margin-left: ${({ isMargin }) => (isMargin ? "280px" : "0")};
  margin-top: 64px;
  flex: 1;
  transition: all 0.3s ease;
  min-width: 0;
  overflow-x: auto;

  ${desktopMediaQueries.small} {
    margin-left: ${({ isMargin }) => (isMargin ? "240px" : "0")};
    margin-top: 60px;
  }

  ${desktopMediaQueries.medium} {
    margin-left: ${({ isMargin }) => (isMargin ? "260px" : "0")};
    margin-top: 62px;
  }

  ${desktopMediaQueries.large} {
    margin-left: ${({ isMargin }) => (isMargin ? "270px" : "0")};
    margin-top: 64px;
  }
`;
