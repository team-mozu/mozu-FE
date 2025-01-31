import { Header, HistorySidebar, ItemSidebar } from '@mozu/ui';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

export const AppLayout = () => {
  return (
    <AppContainer>
      <Header isAdmin={false} />
      <Layout>
        <ItemSidebar />
        <HistorySidebar />
        <MainContent>
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
  flex-direction: row;
  overflow-x: hidden;
`;

const Layout = styled.div`
  margin-top: 64px;
`;

const MainContent = styled.div`
  margin-left: 320px;
  margin-right: 360px;
  flex: 1;
`;
