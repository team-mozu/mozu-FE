import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface IThProp {
  width: string;
}

interface classItem {
  itemId: number;
  itemName: string;
  money: number[];
}

interface InvestInfoTableProps {
  classItems: classItem[];
  maxInvRound?: number;
}

export const InvestInfoTable = ({ classItems, maxInvRound }: InvestInfoTableProps) => {
  // maxInvRound가 있으면 사용, 없으면 money 배열에서 계산
  const actualMaxRound = maxInvRound || Math.max(...classItems.map(item => item.money.length - 1));
  const header = [
    "종목 이름",
    ...Array.from(
      {
        length: actualMaxRound,
      },
      (_, i) => `${i + 1}차`,
    ),
    "종료가",
  ];

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            {header.map((data, index) => (
              <Th
                key={data}
                width={index === 0 ? "25%" : `${75 / (header.length - 1)}%`}>
                {data}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classItems.map(item => {
            // maxInvRound를 사용하거나 해당 아이템의 실제 차수 (종료가 제외)
            const itemRounds = actualMaxRound;
            return (
              <tr key={item.itemId}>
                <Td width="25%">{item.itemName}</Td>
                {Array.from(
                  {
                    length: itemRounds,
                  },
                  (_, idx) => {
                    const amount = item.money[idx];
                    const isNumber = typeof amount === "number";
                    return (
                      <Td
                        key={`${item.itemId}-${idx}`}
                        width={`${75 / (itemRounds + 1)}%`}
                        alignRight={isNumber}>
                        {isNumber ? amount.toLocaleString() : "진행중.."}
                      </Td>
                    );
                  },
                )}
                <Td
                  width={`${75 / (itemRounds + 1)}%`}
                  alignRight>
                  {item.money[item.money.length - 1].toLocaleString()}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${color.zinc[100]};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${color.zinc[300]};
    border-radius: 4px;
    &:hover {
      background: ${color.zinc[400]};
    }
  }
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
`;

const Th = styled.th<IThProp>`
  width: ${({ width }) => width};
  font: ${font.b1};
  text-align: center;
  padding: 12px 16px;
  background-color: ${color.orange[50]};
  border: 1px solid ${color.zinc[200]};
`;

const Td = styled.td<
  IThProp & {
    alignRight?: boolean;
  }
>`
  width: ${({ width }) => width};
  font: ${font.b2};
  padding: 12px 16px;
  text-align: ${props => (props.alignRight ? "right" : "left")};
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
`;
