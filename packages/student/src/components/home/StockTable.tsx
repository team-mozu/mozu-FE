import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useState, useEffect } from 'react';
import { db } from '@/db';
import { useGetHoldItems } from '@/apis';
import { ItemType } from '@/apis/team/type';
import { liveQuery } from 'dexie';

interface StockData {
  name: string;
  tradePrice: string;
  quantity: string;
  tradeAmount: string;
  currentPrice: string;
  profit: string;
}

const data: StockData[] = [];

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
      const [currentPrice, profit] = profitText.split('\n');
      const isProfit = profit.includes('+');

      return (
        <RateWrapper>
          <span>{currentPrice}</span>
          <ProfitSpan isProfit={isProfit}>{profit}</ProfitSpan>{' '}
        </RateWrapper>
      );
    },
  },
];

export const StockTable = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: response } = useGetHoldItems();

  const fetchDataToIndexedDB = () => {
    try {
      if (!response) return;
      db.items.bulkPut(
        response.map((item) => ({
          id: item.id,
          itemId: item.itemId,
          itemName: item.itemName,
          buyMoney: item.buyMoney,
          itemCnt: item.itemCnt,
          totalMoney: item.totalMoney,
          nowMoney: item.nowMoney,
          valMoney: item.valMoney,
          valProfit: item.valProfit,
          profitNum: item.profitNum,
        })),
      );

      return response;
    } catch (error) {
      throw new Error('데이터 갱신 실패');
    }
  };

  const transformToTableData = (items: ItemType[]): StockData[] => {
    return items.map((item) => ({
      name: item.itemName,
      tradePrice: formatCurrency(item.buyMoney),
      quantity: item.itemCnt.toString(),
      tradeAmount: formatCurrency(item.totalMoney),
      currentPrice: formatCurrency(item.nowMoney),
      profit: `${formatCurrency(item.valProfit)}\n${formatPercentage(item.profitNum)}`,
    }));
  };

  useEffect(() => {
    const subscription = liveQuery(() => db.items.toArray()).subscribe({
      next: (items) => setStockData(transformToTableData(items)),
      error: (error) => console.error('IndexedDB error:', error),
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedItems = await db.items.toArray();
        if (cachedItems.length > 0) {
          setStockData(transformToTableData(cachedItems));
        }

        const freshItems = await fetchDataToIndexedDB();
        setStockData(transformToTableData(freshItems));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [response]);

  const table = useReactTable({
    data: stockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    })
      .format(value)
      .replace('₩', '');
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

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
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
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
          ))
        ) : (
          <tr>
            <Td colSpan={columns.length} style={{ textAlign: 'center' }}>
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

const ProfitSpan = styled.span<{ isProfit: boolean }>`
  color: ${(props) => (props.isProfit ? color.red[500] : color.blue[500])};
  font: ${font.b2};
`;
