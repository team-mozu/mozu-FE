import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, CheckBox } from "@mozu/ui";
import { useState, useMemo, forwardRef, useRef, useEffect } from "react";
import { formatPrice } from "@/utils/formatPrice";
import { AddInvestItemModal } from "@/components/stock/AddInvestItemModal";
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
  onPriceChange?: (
    itemId: number,
    levelIndex: number,
    value: number | null
  ) => void;
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

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ value, onChange, placeholder }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(
      // FIX: Handle undefined/null values properly
      value == null ? "" : value.toString().replace(/,/g, "")
    );

    const handleFocus = () => {
      setIsFocused(true);
      // FIX: Handle undefined/null values properly
      setLocalValue(value == null ? "" : value.toString().replace(/,/g, ""));
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (localValue === "") {
        onChange(null);
      } else {
        const numericValue = Number(localValue.replace(/[^0-9]/g, "")) || 0;
        onChange(numericValue);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/[^\d]/g, "");
      setLocalValue(inputValue);
    };

    return (
      <PriceInputStyle
        ref={ref}
        type="text"
        value={
          // FIX: Handle undefined/null values properly
          isFocused ? localValue : value == null ? "" : formatPrice(value)
        }
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder.toString()}
      />
    );
  }
);

export const StockTables = ({
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

  console.log(stockData);

  // Update local state when external data changes
  useEffect(() => {
    setStockData(data);
  }, [data]);

  // 포커스 관리를 위한 참조값들
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // "전체 선택" 토글 기능
  const toggleAll = () => {
    const allChecked = stockData.every((item) => item.stockChecked);
    setStockData(
      stockData.map((item) => ({
        ...item,
        stockChecked: !allChecked,
      }))
    );
  };

  // 개별 행 토글 기능
  const toggleStockRow = (itemId: number) => {
    setStockData(
      stockData.map((item) =>
        item.itemId === itemId
          ? { ...item, stockChecked: !item.stockChecked }
          : item
      )
    );
  };

  // 선택된 항목 삭제
  const handleDeleteSelectedItems = () => {
    const selectedIds = stockData
      .filter((item) => item.stockChecked)
      .map((item) => item.itemId);

    if (selectedIds.length === 0) return;

    // Call the parent component's delete handler if provided
    if (onDeleteItems) {
      onDeleteItems(selectedIds);
    }

    // Update local state
    setStockData(stockData.filter((item) => !item.stockChecked));
  };

  // 가격 변경 핸들러
  const handlePriceChange = (
    itemId: number,
    levelIndex: number,
    value: number | null
  ) => {
    // Update local state
    setStockData(
      stockData.map((item) => {
        if (item.itemId === itemId) {
          const newMoney = [...item.money];
          newMoney[levelIndex] = value;
          return { ...item, money: newMoney };
        }
        return item;
      })
    );

    // Call the parent component's price change handler if provided
    if (onPriceChange) {
      onPriceChange(itemId, levelIndex, value);
    }
  };

  // 셀 클릭 시 해당 셀 내의 입력 필드로 포커스 이동
  const handleCellClick = (inputId: string, event: React.MouseEvent) => {
    // 이벤트가 체크박스에서 발생한 경우 포커스 이동을 막음
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }

    const inputElement = inputRefs.current[inputId];
    if (inputElement) {
      inputElement.focus();
    }
  };

  // 차수에 따라 동적 컬럼 생성 (현재가, 1차, 2차, 3차...)
  // 0번 인덱스(현재가)는 렌더링하지 않음
  const dynamicColumns = useMemo(() => {
    const columns = ["현재가"]; // 1번 인덱스의 현재가만 표시
    for (let i = 1; i <= selectedRound; i++) {
      columns.push(`${i}차`);
    }
    return columns;
  }, [selectedRound]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(isApiLoading || false);
  }, [isApiLoading]);

  // 테이블 컬럼 정의
  const columns: ColumnDef<StockData>[] = [
    ...(isEdit
      ? [
        {
          accessorKey: 'stockChecked',
          header: () => (
            <CheckBox
              onChange={toggleAll}
              checked={
                stockData.length > 0 &&
                stockData.every((row) => row.stockChecked)
              }
              id="stock-header-checkbox"
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
      accessorKey: "itemCode",
      header: () => <>종목 코드</>,
      size: 120,
      meta: { align: "left" },
      cell: ({ row }) => {
        const value = row.original.itemCode;
        if (isLoading) {
          return <EmptyValueTextDiv>{value}</EmptyValueTextDiv>;
        } else {
          // 종목 코드는 문자열이므로 formatPrice를 사용하지 않음
          return value || <EmptyValueText>-</EmptyValueText>;
        }
      },
    },
    {
      accessorKey: "itemName",
      header: () => <>종목 이름</>,
      size: 300,
      meta: { align: "left" },
      cell: ({ row }) => {
        const value = row.original.itemName;
        if (isLoading) {
          return <EmptyValueTextDiv>{value}</EmptyValueTextDiv>;
        } else {
          // 종목 이름은 문자열이므로 formatPrice를 사용하지 않음
          return value || <EmptyValueText>-</EmptyValueText>;
        }
      },
    },
    // 현재가, 차수별 가격 컬럼 동적 생성
    // 0번 인덱스는 건너뛰고 1번 인덱스부터 시작
    ...dynamicColumns.map((header, displayIndex) => {
      // 실제 데이터 배열에서의 인덱스 (1번부터 시작)
      const actualIndex = displayIndex + 1;

      return {
        id: `level${actualIndex}`,
        header: () => <>{header}</>,
        size: 140,
        meta: { align: "right" },
        cell: ({ row }) => {
          // money 배열에서 실제 인덱스로 접근
          const money = row.original.money || [];
          const value = money[actualIndex] ?? 0;
          const inputId = `${row.original.itemId}-${actualIndex}`;

          // placeholder를 헤더명으로 설정
          const placeholder = `${header} 금액`;

          if (isEdit) {
            return (
              <PriceInput
                ref={(el) => (inputRefs.current[inputId] = el)}
                value={value}
                onChange={(newValue) =>
                  handlePriceChange(row.original.itemId, actualIndex, newValue)
                }
                placeholder={placeholder}
              />
            );
          } else {
            if (isLoading) {
              return (
                <EmptyValueTextDiv>
                  {value === null ? placeholder : formatPrice(value)}
                </EmptyValueTextDiv>
              );
            } else {
              return value === null ? (
                <EmptyValueText>{placeholder}</EmptyValueText>
              ) : (
                // value가 숫자인지 확인 후 formatPrice 사용
                typeof value === 'number' ? formatPrice(value) : value
              );
            }
          }
        },
      };
    }),
  ];

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data: stockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 모달 관련 상태
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  // 투자 종목 추가 핸들러
  const handleAddItems = (newItems: any[]) => {
    // 새 아이템을 추가하고 부모 컴포넌트에 알림
    if (onAddItems) {
      onAddItems(newItems);
    }

    // 모달 닫기
    setShowAddModal(false);
  };

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
            disabled={!stockData.some((item) => item.stockChecked)}
          >
            선택항목 삭제하기
          </Button>
        )}
      </DeleteButtonContainer>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  width={`${header.column.getSize()}px`}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              ))}
            </tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  // 가격 입력 필드를 위한 inputId 생성
                  const isInputCell = cell.column.id.startsWith("level");
                  const levelIndex = isInputCell
                    ? parseInt(cell.column.id.replace("level", ""), 10)
                    : -1;
                  const inputId = isInputCell
                    ? `${row.original.itemId}-${levelIndex}`
                    : "";

                  return (
                    <Td
                      key={`${row.original.itemId}-${cell.id}`}
                      align={(cell.column.columnDef.meta as any)?.align}
                      onClick={(e) =>
                        isInputCell && isEdit
                          ? handleCellClick(inputId, e)
                          : undefined
                      }
                      clickable={isInputCell && isEdit}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan={columns.length} align="center">
                <EmptyStateContainer>
                  <EmptyStateText>투자 종목을 추가해 주세요.</EmptyStateText>
                </EmptyStateContainer>
              </Td>
            </tr>
          )}
          {isEdit && (
            <tr>
              <PlusTd colSpan={columns.length} onClick={handleOpenAddModal}>
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
          existingItems={stockData.map((item) => ({ id: item.itemId }))}
        />
      )}
    </TableContainer>
  );
};

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

const Th = styled.th<{ width: string; }>`
  font: ${font.t2};
  height: 48px;
  background: ${color.orange[50]};
  border-bottom: 1px solid ${color.zinc[200]};
  vertical-align: middle;
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  min-width: 80px;
  width: ${(props) => props.width};
  text-align: center;

  &:first-of-type {
    border-top-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td<{ align?: string; clickable?: boolean }>`
  height: 48px;
  font: ${font.t4};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  text-align: ${(props) => props.align || "left"};
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};

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