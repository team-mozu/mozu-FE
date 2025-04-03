import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IProp {
  deal: number;
  orderHistory: React.ReactNode;
}

export const NthDeal = ({ deal, orderHistory }: IProp) => {
  return (
    <Container>
      <label>{deal}차 거래</label>
      <div>{orderHistory}</div>
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

/* color: ${({ type }) => (type === 'buy' ? color.red[500] : color.blue[500])}; */
const BS = styled.p`
  color: ${color.red[500]}
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

/* color: ${({ type }) =>
type === 'buy' ? color.red[500] : color.blue[500]}; */
// 금액도 type에 따라 색상 변경
const Amount = styled.p`
  font: ${font.b1};
  color: ${color.red[500]};
`;

const Total = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;
