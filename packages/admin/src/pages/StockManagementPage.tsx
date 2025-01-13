import styled from '@emotion/styled';
import { SelectError, StockSearchSideBar } from '@mozu/ui';

export const StockManagementPage = () => {
  return (
    <Container>
      <StockSearchSideBar />
      <SelectError />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
`;
