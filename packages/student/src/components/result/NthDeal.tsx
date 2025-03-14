import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { History } from './History';

interface IProp {
  deal: number;
}

export const NthDeal = ({ deal }: IProp) => {
  return (
    <Container>
      <label>{deal}차 거래</label>
      <div>
        {/* <History type="buy" /> */}
        <TestContainer>
          <BS type={'buy'}>매수</BS>
          <Stock>삼성전자</Stock>
          <Price>
            <Amount type={'buy'}>429,600원</Amount>
            <Total>53,700원 (8주)</Total>
          </Price>
        </TestContainer>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  > label {
    font: ${font.b1};
    color: ${color.zinc[600]};
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid ${color.zinc[100]};
    border-radius: 8px;
    background-color: ${color.zinc[50]};
  }
`;

// !

const TestContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
`;

const BS = styled.p<IHistoryProps>`
  color: ${({ type }) => (type === 'buy' ? color.red[500] : color.blue[500])};
  font: ${font.b1};
`;

const Stock = styled.p`
  color: ${color.black};
  font: ${font.b1};
  flex: 1;
`;

const Price = styled.div`
  display: flex;
  flex-direction: column;
`;

// 금액도 type에 따라 색상 변경
const Amount = styled.p<IHistoryProps>`
  font: ${font.b1};
  color: ${({ type }) => (type === 'buy' ? color.red[500] : color.blue[500])};
`;

const Total = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;
