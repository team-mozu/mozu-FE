import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface StockData {
  name: string;
  tradePrice: string;
  quantity: string;
  tradeAmount: string;
  currentPrice: string;
  profit: string;
}

const data: StockData[] = [
  {
    name: '삼성전자',
    tradePrice: '53,800원',
    quantity: '10',
    tradeAmount: '538,000원',
    currentPrice: '51,100원',
    profit: '51,100원\n-27,000원 (-5.02%)',
  },
  {
    name: 'LG전자',
    tradePrice: '85,600원',
    quantity: '3',
    tradeAmount: '256,800원',
    currentPrice: '85,800원',
    profit: '51,100원\n+600원 (+0.23%)',
  },
];

const columns: ColumnDef<StockData>[] = [
  { accessorKey: 'name', header: '종목 이름', size: 376 },
  { accessorKey: 'tradePrice', header: '거래 가격', size: 140 },
  { accessorKey: 'quantity', header: '수량', size: 100 },
  { accessorKey: 'tradeAmount', header: '거래 금액', size: 140 },
  { accessorKey: 'currentPrice', header: '현재 가격', size: 140 },
  {
    accessorKey: 'profit',
    header: '수익률',
    size: 200,
    cell: ({ row }) => {
      const profitText = row.getValue('profit') as string;
      const [currentPrice, profit] = profitText.split('\n'); // 줄바꿈 기준으로 분리
      const isProfit = profit.includes('+');

      return (
        <RateWrapper>
          <span>{currentPrice}</span> {/* 현재가는 기본 색 */}
          <ProfitSpan isProfit={isProfit}>{profit}</ProfitSpan>{' '}
          {/* 수익 부분만 색 적용 */}
        </RateWrapper>
      );
    },
  },
];

export const StockTable = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th key={header.id} style={{ width: header.column.getSize() }}>
                {header.column.columnDef.header as string}
              </Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td
                key={cell.id}
                style={{
                  width: cell.column.getSize(),
                }}
              >
                {cell.column.id === 'profit'
                  ? cell.column.columnDef.cell
                    ? (cell.column.columnDef.cell as any)({ row })
                    : cell.renderValue()
                  : cell.renderValue()}
              </Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  font: ${font.b1};
  height: 64px;
  background: ${color.orange[50]};
  border-bottom: 1px solid ${color.zinc[200]};
  text-align: left;
  vertical-align: middle;
  border: 1px solid ${color.zinc[200]};
  padding: 16px;
  &:first-of-type {
    border-top-left-radius: 8px;
  }

  &:last-of-type {
    border-top-right-radius: 8px;
    text-align: center;
  }
`;

const Td = styled.td`
  height: 64px;
  font: ${font.b2};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px;
  vertical-align: middle;
  white-space: pre-line; /* 줄바꿈 적용 */

  &:last-of-type {
    text-align: right;
  }

  tbody tr:last-of-type & {
    &:first-of-type {
      border-bottom-left-radius: 8px;
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
`;

const RateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
`;

const ProfitSpan = styled.span<{ isProfit: boolean }>`
  color: ${(props) => (props.isProfit ? color.red[500] : color.blue[500])};
  font: ${font.b2};
`;
