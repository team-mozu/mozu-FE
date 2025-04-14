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
  const header = ['종목 이름', '1차', '2차', '3차', '4차', '5차'];

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            {header.map((data, index) => (
              <Th key={index} width={index === 0 ? '30%' : '14%'}>
                {data}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classItems.map((item) => (
            <tr key={item.itemId}>
              <Td width="30%">{item.itemName}</Td>
              {item.money.slice(1).map((amount, idx) => (
                <Td key={idx} width="14%">
                  {amount.toLocaleString()}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

// 💡 테이블을 감싸는 래퍼 - 반응형 처리
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
`;

// 💡 동적으로 width 설정
const Th = styled.th<IThProp>`
  width: ${({ width }) => width};
  font: ${font.b1};
  text-align: left;
  padding: 12px 16px;
  background-color: ${color.orange[50]};
  border: 1px solid ${color.zinc[200]};
`;

const Td = styled.td<IThProp>`
  width: ${({ width }) => width};
  font: ${font.b2};
  padding: 12px 16px;
  text-align: left;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
`;
