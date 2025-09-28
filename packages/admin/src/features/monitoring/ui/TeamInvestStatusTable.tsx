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
  itemId: number;
  itemName: string;
  itemMoney: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
  invDeg: number;
}

interface TeamInvestStatusTableProps {
  contents: DealContent[];
}

export const TeamInvestStatusTable = ({ contents }: TeamInvestStatusTableProps) => {
  const header = [
    {
      text: "구분",
      width: "140px",
      responsiveWidths: { w1440: "128px", w1200: "116px", w1024: "104px", w900: "92px" }
    },
    {
      text: "종목 이름",
      width: "320px",
      responsiveWidths: { w1440: "294px", w1200: "268px", w1024: "242px", w900: "216px" }
    },
    {
      text: "거래 가격",
      width: "160px",
      responsiveWidths: { w1440: "147px", w1200: "134px", w1024: "122px", w900: "108px" }
    },
    {
      text: "수량",
      width: "120px",
      responsiveWidths: { w1440: "110px", w1200: "101px", w1024: "91px", w900: "82px" }
    },
    {
      text: "수익률",
      width: "260px",
      responsiveWidths: { w1440: "239px", w1200: "218px", w1024: "197px", w900: "176px" }
    },
  ];

  const renderRate = (item: DealContent) => {
    const buyAmount = item.itemMoney * item.orderCount;
    const rateAmount = item.totalMoney - buyAmount;
    const ratePercent = ((rateAmount / buyAmount) * 100).toFixed(2);
    const sign = rateAmount >= 0 ? "+" : "-";
    return `${sign}${Math.abs(rateAmount).toLocaleString()} (${sign}${Math.abs(+ratePercent)}%)`;
  };

  return (
    <TableContainer>
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
                {item.itemMoney.toLocaleString()}
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
                    item.totalMoney - item.itemMoney * item.orderCount > 0
                      ? color.red[500]
                      : item.totalMoney - item.itemMoney * item.orderCount < 0
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
    </TableContainer>
  );
};

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  /* 데스크탑 반응형 - 테이블 컨테이너 스크롤 영역 */
  @media (max-width: 1200px) {
    margin: 0 -8px;
    padding: 0 8px;
  }

  @media (max-width: 1024px) {
    margin: 0 -12px;
    padding: 0 12px;
  }

  @media (max-width: 900px) {
    margin: 0 -16px;
    padding: 0 16px;
  }
`;

const RateDiv = styled.div<{
  color: string;
}>`
  font: ${font.l1};
  color: ${props => props.color};

  /* 데스크탑 반응형 - 수익률 텍스트 조정 */
  @media (max-width: 1200px) {
    font: ${font.l2};
  }

  @media (max-width: 1024px) {
    font: ${font.l2};
  }

  @media (max-width: 900px) {
    font: ${font.l2};
  }
`;

const Table = styled.table`
  border-radius: 4px;
  border-collapse: separate;
  overflow: hidden;
  width: 1000px;

  /* 데스크탑 반응형 - 테이블 너비 조정 */
  @media (max-width: 1440px) {
    width: 920px;
  }

  @media (max-width: 1200px) {
    width: 840px;
    border-radius: 3px;
  }

  @media (max-width: 1024px) {
    width: 760px;
    border-radius: 2px;
  }

  @media (max-width: 900px) {
    width: 680px;
    border-radius: 2px;
  }
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

  /* 데스크탑 반응형 - 헤더 조정 */
  @media (max-width: 1440px) {
    height: 60px;
    font: ${font.b2};
  }

  @media (max-width: 1200px) {
    height: 56px;
    font: ${font.l1};
  }

  @media (max-width: 1024px) {
    height: 52px;
    font: ${font.l2};
  }

  @media (max-width: 900px) {
    height: 48px;
    font: ${font.l2};
  }
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

  /* 데스크탑 반응형 - 셀 조정 */
  @media (max-width: 1440px) {
    height: 60px;
    font: ${font.l1};
  }

  @media (max-width: 1200px) {
    height: 56px;
    font: ${font.l2};
  }

  @media (max-width: 1024px) {
    height: 52px;
    font: ${font.l2};
  }

  @media (max-width: 900px) {
    height: 48px;
    font: ${font.l2};
  }
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
