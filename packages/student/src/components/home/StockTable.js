import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useReactTable, getCoreRowModel, } from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
const data = [
    {
        name: '삼성전자',
        tradePrice: '55,300원',
        quantity: '10',
        tradeAmount: '553,000원',
        currentPrice: '53,700원',
        profit: '41,100원\n-13,400원 (-5.02%)',
    },
    {
        name: 'LG전자',
        tradePrice: '30,200원',
        quantity: '3',
        tradeAmount: '97,800원',
        currentPrice: '32,200원',
        profit: '21,100원\n+600원 (+0.23%)',
    },
    {
        name: '포스코홀딩스',
        tradePrice: '165,600원',
        quantity: '5',
        tradeAmount: '828,000원',
        currentPrice: '150,600원',
        profit: '36,100원\n-3600원 (-4.23%)',
    },
];
const columns = [
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
            const profitText = row.getValue('profit');
            const [currentPrice, profit] = profitText.split('\n');
            const isProfit = profit.includes('+');
            return (_jsxs(RateWrapper, { children: [_jsx("span", { children: currentPrice }), _jsx(ProfitSpan, { isProfit: isProfit, children: profit }), ' '] }));
        },
    },
];
export const StockTable = () => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (_jsxs(Table, { children: [_jsx("thead", { children: table.getHeaderGroups().map((headerGroup) => (_jsx("tr", { children: headerGroup.headers.map((header) => (_jsx(Th, { style: { width: header.column.getSize() }, children: header.column.columnDef.header }, header.id))) }, headerGroup.id))) }), _jsx("tbody", { children: table.getRowModel().rows.map((row) => (_jsx("tr", { children: row.getVisibleCells().map((cell) => (_jsx(Td, { style: {
                            width: cell.column.getSize(),
                        }, children: cell.column.id === 'profit'
                            ? cell.column.columnDef.cell
                                ? cell.column.columnDef.cell({ row })
                                : cell.renderValue()
                            : cell.renderValue() }, cell.id))) }, row.id))) })] }));
};
const Table = styled.table `
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
`;
const Th = styled.th `
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
const Td = styled.td `
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
const RateWrapper = styled.div `
  display: flex;
  flex-direction: column;
  text-align: right;
`;
const ProfitSpan = styled.span `
  color: ${(props) => (props.isProfit ? color.red[500] : color.blue[500])};
  font: ${font.b2};
`;
