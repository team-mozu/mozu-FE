import { Header, HistorySidebar, ItemSidebar } from '@mozu/ui';
import { Outlet, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

export const AppLayout = () => {
  const [isResultPage, setIsResultPage] = useState<boolean>(false);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/news') {
      setIsResultPage(false);
    } else if (pathname.includes('/home')) {
      setIsResultPage(false);
    } else if (pathname === '/result') {
      setIsResultPage(true);
    } else {
      setIsResultPage(false);
    }
  }, [pathname]);
  return (
    <AppContainer>
      <Header isAdmin={false} />
      <Layout>
        {!isResultPage && (
          <>
            <ItemSidebar />
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
  padding-right: ${({ isResultPage }) => (isResultPage ? 0 : '360px')};
  margin-left: ${({ isResultPage }) => (isResultPage ? 0 : '320px')};
  flex: 1;
`;
