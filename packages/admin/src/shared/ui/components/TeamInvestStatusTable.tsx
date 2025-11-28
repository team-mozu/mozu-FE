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
      text: "총 거래 가격",
      width: "260px",
    },
  ];

  // 총 거래 가격 합계 계산
  const totalAmount = contents?.reduce((sum, item) => sum + item.totalMoney, 0) || 0;

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

        {/* 합계 행 - 데이터가 있을 때만 표시 */}
        {contents && contents.length > 0 && (
          <SummaryRow>
            <SummaryTd width="140px" />
            <SummaryTd width="320px" />
            <SummaryTd width="160px" />
            <SummaryTd
              width="120px"
              textAlign="center"
              padding="0">
              총합
            </SummaryTd>
            <SummaryTd
              width="260px"
              textAlign="right"
              padding="0px 16px 0px 0px"
              color={color.orange[600]}>
              {totalAmount.toLocaleString()}원
            </SummaryTd>
          </SummaryRow>
        )}
      </Tbody>
    </Table>
  );
};

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

const SummaryRow = styled.tr`
  width: 100%;
  background-color: ${color.orange[50]};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${color.orange[200]};
`;

const SummaryTd = styled.td<ITdProps>`
  font: ${font.t2};
  font-weight: 600;
  border: 1px solid ${color.zinc[200]};
  height: 56px;
  color: ${props => props.color || color.zinc[800]};
  padding: ${props => props.padding};
  display: flex;
  flex-direction: column;
  text-align: ${props => props.textAlign};
  justify-content: center;
  width: ${props => props.width};
`;
