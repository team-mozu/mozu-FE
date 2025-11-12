import styled from "@emotion/styled";
import { Header, Toast } from "@mozu/ui";
import { removeCookiesAsync } from "@mozu/util-config";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetClassItem } from "@/entities/class";
import { useGetTeamDetail } from "@/entities/user";
import { HistorySidebar, ItemSidebar, ItemSidebarSkeleton } from "@/features";
import { SSELoadingSpinner, useTypeSSE } from "@/shared";
import { headerConfigMap } from "./router";

export const AppLayout = () => {
  const { data: teamData } = useGetTeamDetail();
  const { pathname } = useLocation();
  const { isLoading } = useGetClassItem();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const splitedPath = pathname.split("/");
  const isResultPage = splitedPath[splitedPath.length - 1] === "result";
  const isEndingPage = splitedPath[splitedPath.length - 1] === "ending";

  const resolvedPath = pathname.replace(/\d+/g, ":classId");
  const headerConfig = headerConfigMap[resolvedPath] ?? {
    showNav: false,
    showRound: false,
    isAdminMargin: true,
  };

  // 전역 SSE 연결 관리
  const { isConnected, isConnecting } = useTypeSSE(
    `${import.meta.env.VITE_SERVER_URL}/team/sse`,
    undefined,
    error => {
      console.log(error);
    },
    {
      CLASS_NEXT_INV_START: () => {
        console.log("[AppLayout] 다음 투자 라운드 시작됨 - 팀 데이터 갱신");
        // React Query 캐시 무효화를 통해 서버에서 최신 데이터 가져오기
        queryClient.invalidateQueries({
          queryKey: [
            "team",
          ],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "class",
          ],
        });
      },
      CLASS_CANCEL: async () => {
        Toast("수업이 취소되었습니다.", {
          type: "error",
        });

        const domain = import.meta.env.VITE_STUDENT_COOKIE_DOMAIN;
        await removeCookiesAsync(
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
    },
  );

  return (
    <AppContainer>
      <SSELoadingSpinner isVisible={isConnecting && !isConnected} />

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
