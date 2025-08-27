import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, CheckBox } from "@mozu/ui";
import { type ColumnDef, flexRender, getCoreRowModel, type Row, useReactTable } from "@tanstack/react-table";
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AddInvestItemModal } from "@/components/stock/AddInvestItemModal";
import { formatPrice } from "@/utils/formatPrice";
import { Skeleton } from "../../../../design-token/src/theme/Skeleton";


// 투자 종목 데이터 인터페이스
interface StockData {
  itemId: number;
  itemCode: string;
  itemName: string;
  money: (number | null)[]; // [현재가, 현재가, 1차, 2차, 3차] - 0번 인덱스는 렌더링 안함
  stockChecked?: boolean;
}

interface InvestmentItemsTableProps {
  degree: string; // 차수 (3, 4, 5)
  isEdit?: boolean;
  data?: StockData[];
  onPriceChange?: (itemId: number, levelIndex: number, value: number | null) => void;
  onDeleteItems?: (itemIds: number[]) => void;
  onAddItems?: (items: any[]) => void;
  isApiLoading?: boolean;
}

// 포커스를 유지하는 커스텀 Input 컴포넌트
interface PriceInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: number | string;
}

const PriceInput = memo(
  forwardRef<HTMLInputElement, PriceInputProps>(({ value, onChange, placeholder }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value == null ? "" : value.toString().replace(/,/g, ""));

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      setLocalValue(value == null ? "" : value.toString().replace(/,/g, ""));
    }, [
      value,
    ]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      if (localValue === "") {
        onChange(null);
      } else {
        const numericValue = Number(localValue.replace(/[^0-9]/g, "")) || 0;
        onChange(numericValue);
      }
    }, [
      localValue,
      onChange,
    ]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value.replace(/[^\d]/g, ""));
    }, []);

    return (
      <PriceInputStyle
        ref={ref}
        type="text"
        value={isFocused ? localValue : value == null ? "" : formatPrice(value)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={(placeholder ?? "").toString()}
      />
    );
  }),
);

