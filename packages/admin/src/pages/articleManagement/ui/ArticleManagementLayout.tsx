import styled from "@emotion/styled";
import { Outlet, useLocation } from "react-router-dom";
import { ArticleSearchSideBar } from "@/features/articleCRUD"

const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

export const ArticleManagementLayout = () => {
  const location = useLocation();
  const shouldShowSidebar = !location.pathname.includes('/add') && !location.pathname.includes('/edit');

  return (
    <Container>
      {shouldShowSidebar && <ArticleSearchSideBar />}
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
  min-width: 0; /* flexbox 자식 요소의 너비 자동 축소 */

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    height: calc(100vh - 60px);
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    height: calc(100vh - 62px);
  }
`;