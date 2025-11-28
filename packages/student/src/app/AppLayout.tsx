import styled from "@emotion/styled";
import { Header } from "@mozu/ui";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useGetClassItem } from "@/entities/class";
import { useGetTeamDetail } from "@/entities/user";
import { HistorySidebar, ItemSidebar, ItemSidebarSkeleton } from "@/features";
import { PageTransition, SSELoadingSpinner } from "@/shared";
import { useSSE } from "@/shared/contexts/SSEContext";
import { headerConfigMap } from "./router";

export const AppLayout = () => {
  const { data: teamData } = useGetTeamDetail();
  const { pathname } = useLocation();
  const { isLoading } = useGetClassItem();

  // SSE 프로바이더에서 상태 가져오기
  const { isReconnecting, retryCount } = useSSE();

  const splitedPath = pathname.split("/");
  const isResultPage = splitedPath[splitedPath.length - 1] === "result";
  const isEndingPage = splitedPath[splitedPath.length - 1] === "ending";

  const resolvedPath = pathname.replace(/\d+/g, ":classId");
  const headerConfig = headerConfigMap[resolvedPath] ?? {
    showNav: false,
    showRound: false,
    isAdminMargin: true,
  };

  return (
    <AppContainer>
      {/* 재연결 시도 중일 때만 SSELoadingSpinner 표시 */}
      <SSELoadingSpinner
        isVisible={isReconnecting}
        retryCount={retryCount}
      />

      <Header
        isAdmin={false}
        invDeg={teamData?.curInvRound ?? 0}
        showNav={headerConfig.showNav}
        showRound={headerConfig.showRound}
        isMargin={headerConfig.isAdminMargin}
      />

      <Layout>
        {!isResultPage && !isEndingPage && (
          <>
            {isLoading ? <ItemSidebarSkeleton /> : <ItemSidebar />}
            <HistorySidebar />
          </>
        )}
        <MainContent
          isResultPage={isResultPage}
          isEndingPage={isEndingPage}>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </MainContent>
      </Layout>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Layout = styled.div`
  margin-top: 64px;
  display: flex;
`;

const MainContent = styled.div<{
  isResultPage: boolean;
  isEndingPage: boolean;
}>`
  padding-right: ${({ isResultPage, isEndingPage }) => (isResultPage || isEndingPage ? 0 : "463px")};
  margin-left: ${({ isResultPage, isEndingPage }) => (isResultPage || isEndingPage ? 0 : "320px")};
  flex: 1;
`;