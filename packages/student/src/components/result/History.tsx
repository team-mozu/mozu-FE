import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IHistoryProps {
  type: 'buy' | 'sell';
}

// 사용하실땐 값을 다 prop으로 받아오셔서 사용하세용
export const History = ({ type }: IHistoryProps) => {
  return (
    <Container>
      <BS type={type}>{type === 'buy' ? '매수' : '매도'}</BS>
      <Stock>삼성전자</Stock>
      <Price>
        <Amount type={type}>429,600원</Amount>
        <Total>53,700원 (8주)</Total>
      </Price>
    </Container>
  );
};

const Container = styled.div`
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
