import { SideBar, Header } from '@mozu/ui';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

export const AppLayout = () => {
  return (
    <AppContainer>
      <Header />
      <SideBar
        name={'대전시 진로융합원 창업마을'}
        role={'관리자'}
        navTitle={'관리'}
      />
      <MainContent>
        <Outlet />
      </MainContent>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const MainContent = styled.div`
  margin-left: 280px; /* 사이드바 너비만큼 여백 추가 */
  margin-top: 64px;
  flex: 1; /* 남은 공간을 채우는 콘텐츠 */
`;
