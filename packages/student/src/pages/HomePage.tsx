import { StockTable, TotalProperty } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

export const HomePage = () => {
  return (
    <Wrapper>
      <TotalProperty
        money="1,850,000원"
        rate="+850,000원 (+85%)"
        basicMoney="1,000,000원"
        cash="500,000원"
        stock="1,350,000원"
      />
      <TableDiv>
        보유주식
        <StockTable />
      </TableDiv>
    </Wrapper>
  );
};

const TableDiv = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 24px;
  font: ${font.t2};
  padding: 32px 32px 200px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 656px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  padding: 40px 0px;
  width: calc(100dvw - 680px);
`;
