import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface IHistoryProps {
  type: "BUY" | "SELL";
  totalMoney: string;
  itemMoney: string;
  itemCount: number;
  itemName: string;
}

// 사용하실땐 값을 다 prop으로 받아오셔서 사용하세용
export const History = ({ type, totalMoney, itemMoney, itemCount, itemName }: IHistoryProps) => {
  return (
    <Container>
      <BS type={type}>{type === "BUY" ? "매수" : "매도"}</BS>
      <Stock>{itemName}</Stock>
      <Price>
        <Amount type={type}>{totalMoney}원</Amount>
        <Total>
          {itemMoney}원 ({itemCount}주)
        </Total>
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

const BS = styled.p<{
  type: "BUY" | "SELL";
}>`
  color: ${({ type }) => (type === "BUY" ? color.red[500] : color.blue[500])};
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

const Amount = styled.p<{
  type: "BUY" | "SELL";
}>`
  font: ${font.b1};
  color: ${({ type }) => (type === "BUY" ? color.red[500] : color.blue[500])};
  text-align: end;
`;

const Total = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;
