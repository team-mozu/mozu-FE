import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, CheckBox, Plus } from '@mozu/ui';
import { forwardRef, useEffect, useMemo, useState } from 'react';
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
  stockChecked?: boolean;
}

interface IPropType {
  isEdit: boolean;
  data: stockData[];
  selectedRound: number;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  formattedValue: string;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ formattedValue, onChange, ...props }, ref) => {
    const [rawValue, setRawValue] = useState(formattedValue.replace(/,/g, ''));
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (!isFocused) {
        setRawValue(formattedValue.replace(/,/g, ''));
      }
    }, [formattedValue, isFocused]);

    const handleFocus = () => {
      setIsFocused(true);
      setRawValue(formattedValue.replace(/,/g, ''));
    };

    const handleBlur = () => {
      setIsFocused(false);
      const numericValue = Number(rawValue.replace(/[^0-9]/g, '')) || 0;
      setRawValue(numericValue.toLocaleString('ko-KR'));
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={isFocused ? rawValue : formattedValue}
        onChange={(e) => {
          setRawValue(e.target.value);
          onChange?.(e);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  },
);

const formatPrice = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('ko-KR');
  }
  const numericValue = value.replace(/[^0-9]/g, '');
  return numericValue ? Number(numericValue).toLocaleString('ko-KR') : '';
};

export const StockTables = ({
  data: propData,
  isEdit,
  selectedRound,
}: IPropType) => {
  const [moneyData, setMoneyData] = useState<stockData[]>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const { classData, setClassData, updateStockItems } = useClassStore();
  const [isA, setIsA] = useState<boolean>(false);
  type NumericField = 'currentPrice' | `level${number}`;

  const setUpdate = () => setIsA(true);

  const toggleAll = () => {
    if (!classData) return;
  
    const allChecked = classData.classItems.every((item) => item.stockChecked);
    const newItems = classData.classItems.map((item) => ({
      ...item,
      stockChecked: !allChecked,
    }));
  
    updateStockItems(newItems);
  
    setMoneyData((prev) =>
      prev.map((item) => ({ ...item, stockChecked: !allChecked })),
    );
  };
  

  const toggleStockRow = (itemId: number) => {
    if (!classData) return;
  
    const newItems = classData.classItems.map((item) =>
      item.itemId === itemId
        ? { ...item, stockChecked: !item.stockChecked }
        : item,
    );
  
    updateStockItems(newItems);
    
    setMoneyData((prev) =>
      prev.map((item) =>
        item.itemId === itemId
          ? { ...item, stockChecked: !item.stockChecked }
          : item,
      ),
    );
  };

  const dynamicColumns = useMemo(() => {
    const columns = ['currentPrice'];
    for (let i = 1; i <= selectedRound; i++) {
      columns.push(`level${i}`);
    }
    return columns;
  }, [selectedRound]);

  // ✅ classData.classItems가 변경되면 자동 반영
  useEffect(() => {
    if (!classData?.classItems) return;

    const formattedData = classData.classItems.map((item) => {
      const baseMoney = item.money || [];
      const extendedMoney = [
        ...baseMoney,
        ...Array(Math.max(selectedRound + 1 - baseMoney.length, 0)).fill(0),
      ];

      return {
        ...item,
        money: extendedMoney.slice(0, selectedRound + 1),
        currentPrice: extendedMoney[0] || 0,
        level1: extendedMoney[1] || 0,
        level2: extendedMoney[2] || 0,
        level3: extendedMoney[3] || 0,
        level4: extendedMoney[4] || 0,
        level5: extendedMoney[5] || 0,
      };
    });

    setMoneyData(formattedData);
  }, [classData?.classItems, selectedRound]);

  useEffect(() => {
    isClose();
  }, [isA]);

  const handlePriceChange = (
    itemId: number,
    field: NumericField,
    value: string,
  ) => {
    const numericValue = Number(value.replace(/[^0-9]/g, '')) || 0;
    updateValue(itemId, field, numericValue);
  };

  const handleDeleteSelectedItems = () => {
    if (!classData) return;
  
    const filteredItems = classData.classItems.filter(
      (item) => !item.stockChecked,
    );
  
    updateStockItems(filteredItems);
  };

  const updateValue = (itemId: number, field: NumericField, value: number) => {
    const level =
      field === 'currentPrice' ? 0 : parseInt(field.replace('level', ''));

    setMoneyData((prev) =>
      prev.map((row) => {
        if (row.itemId === itemId) {
          const newMoney = [...(row.money || [])];
          newMoney[level] = value;
          return {
            ...row,
            [field]: value,
            money: newMoney,
          };
        }
        return row;
      }),
    );

    if (classData) {
      const updatedItems = classData.classItems.map((item) => {
        if (item.itemId === itemId) {
          const newMoney = [...(item.money || [])];
          newMoney[level] = value;
          return { ...item, money: newMoney };
        }
        return item;
      });
      updateStockItems(updatedItems);
    }
  };

  const columns: ColumnDef<stockData>[] = [
    ...(isEdit
      ? [
          {
            accessorKey: 'stockChecked',
            header: () => (
              <CheckBox
                onChange={toggleAll}
                checked={
                  moneyData.length > 0 &&
                  moneyData.every((row) => row.stockChecked)
                }
                id={`stock-header-checkbox`}
              />
            ),
            cell: ({ row }) => (
              <CheckBox
                checked={row.original.stockChecked}
                onChange={() => toggleStockRow(row.original.itemId)}
                id={`stock-row-${row.original.itemId}`}
              />
            ),
            size: 52,
          },
        ]
      : []),
    {
      accessorKey: 'itemId',
      header: () => <>순번</>,
      size: 80,
      meta: { align: 'center' },
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'itemName',
      header: () => <>종목 이름</>,
      size: 500,
      meta: { align: 'left' },
    },
    ...dynamicColumns.map((key) => ({
      accessorKey: key,
      header: () => (
        <>
          {key === 'currentPrice' ? '현재가' : `${key.replace('level', '')}차`}
        </>
      ),
      size: 140,
      meta: { align: 'right' },
      cell: ({ row }) => {
        const value = row.original[key as NumericField] || 0;
        return isEdit && key !== 'currentPrice' ? (
          <Input
            type="text"
            value={formatPrice(value)}
            onChange={(e) =>
              handlePriceChange(
                row.original.itemId,
                key as NumericField,
                e.target.value,
              )
            }
          />
        ) : (
          formatPrice(value)
        );
      },
    })),
  ];

  const table = useReactTable({
    data: moneyData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isOpen = () => setIsModal(true);

  const isClose = () => {
    setIsModal(false);
    if (!classData) return;
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
      {isModal && <AddInvestItemModal close={isClose} setUpdate={setUpdate} />}
      <Caption>
        <CaptionBox>
          <Text>투자 종목</Text>
          <Button
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            hoverBackgroundColor={color.zinc[100]}
            onClick={handleDeleteSelectedItems}
          >
            선택항목 삭제하기
          </Button>
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
                {flexRender(header.column.columnDef.header, header.getContext())}
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
            <PlusTd colSpan={columns.length} onClick={isOpen}>
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
  table-layout: auto;
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
  min-width: 80px;
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
  text-align: right;
`;