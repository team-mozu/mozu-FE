import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetHoldItems } from "@/apis";
import { roundToFixed } from "@/utils";

interface StockData {
  id: string | number;
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

export const StockTable = () => {
  const { data, isLoading, error } = useGetHoldItems();
  const navigate = useNavigate();

  // 종목 이름 클릭 핸들러
  const handleStockClick = (stockId: string | number) => {
    navigate(`stock/${stockId}`);
  };

  // 컬럼 정의를 useMemo로 메모이제이션
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  const columns: ColumnDef<StockData>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "종목 이름",
        size: 376,
        cell: ({ row }) => {
          const stockName = row.getValue("name") as string;
          const stockId = row.original.id;
          return (
            <StockNameButton
              onClick={() => handleStockClick(stockId)}
              type="button">
              {stockName}
            </StockNameButton>
          );
        },
      },
      {
        accessorKey: "tradePrice",
        header: "거래 가격",
        size: 140,
        cell: ({ row }) => {
          const value = row.getValue("tradePrice");
          return value ? `${value}원` : "-";
        },
      },
      {
        accessorKey: "quantity",
        header: "수량",
        size: 100,
        cell: ({ row }) => {
          const value = row.getValue("quantity");
          return value || "-";
        },
      },
      {
        accessorKey: "tradeAmount",
        header: "거래 금액",
        size: 140,
        cell: ({ row }) => {
          const value = row.getValue("tradeAmount");
          return value ? `${value}원` : "-";
        },
      },
      {
        accessorKey: "currentPrice",
        header: "현재 가격",
        size: 140,
        cell: ({ row }) => {
          const value = row.getValue("currentPrice");
          return value ? `${value}원` : "-";
        },
      },
      {
        accessorKey: "profit",
        header: "수익",
        size: 200,
        cell: ({ row }) => {
          const profitData = row.getValue("profit") as {
            valueMoney: number;
            profitMoney: number;
            profitRate: number;
          } | null;

          if (!profitData) {
            return <RateWrapper>-</RateWrapper>;
          }

          const { valueMoney, profitMoney, profitRate } = profitData;

          // 안전한 숫자 변환
          const safeValueMoney = typeof valueMoney === "number" ? valueMoney : 0;
          const safeProfitMoney = typeof profitMoney === "number" ? profitMoney : 0;
          const safeProfitRate = typeof profitRate === "number" ? profitRate : 0;

          const isProfit = safeProfitMoney >= 0;
          const sign = isProfit ? "+" : "-";
          const absMoney = Math.abs(safeProfitMoney).toLocaleString("ko-KR");
          const absRate = roundToFixed(Math.abs(safeProfitRate), 2);

          return (
            <RateWrapper>
              {safeValueMoney.toLocaleString("ko-KR")}원
              <ProfitSpan isProfit={isProfit}>{`${sign}${absMoney}원 (${sign}${absRate}%)`}</ProfitSpan>
            </RateWrapper>
          );
        },
      },
    ],
    [],
  );

  // 데이터 변환을 useMemo로 메모이제이션
  const stockRows: StockData[] = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map(item => {
      // 안전한 데이터 접근
      const safeItem = {
        itemId: item?.itemId || item?.id || "",
        itemName: item?.itemName || "",
        buyMoney: typeof item?.buyMoney === "number" ? item.buyMoney : 0,
        itemCnt: typeof item?.itemCnt === "number" ? item.itemCnt : 0,
        totalMoney: typeof item?.totalMoney === "number" ? item.totalMoney : 0,
        nowMoney: typeof item?.nowMoney === "number" ? item.nowMoney : 0,
        valMoney: typeof item?.valMoney === "number" ? item.valMoney : 0,
        valProfit: typeof item?.valProfit === "number" ? item.valProfit : 0,
        profitNum: typeof item?.profitNum === "number" ? item.profitNum : 0,
      };

      return {
        id: safeItem.itemId || item?.id || "", // ID 필드 추가
        name: safeItem.itemName,
        tradePrice: safeItem.buyMoney.toLocaleString("ko-KR"),
        quantity: safeItem.itemCnt.toString(),
        tradeAmount: safeItem.totalMoney.toLocaleString("ko-KR"),
        currentPrice: safeItem.nowMoney.toLocaleString("ko-KR"),
        profit: {
          valueMoney: safeItem.valMoney,
          profitMoney: safeItem.valProfit,
          profitRate: safeItem.profitNum,
        },
      };
    });
  }, [
    data,
  ]);

  const table = useReactTable({
    data: stockRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Table>
        <tbody>
          <tr>
            <Td
              colSpan={columns.length}
              style={{
                textAlign: "center",
              }}>
              데이터를 불러오는 중...
            </Td>
          </tr>
        </tbody>
      </Table>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <Table>
        <tbody>
          <tr>
            <Td
              colSpan={columns.length}
              style={{
                textAlign: "center",
              }}>
              데이터를 불러오는데 실패했습니다.
            </Td>
          </tr>
        </tbody>
      </Table>
    );
  }

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
                  }}>
                  {cell.column.columnDef.cell
                    ? (cell.column.columnDef.cell as any)({
                      row: cell.row,
                      getValue: () => cell.getValue(),
                      renderValue: () => cell.getValue(),
                      cell: cell,
                    })
                    : String(cell.getValue() || "")}
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

const ProfitSpan = styled.span<{
  isProfit: boolean;
}>`
  color: ${props => (props.isProfit ? color.red[500] : color.blue[500])};
  font: ${font.b2};
`;

// 종목 이름 클릭 가능한 버튼 스타일
const StockNameButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font: ${font.b2};
  cursor: pointer;
  text-align: left;
  width: 100%;
  text-decoration: underline;
  
  &:hover {
    text-decoration: none;
  }
  
  &:focus {
    outline: 2px solid ${color.black};
    outline-offset: 2px;
  }
`;
