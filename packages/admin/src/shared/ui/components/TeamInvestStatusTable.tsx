import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface IThProps {
  width?: string;
  textAlign?: string;
  padding?: string;
}

interface ITdProps {
  width?: string;
  textAlign?: string;
  padding?: string;
  color?: string;
}

interface DealContent {
  id: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
  invCount: number;
}


interface TeamInvestStatusTableProps {
  contents: DealContent[];
}

export const TeamInvestStatusTable = ({ contents }: TeamInvestStatusTableProps) => {
  const header = [
    {
      text: "구분",
      width: "140px",
    },
    {
      text: "종목 이름",
      width: "320px",
    },
    {
      text: "거래 가격",
      width: "160px",
    },
    {
      text: "수량",
      width: "120px",
    },
    {
      text: "수익률",
      width: "260px",
    },
  ];

  const renderRate = (item: DealContent) => {
    const buyAmount = item.itemPrice * item.orderCount;
    const rateAmount = item.totalMoney - buyAmount;
    const ratePercent = ((rateAmount / buyAmount) * 100).toFixed(2);
    const sign = rateAmount >= 0 ? "+" : "-";
    return `${sign}${Math.abs(rateAmount).toLocaleString()} (${sign}${Math.abs(+ratePercent)}%)`;
  };

  return (
    <Table>
      <Thead>
        <tr>
          {header.map((data, index) => (
            <Th
              key={index}
              width={data.width}
              textAlign={index !== 1 ? "center" : "left"}
              padding={index !== 1 ? "0px" : "16px"}>
              {data.text}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {contents && contents.length > 0 ? (
          contents.map(item => (
            <tr key={item.id}>
              <Td
                width="140px"
                textAlign="center"
                padding="0px"
                color={
                  item.orderType === "BUY" ? color.red[500] : item.orderType === "SELL" ? color.blue[500] : color.black
                }>
                {item.orderType === "BUY" ? "매수" : "매도"}
              </Td>

              <Td
                width="320px"
                textAlign="left"
                padding="0 0 0 16px"
                color={color.black}>
                {item.itemName}
              </Td>

              <Td
                width="160px"
                textAlign="right"
                padding="0 16px 0 0"
                color={color.black}>
                {item.itemPrice.toLocaleString()}
              </Td>

              <Td
                width="120px"
                textAlign="center"
                padding="0"
                color={color.black}>
                {item.orderCount}
              </Td>

              <Td
                width="260px"
                textAlign="right"
                padding="0px 16px 0px 0px"
                color={color.black}>
                {item.totalMoney.toLocaleString()}
                <RateDiv
                  color={
                    item.totalMoney - item.itemPrice * item.orderCount > 0
                      ? color.red[500]
                      : item.totalMoney - item.itemPrice * item.orderCount < 0
                        ? color.blue[500]
                        : color.green[600]
                  }>
                  {renderRate(item)}
                </RateDiv>
              </Td>
            </tr>
          ))
        ) : (
          <tr>
            <Td
              width="100%"
              padding="20px"
              colSpan={5}>
              데이터가 없습니다.
            </Td>
          </tr>
        )}
      </Tbody>
    </Table>
  );
};

const RateDiv = styled.div<{
  color: string;
}>`
  font: ${font.l1};
  color: ${props => props.color};
`;

const Table = styled.table`
  border-radius: 4px;
  border-collapse: separate;
  overflow: hidden;
  width: 1000px;
`;

const Th = styled.th<IThProps>`
  font: ${font.b1};
  height: 64px;
  display: flex;
  border: 1px solid ${color.zinc[200]};
  align-items: center;
  width: ${props => props.width};
  justify-content: ${props => props.textAlign};
  padding-left: ${props => props.padding};
`;

const Td = styled.td<ITdProps>`
  font: ${font.b2};
  border: 1px solid ${color.zinc[200]};
  height: 64px;
  color: ${props => props.color};
  padding: ${props => props.padding};
  display: flex;
  flex-direction: column;
  text-align: ${props => props.textAlign};
  justify-content: center;
`;

const Thead = styled.thead`
  > tr {
    background-color: ${color.orange[50]};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const Tbody = styled.tbody`
  > tr {
    width: 100%;
    background-color: ${color.white};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