export const StockTables = memo(
  ({
    degree,
    isEdit = true,
    data = [],
    onPriceChange,
    onDeleteItems,
    onAddItems,
    isApiLoading,
  }: InvestmentItemsTableProps) => {
    const selectedRound = parseInt(degree, 10);
    const [stockData, setStockData] = useState<StockData[]>(data);

    useEffect(() => {
      setStockData(data);
    }, [
      data,
    ]);

    const inputRefs = useRef<{
      [key: string]: HTMLInputElement | null;
    }>({});

    const toggleAll = useCallback(() => {
      const allChecked = stockData.every(item => item.stockChecked);
      setStockData(
        stockData.map(item => ({
          ...item,
          stockChecked: !allChecked,
        })),
      );
    }, [
      stockData,
    ]);

    const toggleStockRow = useCallback(
      (itemId: number) => {
        setStockData(
          stockData.map(item =>
            item.itemId === itemId
              ? {
                  ...item,
                  stockChecked: !item.stockChecked,
                }
              : item,
          ),
        );
      },
      [
        stockData,
      ],
    );

    const handleDeleteSelectedItems = useCallback(() => {
      const selectedIds = stockData.filter(item => item.stockChecked).map(item => item.itemId);
      if (selectedIds.length === 0) return;

      onDeleteItems?.(selectedIds);
      setStockData(stockData.filter(item => !item.stockChecked));
    }, [
      stockData,
      onDeleteItems,
    ]);

    const handlePriceChange = useCallback(
      (itemId: number, levelIndex: number, value: number | null) => {
        setStockData(prev =>
          prev.map(item => {
            if (item.itemId === itemId) {
              const newMoney = [
                ...item.money,
              ];
              newMoney[levelIndex] = value;
              return {
                ...item,
                money: newMoney,
              };
            }
            return item;
          }),
        );
        onPriceChange?.(itemId, levelIndex, value);
      },
      [
        onPriceChange,
      ],
    );

    const handleCellClick = useCallback((inputId: string, event: React.MouseEvent) => {
      if ((event.target as HTMLElement).closest("input[type='checkbox']")) return;
      const inputElement = inputRefs.current[inputId];
      inputElement?.focus();
    }, []);

    const dynamicColumns = useMemo(() => {
      const columns = [
        "현재가",
      ];
      for (let i = 1; i <= selectedRound; i++) columns.push(`${i}차`);
      return columns;
    }, [
      selectedRound,
    ]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(
      () => setIsLoading(isApiLoading || false),
      [
        isApiLoading,
      ],
    );

    const columns: ColumnDef<StockData>[] = useMemo(() => {
      const baseColumns: ColumnDef<StockData>[] = [
        ...(isEdit
          ? [
              {
                accessorKey: "stockChecked",
                header: () => (
                  <CheckBox
                    onChange={toggleAll}
                    checked={stockData.length > 0 && stockData.every(row => row.stockChecked)}
                    id="stock-header-checkbox"
                  />
                ),
                cell: ({ row }: { row: Row<StockData> }) => (
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
          accessorKey: "itemCode",
          header: () => <>종목 코드</>,
          size: 120,
          meta: {
            align: "left",
          },
          cell: ({ row }) => {
            const value = row.original.itemCode;
            return isLoading ? (
              <EmptyValueTextDiv>{value}</EmptyValueTextDiv>
            ) : (
              value || <EmptyValueText>-</EmptyValueText>
            );
          },
        },
        {
          accessorKey: "itemName",
          header: () => <>종목 이름</>,
          size: 300,
          meta: {
            align: "left",
          },
          cell: ({ row }) => {
            const value = row.original.itemName;
            return isLoading ? (
              <EmptyValueTextDiv>{value}</EmptyValueTextDiv>
            ) : (
              value || <EmptyValueText>-</EmptyValueText>
            );
          },
        },
      ];

      const priceColumns = dynamicColumns.map((header, displayIndex) => {
        const actualIndex = displayIndex + 1;
        return {
          id: `level${actualIndex}`,
          header: () => <>{header}</>,
          size: 140,
          meta: {
            align: "right",
          },
          cell: ({ row }: { row: Row<StockData> }) => {
            const money = row.original.money || [];
            const value = money[actualIndex] ?? 0;
            const inputId = `${row.original.itemId}-${actualIndex}`;
            const placeholder = `${header} 금액`;
            return isEdit ? (
              <PriceInput
                ref={el => (inputRefs.current[inputId] = el)}
                value={value}
                onChange={newValue => handlePriceChange(row.original.itemId, actualIndex, newValue)}
                placeholder={placeholder}
              />
            ) : isLoading ? (
              <EmptyValueTextDiv>{value === null ? placeholder : formatPrice(value)}</EmptyValueTextDiv>
            ) : value === null ? (
              <EmptyValueText>{placeholder}</EmptyValueText>
            ) : typeof value === "number" ? (
              formatPrice(value)
            ) : (
              value
            );
          },
        };
      });

      return [
        ...baseColumns,
        ...priceColumns,
      ];
    }, [
      dynamicColumns,
      isEdit,
      isLoading,
      stockData,
      toggleAll,
      toggleStockRow,
      handlePriceChange,
    ]);

    const table = useReactTable({
      data: stockData,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const handleOpenAddModal = useCallback(() => setShowAddModal(true), []);
    const handleCloseAddModal = useCallback(() => setShowAddModal(false), []);
    const handleAddItems = useCallback(
      (newItems: any[]) => {
        onAddItems?.(newItems);
        setShowAddModal(false);
      },
      [
        onAddItems,
      ],
    );

    return (
      <TableContainer>
        <DeleteButtonContainer>
          <TableTitle>투자 종목</TableTitle>
          {isEdit && (
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[100]}
              onClick={handleDeleteSelectedItems}
              disabled={!stockData.some(item => item.stockChecked)}>
              선택항목 삭제하기
            </Button>
          )}
        </DeleteButtonContainer>
        <Table>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th
                    key={header.id}
                    width={`${header.column.getSize()}px`}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    const isInputCell = cell.column.id.startsWith("level");
                    const levelIndex = isInputCell ? parseInt(cell.column.id.replace("level", ""), 10) : -1;
                    const inputId = isInputCell ? `${row.original.itemId}-${levelIndex}` : "";
                    return (
                      <Td
                        key={`${row.original.itemId}-${cell.id}`}
                        align={(cell.column.columnDef.meta as any)?.align}
                        onClick={e => (isInputCell && isEdit ? handleCellClick(inputId, e) : undefined)}
                        clickable={isInputCell && isEdit}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <Td
                  colSpan={columns.length}
                  align="center">
                  <EmptyStateContainer>
                    <EmptyStateText>투자 종목을 추가해 주세요.</EmptyStateText>
                  </EmptyStateContainer>
                </Td>
              </tr>
            )}
            {isEdit && (
              <tr>
                <PlusTd
                  colSpan={columns.length}
                  onClick={handleOpenAddModal}>
                  <PlusField>
                    <PlusIcon>+</PlusIcon>
                    추가하기
                  </PlusField>
                </PlusTd>
              </tr>
            )}
          </Tbody>
        </Table>

        {showAddModal && (
          <AddInvestItemModal
            close={handleCloseAddModal}
            onItemsSelected={handleAddItems}
            selectedDegree={parseInt(degree, 10)}
            existingItems={stockData.map(item => ({
              id: item.itemId,
            }))}
          />
        )}
      </TableContainer>
    );
  },
);

// Styled components

const TableTitle = styled.div`
  font: ${font.t2};
  margin-bottom: 16px;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

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

const Tbody = styled.tbody`
  background-color: ${color.white};
`;

const Th = styled.th<{
  width: string;
}>`
  font: ${font.t2};
  height: 48px;
  background: ${color.orange[50]};
  border-bottom: 1px solid ${color.zinc[200]};
  vertical-align: middle;
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  min-width: 80px;
  width: ${props => props.width};
  text-align: center;

  &:first-of-type {
    border-top-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td<{
  align?: string;
  clickable?: boolean;
}>`
  height: 48px;
  font: ${font.t4};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  text-align: ${props => props.align || "left"};
  cursor: ${props => (props.clickable ? "pointer" : "default")};

  tbody tr:last-of-type & {
    &:first-of-type {
      border-bottom-left-radius: 8px;
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
`;

const PriceInputStyle = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font: ${font.b2};
  width: 110px;
  text-align: right;

  &::placeholder {
    color: ${color.zinc[400]};
  }
`;

const PriceInputStyleDiv = styled(Skeleton)`
  background-color: transparent;
  border: none;
  outline: none;
  font: ${font.b2};
  width: 110px;
  text-align: right;
  color: transparent;

  &::placeholder {
    color: transparent;
  }
`;

const EmptyValueText = styled.span`
  color: ${color.zinc[400]};
  font-style: italic;
`;

const EmptyValueTextDiv = styled(Skeleton)`
  color: transparent;
  font-style: italic;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyStateText = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
`;

const PlusField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font: ${font.b1};
`;

const PlusIcon = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const PlusTd = styled(Td)`
  text-align: center;
  cursor: pointer;
  background-color: ${color.zinc[50]};
  &:hover {
    background-color: ${color.zinc[100]};
  }
`;
