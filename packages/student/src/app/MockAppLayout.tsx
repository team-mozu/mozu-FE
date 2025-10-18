import styled from "@emotion/styled";
import { Header } from "@mozu/ui";
import { Outlet, useLocation } from "react-router-dom";
import { HistorySidebar, ItemSidebar } from "@/features";

/**
 * MockAppLayout은 데이터 로직 없이 AppLayout의 순수 UI 구조만을 렌더링합니다.
 * 사이드바와 헤더가 항상 표시되며, 정적인 props를 사용합니다.
 */
export const MockAppLayout = () => {
  const { pathname } = useLocation();
  const isMockResultPage = pathname.includes("__test__/mock-result");

  return (
    <AppContainer>
      <Header
        isAdmin={false}
        invDeg={1} // Mock 데이터
        showNav={true}
        showRound={true}
        isMargin={true}
      />

      <Layout>
        {/* Mock 결과 페이지에서는 사이드바를 숨김 */}
        {!isMockResultPage && (
          <>
            <ItemSidebar isMock={true} />
            <HistorySidebar isMock={true} />
          </>
        )}
        <MainContent isMockResultPage={isMockResultPage}>
          <Outlet />
        </MainContent>
      </Layout>
    </AppContainer>
  );
};

// AppLayout.tsx에서 스타일 복사
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
  isMockResultPage: boolean;
}>`
  padding-right: ${({ isMockResultPage }) => (isMockResultPage ? 0 : "463px")};
  margin-left: ${({ isMockResultPage }) => (isMockResultPage ? 0 : "320px")};
  flex: 1;
`;
