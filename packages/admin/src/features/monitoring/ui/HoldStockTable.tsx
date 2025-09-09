import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { roundToFixed } from "@/shared/lib/utils";

interface StockData {
  name: string;
  tradePrice: string;
  quantity: string;
  tradeAmount: string;
  currentPrice: string;
  profit: {
    valueMoney: number;
    profitMoney: number;
    profitRate: number;
  };
}

interface HoldItem {
  id: number; // 거래 ID
  itemId: number; // 종목 ID
  itemName: string; // 종목 이름
  itemCnt: number; // 수량
  buyMoney: number; // 매입 단가
  totalMoney: number; // 총 매입 금액
  nowMoney: number; // 현재 가격
  valMoney: number; // 평가 금액
  valProfit: number; // 평가 손익
  profitNum: number; // 수익률 (단위: %, 소수)
}

const columns: ColumnDef<StockData>[] = [
  {
    accessorKey: "name",
    header: "종목 이름",
    size: 376,
  },
  {
    accessorKey: "tradePrice",
    header: "거래 가격",
    size: 140,
    cell: ({ row }) => `${row.getValue("tradePrice")}원`,
  },
  {
    accessorKey: "quantity",
    header: "수량",
    size: 100,
  },
  {
    accessorKey: "tradeAmount",
    header: "거래 금액",
    size: 140,
    cell: ({ row }) => `${row.getValue("tradeAmount")}원`,
  },
  {
    accessorKey: "currentPrice",
    header: "현재 가격",
    size: 140,
    cell: ({ row }) => `${row.getValue("currentPrice")}원`,
  },
  {
    accessorKey: "profit",
    header: "수익",
    size: 200,
    cell: ({ row }) => {
      const { valueMoney, profitMoney, profitRate } = row.getValue("profit") as {
        valueMoney: number;
        profitMoney: number;
        profitRate: number;
      };

      const isProfit = profitMoney >= 0;
      const sign = isProfit ? "+" : "-";
      const absMoney = Math.abs(profitMoney).toLocaleString("ko-KR");
      const absRate = roundToFixed(Math.abs(profitRate), 2);

      return (
        <RateWrapper>
          {valueMoney.toLocaleString("ko-KR")}원
          <ProfitSpan isProfit={isProfit}>{`${sign}${absMoney}원 (${sign}${absRate}%)`}</ProfitSpan>
        </RateWrapper>
      );
    },
  },
];

export const HoldStockTable = ({ holdItems }: { holdItems: HoldItem[] }) => {
  const formatProfitRate = (rate: number) => {
    const sign = rate > 0 ? "+" : rate < 0 ? "-" : "";
    return `${sign}${roundToFixed(rate, 2)}%`;
  };

  const stockRows: StockData[] = (holdItems ?? []).map(item => {
    return {
      name: item.itemName,
      tradePrice: item.buyMoney.toLocaleString("ko-KR"),
      quantity: item.itemCnt.toString(),
      tradeAmount: item.totalMoney.toLocaleString("ko-KR"),
      currentPrice: item.nowMoney.toLocaleString("ko-KR"),
      profit: {
        valueMoney: item.valMoney,
        profitMoney: item.valProfit,
        profitRate: item.profitNum,
      },
    };
  });

  const rightAlignColumnIds = [
    "tradePrice",
    "quantity",
    "tradeAmount",
    "currentPrice",
    "profit",
  ];

  const table = useReactTable({
    data: stockRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Th
                key={header.id}
                style={{
                  width: header.column.getSize(),
                }}>
                {header.column.columnDef.header as string}
              </Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <Td
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                  }}
                  alignRight={rightAlignColumnIds.includes(cell.column.id)}>
                  {cell.column.id === "profit"
                    ? cell.column.columnDef.cell
                      ? (cell.column.columnDef.cell as any)({
                          row,
                        })
                      : cell.renderValue()
                    : cell.renderValue()}
                </Td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <Td
              colSpan={columns.length}
              style={{
                textAlign: "center",
              }}>
              보유중인 종목이 없습니다.
            </Td>
          </tr>
        )}
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
  text-align: center;
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

const Td = styled.td<{
  alignRight?: boolean;
}>`
  height: 64px;
  font: ${font.b2};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px;
  vertical-align: middle;
  white-space: pre-line;
  text-align: ${props => (props.alignRight ? "right" : "left")};


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

const ProfitSpan = styled.span<{
  isProfit: boolean;
}>`
  color: ${props => (props.isProfit ? color.red[500] : color.blue[500])};
  font: ${font.b2};
`;
