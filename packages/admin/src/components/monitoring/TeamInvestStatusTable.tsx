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
  id: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  orderType: string;
  totalMoney: number;
}

interface TeamInvestStatusTableProps {
  contents: DealContent[];
}

export const TeamInvestStatusTable = ({
  contents,
}: TeamInvestStatusTableProps) => {
  const header = [
    { text: "구분", width: "120px" },
    { text: "종목 이름", width: "300px" },
    { text: "거래 가격", width: "140px" },
    { text: "수량", width: "100px" },
    { text: "현재 가격", width: "140px" },
    { text: "수익률", width: "200px" },
  ];

  const renderRate = (item: DealContent) => {
    const buyAmount = item.itemMoney * item.orderCount;
    const rateAmount = item.totalMoney - buyAmount;
    const ratePercent = ((rateAmount / buyAmount) * 100).toFixed(2);
    const sign = rateAmount >= 0 ? "+" : "-";
    return `${sign}${Math.abs(rateAmount).toLocaleString()} (${sign}${Math.abs(
      +ratePercent
    )}%)`;
  };

  return (
    <Table>
      <Thead>
        <tr>
          {header.map((data, index) => (
            <Th
              key={index}
              width={data.width}
              textAlign={index === 0 || index === 5 ? "center" : "left"}
              padding={index === 0 || index === 5 ? "0px" : "16px"}
            >
              {data.text}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {contents && contents.length > 0 ? (
          contents.map((item) => (
            <tr key={item.id}>
              <Td
                width="120px"
                textAlign="center"
                padding="0px"
                color={
                  item.orderType === "BUY"
                    ? color.red[500]
                    : item.orderType === "SELL"
                      ? color.blue[500]
                      : color.black
                }
              >
                {item.orderType === "BUY" ? "매수" : "매도"}
              </Td>

              <Td
                width="300px"
                textAlign="left"
                padding="0 0 0 16px"
                color={color.black}
              >
                {item.itemName}
              </Td>

              <Td
                width="140px"
                textAlign="left"
                padding="0 0 0 16px"
                color={color.black}
              >
                {item.itemMoney.toLocaleString()}
              </Td>

              <Td
                width="100px"
                textAlign="left"
                padding="0 0 0 16px"
                color={color.black}
              >
                {item.orderCount}
              </Td>

              <Td
                width="140px"
                textAlign="left"
                padding="0 0 0 16px"
                color={color.black}
              >
                {(item.totalMoney / item.orderCount).toLocaleString()}
              </Td>

              <Td
                width="200px"
                textAlign="right"
                padding="0px 16px 0px 0px"
                color={color.black}
              >
                {item.totalMoney.toLocaleString()}
                <RateDiv
                  color={
                    item.totalMoney - item.itemMoney * item.orderCount > 0
                      ? color.red[500]
                      : item.totalMoney - item.itemMoney * item.orderCount < 0
                        ? color.blue[500]
                        : color.green[600]
                  }
                >
                  {renderRate(item)}
                </RateDiv>
              </Td>
            </tr>
          ))
        ) : (
          <tr>
            <Td width="100%" padding="20px" colSpan={6}>
              데이터가 없습니다.
            </Td>
          </tr>
        )}
      </Tbody>
    </Table>
  );
};

const RateDiv = styled.div<{ color: string }>`
  font: ${font.l1};
  color: ${(props) => props.color};
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
  width: ${(props) => props.width};
  justify-content: ${(props) => props.textAlign};
  padding-left: ${(props) => props.padding};
`;

const Td = styled.td<ITdProps>`
  font: ${font.b2};
  border: 1px solid ${color.zinc[200]};
  height: 64px;
  color: ${(props) => props.color};
  padding: ${(props) => props.padding};
  display: flex;
  flex-direction: column;
  text-align: ${(props) => props.textAlign};
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
