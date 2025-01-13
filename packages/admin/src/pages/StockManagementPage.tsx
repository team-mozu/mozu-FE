import styled from '@emotion/styled';
import {
  SelectError,
  StockSearchSideBar,
  StockManagementDetail,
} from '@mozu/ui';
import { useState } from 'react';

export const StockManagementPage = () => {
  const [isSelect, setIsSelect] = useState<boolean>(true);
  return (
    <Container>
      <StockSearchSideBar />
      {isSelect ? <StockManagementDetail /> : <SelectError />}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
`;
