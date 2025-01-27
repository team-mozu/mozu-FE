import { SideBar, Header } from '@mozu/ui';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

export const AppLayout = () => {
  return (
    <AppContainer>
      <Header isAdmin={false} />
      {/* <SideBar
        name={'대전시 진로융합원 창업마을'}
        role={'관리자'}
        navTitle={'관리'}
      /> */}
      <MainContent>
        <Outlet />
      </MainContent>
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

const MainContent = styled.div`
  margin-left: 280px;
  margin-top: 64px;
  flex: 1;
`;
