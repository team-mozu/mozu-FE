import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';

interface IThProp {
  width: string;
}

interface classItem {
  itemId: number;
  itemName: string;
  money: number[];
}

export const InvestInfoTable = ({ classItems }: { classItems: classItem[] }) => {
  const maxRound = Math.max(...classItems.map((item) => item.money.length - 1));

  const header = ['종목 이름', '현재가', ...Array.from({ length: maxRound }, (_, i) => `${i + 1}차`), '최종 투자'];

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            {header.map((data, index) => (
              <Th key={index} width={index === 0 ? '25%' : '12.5%'}>
                {data}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classItems.map((item) => (
            <tr key={item.itemId}>
              <Td width="25%">{item.itemName}</Td>
              <Td width="12.5%" alignRight>
                {item.money[0].toLocaleString()}
              </Td>
              {Array.from({ length: maxRound }, (_, idx) => {
                const amount = item.money[idx + 1];
                const isNumber = typeof amount === 'number';
                return (
                  <Td
                    key={idx}
                    width="12.5%"
                    alignRight={isNumber}
                  >
                    {isNumber ? amount.toLocaleString() : '진행중..'}
                  </Td>
                );
              })}
              <Td width="12.5%" alignRight>
                {item.money[item.money.length - 1].toLocaleString()}
              </Td>
            </tr>
          ))}
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

const Td = styled.td<IThProp & { alignRight?: boolean }>`
  width: ${({ width }) => width};
  font: ${font.b2};
  padding: 12px 16px;
  text-align: ${(props) => (props.alignRight ? "right" : "left")};
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
`;