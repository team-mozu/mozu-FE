import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { CheckBox, Plus } from '@mozu/ui';
import { useEffect, useState } from 'react';
import { AddInvestItemModal } from '@/components';
import { useClassStore } from '@/store';

interface stockData {
  itemId: number;
  itemName?: string;
  money?: number[];
  currentPrice?: number;
  level1?: number;
  level2?: number;
  level3?: number;
  level4?: number;
  level5?: number;
  checked?: boolean;
}

interface IPropType {
  isEdit: boolean;
  data: stockData[];
}

const formatPrice = (value: string | number): string => {
  const numericValue = String(value).replace(/[^0-9]/g, '');
  return numericValue ? Number(numericValue).toLocaleString('ko-KR') : '';
};

export const StockTables = ({ data = [], isEdit }: IPropType) => {
  const [moneyData, setMoneyData] = useState<stockData[]>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const { classData, setClassData, updateStockItems } = useClassStore();

  const toggleAll = () => {
    if (!classData) return;
    const allChecked = classData.classItems.every((row) => row.stockChecked);
    const updatedData = classData.classItems.map((row) => ({
      ...row,
      stockChecked: !allChecked,
    }));
    updateStockItems(updatedData);
  };

  const toggleStockRow = (index: number) => {
    if (!classData) return;
    const newItems = [...classData.classItems];
    newItems[index].stockChecked = !newItems[index].stockChecked;
    updateStockItems(newItems);
  };

  useEffect(() => {
    if (data) {
      const formattedData = data.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        money: item.money ?? [],
        currentPrice: item.money?.[0] ?? 0,
        level1: item.money?.[1] ?? 0,
        level2: item.money?.[2] ?? 0,
        level3: item.money?.[3] ?? 0,
        level4: item.money?.[4] ?? 0,
        level5: item.money?.[5] ?? 0,
        stockChecked: item.checked ?? false,
      }));
      setMoneyData(formattedData);
    } else {
      setMoneyData([]);
    }
  }, [data]);

  const handlePriceChange = (
    itemId: number,
    field: keyof stockData,
    value: string,
  ) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setMoneyData((prevData) =>
      prevData.map((row) =>
        row.itemId === itemId
          ? { ...row, [field]: Number(numericValue) || 0 }
          : row,
      ),
    );
  };

  const columns: ColumnDef<stockData>[] = [
    ...(isEdit
      ? [
          {
            accessorKey: 'stockChecked',
            header: () => (
              <CheckBox
                onChange={toggleAll}
                checked={classData?.classItems.every((row) => row.stockChecked)}
                id={`stock-header-checkbox`}
              />
            ),
            cell: ({ row }) => (
              <CheckBox
                checked={row.original.stockChecked}
                onChange={() => toggleStockRow(row.index)}
                id={`stock-row-${row.original.itemId}`}
              />
            ),
            size: 52,
          },
        ]
      : []),
    {
      accessorKey: 'itemId',
      header: () => <>종목 코드</>,
      size: 120,
      meta: { align: 'center' }, // 정렬 정보 추가
    },
    {
      accessorKey: 'itemName',
      header: () => <>종목 이름</>,
      size: 500,
      meta: { align: 'left' }, // 정렬 정보 추가
    },
    ...['currentPrice', 'level1', 'level2', 'level3', 'level4', 'level5'].map(
      (key) => ({
        accessorKey: key,
        header: () => (
          <>
            {key.replace('level', '') === 'currentPrice'
              ? '현재가'
              : key.replace('level', '') + '차'}
          </>
        ),
        size: 140,
        meta: { align: 'right' }, // 정렬 정보 추가
        cell: ({ row }) => {
          const value = row.original[key as keyof stockData] || 0;
          return isEdit ? (
            <Input
              type="text"
              value={formatPrice(value)}
              onChange={(e) =>
                handlePriceChange(
                  row.original.itemId,
                  key as keyof stockData,
                  e.target.value,
                )
              }
            />
          ) : (
            formatPrice(value)
          );
        },
      }),
    ),
  ];

  const table = useReactTable({
    data: moneyData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isOpen = () => setIsModal(true);

  const isClose = () => {
    setIsModal(false);
    setClassData({
      ...classData,
      classItems: classData.classItems.map((item) => ({
        ...item,
        checked: false,
      })),
      classArticles: classData.classArticles.map((article) => ({
        ...article,
        checked: false,
        articles: article.articles.map((a) => ({ ...a, checked: false })),
      })),
    });
  };

  return (
    <Table>
      {isModal && <AddInvestItemModal close={isClose} />}
      <Caption>
        <CaptionBox>
          <Text>투자 종목</Text>
        </CaptionBox>
      </Caption>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th
                key={header.id}
                width={`${header.column.getSize()}px`}
                style={{
                  textAlign:
                    (header.column.columnDef.meta as any)?.align || 'left',
                }}
              >
                {header.isPlaceholder
                  ? null
                  : typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header()
                    : header.column.columnDef.header}
              </Th>
            ))}
          </tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td
                  key={`${row.original.itemId}-${cell.id}`}
                  style={{
                    textAlign:
                      (cell.column.columnDef.meta as any)?.align || 'left',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <Td colSpan={columns.length} style={{ textAlign: 'center' }}>
              데이터가 없습니다.
            </Td>
          </tr>
        )}
        {isEdit && (
          <tr>
            <PlusTd colSpan={columns.length} width="1510" onClick={isOpen}>
              <PlusField>
                <Plus size={20} color="black" />
                추가하기
              </PlusField>
            </PlusTd>
          </tr>
        )}
      </Tbody>
    </Table>
  );
};

// Styled components
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background: ${color.orange[50]};
`;

const Tbody = styled.tbody``;

const Th = styled.th<{ width: string }>`
  font: ${font.t2};
  height: 48px;
  background: ${color.orange[50]};
  border-bottom: 1px solid ${color.zinc[200]};
  vertical-align: middle;
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  width: ${(props) => props.width};
  &:first-of-type {
    border-top-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  height: 48px;
  font: ${font.t4};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  tbody tr:last-of-type & {
    &:first-of-type {
      border-bottom-left-radius: 8px;
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
`;

const Caption = styled.caption`
  font: ${font.b1};
  color: ${color.zinc[800]};
  margin-bottom: 18px;
`;

const CaptionBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Text = styled.div`
  padding-top: 20px;
  font: ${font.t2};
`;

const PlusField = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font: ${font.b1};
`;

const PlusTd = styled(Td)`
  text-align: center;
  cursor: pointer;
  background-color: ${color.zinc[50]};
  &:hover {
    background-color: ${color.zinc[100]};
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  font: ${font.b2};
  width: 110px;
  text-align: right; /* 입력 필드도 오른쪽 정렬 */
`;
