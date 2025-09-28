import styled from "@emotion/styled";
import { Header, Toast } from "@mozu/ui";
import { removeCookies } from "@mozu/util-config";
import { useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetClassItem, useGetTeamDetail } from "@/apis";
import { HistorySidebar, ItemSidebar, ItemSidebarSkeleton } from "@/components";
import { useSSE } from "@/hook";
import { headerConfigMap } from "@/routes";
import { queryClient } from "..";

export const AppLayout = () => {
  const { data: teamData } = useGetTeamDetail();
  const { pathname } = useLocation();
  const dirtyFix = useRef<number>(0); // FIXME: 임시적인 예외 처리입니다
  const invStartFix = useRef<number>(0);
  const { isLoading } = useGetClassItem();

  const navigate = useNavigate();

  const splitedPath = pathname.split("/");
  const isResultPage = splitedPath[splitedPath.length - 1] === "result";
  const isEndingPage = splitedPath[splitedPath.length - 1] === "ending";

  useSSE(`${import.meta.env.VITE_SERVER_URL}/team/sse`, undefined, undefined, {
    CLASS_NEXT_INV_START: () => {
      console.log("asnansn");
      localStorage.removeItem("trade");
      if (invStartFix.current === 0) {
        invStartFix.current++;
        return;
      }
      Toast("다음 투자가 시작되었습니다", {
        type: "info",
      });
    },
    CLASS_CANCEL: async () => {
      if (dirtyFix.current === 0) {
        dirtyFix.current++;
        return;
      }
      Toast("수업이 취소되었습니다.", {
        type: "error",
      });
      queryClient.clear();
      const domain = import.meta.env.VITE_STUDENT_COOKIE_DOMAIN;
      await removeCookies(
        [
          "accessToken",
          "authority",
        ],
        {
          path: "/",
          secure: true,
          sameSite: "none",
          domain,
        },
      );
      navigate("/signin");
    },
  });

  const resolvedPath = pathname.replace(/\d+/g, ":classId");
  const headerConfig = headerConfigMap[resolvedPath] ?? {
    showNav: false,
    showRound: false,
    isAdminMargin: true,
  };

  return (
    <AppContainer>
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
          <Outlet />
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
