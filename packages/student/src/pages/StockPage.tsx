import styled from '@emotion/styled';
import { StockStatusBar } from '@/components';

export const StockPage = () => {
  return (
    <Container>
      <StockStatusBar></StockStatusBar>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
`;
