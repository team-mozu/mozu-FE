import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Check } from "@mozu/ui";
import { roundToFixed, type TableCellData } from "@/shared/lib";

interface TableCellProps {
  data: TableCellData;
  onClick?: () => void;
}

export const TableCell = ({ data, onClick }: TableCellProps) => {
  if (data.type === 'empty') {
    return <Td />;
  }

  if (data.type === 'progress') {
    return <Td>진행중</Td>;
  }

  if (data.type === 'completed' && data.data) {
    const { totalMoney, valMoney, profitNum, isNegative } = data.data;

    return (
      <Td>
        <Rate isNegative={isNegative} onClick={onClick}>
          <span>{totalMoney.toLocaleString()}원</span>
          <span>
            {!isNegative && "+"}
            {valMoney.toLocaleString()}원 ({!isNegative && "+"}
            {roundToFixed(parseFloat(profitNum), 2)}
            %)
          </span>
        </Rate>
      </Td>
    );
  }

  return <Td />;
};

interface CompletedBadgeProps {
  isCompleted: boolean;
}

export const TeamCompletedBadge = ({ isCompleted }: CompletedBadgeProps) => {
  if (!isCompleted) return null;

  return (
    <CompletedBadge>
      <Check
        size={12}
        color={color.green[500]}
      />
    </CompletedBadge>
  );
};

const Td = styled.td`
  flex: 0 0 11.11%;
  border-right: 1px solid ${color.zinc[200]};
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font: ${font.t4};
  
  &:last-child {
    border-right: none;
  }
`;

const Rate = styled.div<{
  isNegative: boolean | null | undefined;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: end;
  width: 100%;
  cursor: pointer;
  & > span:nth-of-type(1) {
    font: ${font.t1};
  }
  & > span:nth-of-type(2) {
    font: ${font.l1};
    color: ${({ isNegative }) => (isNegative ? color.blue[500] : color.red[500])};
  }

  &:hover {
    text-decoration: underline;
  }
`;

const CompletedBadge = styled.span`
  padding: 2px 6px;
  background-color: ${color.green[50]};
  color: ${color.green[600]};
  font: ${font.l1};
  border-radius: 4px;
  border: 1px solid ${color.green[200]};
  display: flex;
  align-items: center;
  gap: 2px;
`;