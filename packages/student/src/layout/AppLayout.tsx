import { Header, Toast } from "@mozu/ui";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useGetArticleList, useGetClassItem, useGetTeamDetail } from "@/apis";
import { ItemSidebar, HistorySidebar, ItemSidebarSkeleton } from "@/components";
import { useSSE } from "@/hook";
import { removeCookiesAsync } from "@configs/util";
import { queryClient } from "..";
import { headerConfigMap } from "@/routes";
import { useRef } from "react";

export const AppLayout = () => {
  const { data: teamData, refetch: teamDataRefetch } = useGetTeamDetail();
  const { refetch: articleDataRefetch } = useGetArticleList();
  const { pathname } = useLocation();
  const dirtyFix = useRef<number>(0); // FIXME: 임시적인 예외 처리입니다

  const { isLoading, refetch: classItemRefetch } = useGetClassItem();

  const navigate = useNavigate();

  const splitedPath = pathname.split("/");
  const isResultPage = splitedPath[splitedPath.length - 1] === "result";

  useSSE(`${import.meta.env.VITE_SERVER_URL}/team/sse`, undefined, undefined, {
    CLASS_NEXT_INV_START: () => {
      localStorage.removeItem("trade");
      classItemRefetch();
      teamDataRefetch();
      articleDataRefetch();
      queryClient.invalidateQueries({ queryKey: ["getStock"], exact: false });
      Toast("다음 투자가 시작되었습니다", { type: "info" });
    },
    CLASS_CANCEL: async () => {
      if (dirtyFix.current === 0) {
        dirtyFix.current++;
        return;
      }

      Toast("수업이 취소되었습니다.", { type: "error" });

      queryClient.clear();
      const domain = import.meta.env.VITE_STUDENT_COOKIE_DOMAIN;
      await removeCookiesAsync(["accessToken", "authority"], {
        path: "/",
        secure: true,
        sameSite: "none",
        domain,
      });
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
        invDeg={teamData?.invDeg ?? 0}
        showNav={headerConfig.showNav}
        showRound={headerConfig.showRound}
        isMargin={headerConfig.isAdminMargin}
      />

      <Layout>
        {!isResultPage && (
          <>
            {isLoading ? <ItemSidebarSkeleton /> : <ItemSidebar />}
            <HistorySidebar />
          </>
        )}
        <MainContent isResultPage={isResultPage}>
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

const MainContent = styled.div<{ isResultPage: boolean }>`
  padding-right: ${({ isResultPage }) => (isResultPage ? 0 : "360px")};
  margin-left: ${({ isResultPage }) => (isResultPage ? 0 : "320px")};
  flex: 1;
`;
