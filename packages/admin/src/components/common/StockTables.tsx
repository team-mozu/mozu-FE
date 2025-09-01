import styled from "@emotion/styled";
import { color, font, Skeleton } from "@mozu/design-token";
import { Button, CheckBox } from "@mozu/ui";
import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AddInvestItemModal } from "@/components/stock/AddInvestItemModal";
import { formatPrice } from "@/utils/formatPrice";

// Types
interface StockData {
  itemId: number;
  itemCode: string;
  itemName: string;
  money: (number | null)[]; // [현재가, 현재가, 1차, 2차, 3차] - 0번 인덱스는 렌더링 안함
  stockChecked?: boolean;
}

interface StockTablesProps {
  degree: string; // 차수 (3, 4, 5)
  isEdit?: boolean;
  data?: StockData[];
  onPriceChange?: (itemId: number, levelIndex: number, value: number | null) => void;
  onDeleteItems?: (itemIds: number[]) => void;
  onAddItems?: (items: StockData[]) => void;
  isApiLoading?: boolean;
}

interface DisplayStockData extends StockData {
  checked: boolean;
}

// Constants
const SKELETON_DELAY = 500;
const MAX_PRICE_VALUE = 99999999999; // 999억 제한

// Custom Hooks
const useTableLoading = (isApiLoading?: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (!isApiLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, SKELETON_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isApiLoading]);

  return isLoading;
};

const useStockSelection = () => {
  const [checkedStockIds, setCheckedStockIds] = useState<number[]>([]);

  const resetSelection = useCallback(() => {
    setCheckedStockIds([]);
  }, []);

  const toggleStock = useCallback((id: number) => {
    setCheckedStockIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  }, []);

  const toggleAll = useCallback((stockIds: number[]) => {
    setCheckedStockIds(prev => (prev.length === stockIds.length ? [] : stockIds));
  }, []);

  return {
    checkedStockIds,
    resetSelection,
    toggleStock,
    toggleAll,
  };
};

// Table Data Management Hook
const useStockData = (initialData: StockData[]) => {
  const [stockData, setStockData] = useState<StockData[]>(initialData);

  useEffect(() => {
    setStockData(initialData);
  }, [initialData]);

  const updateStockPrice = useCallback((itemId: number, levelIndex: number, value: number | null) => {
    setStockData(prev =>
      prev.map(item => {
        if (item.itemId === itemId) {
          const newMoney = [...item.money];
          newMoney[levelIndex] = value;
          return { ...item, money: newMoney };
        }
        return item;
      })
    );
  }, []);

  return { stockData, setStockData, updateStockPrice };
};

// Price Input Component
interface PriceInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  onEnterPress?: () => void;
}

const PriceInput = memo(forwardRef<HTMLInputElement, PriceInputProps>(({
  value,
  onChange,
  placeholder,
  onEnterPress
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(
    value == null ? "" : value.toString().replace(/,/g, "")
  );

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setLocalValue(value == null ? "" : value.toString().replace(/,/g, ""));
    // 포커스 시 모든 텍스트 선택
    setTimeout(() => {
      e.target.select();
    }, 0);
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (localValue === "") {
      onChange(null);
    } else {
      const numericValue = Math.min(Number(localValue.replace(/[^0-9]/g, "")) || 0, MAX_PRICE_VALUE);
      onChange(numericValue);
    }
  }, [localValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, "");
    // 최대값 체크
    if (Number(inputValue) <= MAX_PRICE_VALUE) {
      setLocalValue(inputValue);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키를 누르면 현재 값 저장 후 다음 필드로 이동
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur(); // 현재 값 저장
      if (onEnterPress) {
        setTimeout(() => onEnterPress(), 0);
      }
    }
    // Ctrl+A로 전체 선택
    else if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      (e.target as HTMLInputElement).select();
    }
    // 숫자, 백스페이스, 삭제, 화살표 키, Tab 키만 허용
    else if (!/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(e.key) &&
      !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    }
  }, [onEnterPress, handleBlur]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const numbersOnly = pastedText.replace(/[^0-9]/g, '');
    if (numbersOnly === "" || Number(numbersOnly) <= MAX_PRICE_VALUE) {
      setLocalValue(numbersOnly);
      // 붙여넣기 후 자동으로 값 업데이트
      setTimeout(() => {
        if (numbersOnly === "") {
          onChange(null);
        } else {
          onChange(Number(numbersOnly));
        }
      }, 0);
    }
  }, [onChange]);

  return (
    <PriceInputStyle
      ref={ref}
      type="text"
      value={isFocused ? localValue : value == null ? "" : formatPrice(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder || ""}
      inputMode="numeric"
      autoComplete="off"
    />
  );
}));

// Table Row Components
const StockTableHeader = memo(({
  isEdit,
  degree,
  allChecked,
  onToggleAll,
}: {
  isEdit: boolean;
  degree: number;
  allChecked: boolean;
  onToggleAll: () => void;
}) => {
  const columns = useMemo(() => {
    const cols = ["현재가"];
    for (let i = 1; i <= degree; i++) {
      cols.push(`${i}차`);
    }
    return cols;
  }, [degree]);

  return (
    <Thead>
      <tr>
        {isEdit && (
          <Th width="52px">
            <CheckBoxWrapper>
              <CheckBox
                onChange={onToggleAll}
                checked={allChecked}
                id="stock-header-checkbox"
              />
            </CheckBoxWrapper>
          </Th>
        )}
        <Th width="120px">종목 코드</Th>
        <Th width="300px">종목 이름</Th>
        {columns.map((header) => (
          <Th key={header} width="140px">
            {header}
          </Th>
        ))}
      </tr>
    </Thead>
  );
});

const StockTableRow = memo(({
  stock,
  isEdit,
  isLoading,
  degree,
  onToggle,
  onPriceChange,
  inputRefs,
  onCellClick,
  onMoveToNextField,
}: {
  stock: DisplayStockData;
  isEdit: boolean;
  isLoading: boolean;
  degree: number;
  onToggle: (id: number) => void;
  onPriceChange: (itemId: number, levelIndex: number, value: number | null) => void;
  inputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
  onCellClick: (inputId: string, event: React.MouseEvent) => void;
  onMoveToNextField: (currentItemId: number, currentColumnIndex: number, direction: 'next' | 'prev') => void;
}) => {
  const priceColumns = useMemo(() => {
    const cols = [1]; // 현재가 (인덱스 1)
    for (let i = 2; i <= degree + 1; i++) {
      cols.push(i);
    }
    return cols;
  }, [degree]);

  const handleEnterPress = useCallback((itemId: number, columnIndex: number) => {
    onMoveToNextField(itemId, columnIndex, 'next');
  }, [onMoveToNextField]);

  return (
    <tr>
      {isEdit && (
        <Td width="52px">
          <CheckBoxWrapper>
            <CheckBox
              checked={stock.checked}
              onChange={() => onToggle(stock.itemId)}
              id={`stock-row-${stock.itemId}`}
            />
          </CheckBoxWrapper>
        </Td>
      )}
      <Td width="120px">
        {isLoading ? (
          <SkeletonText>{stock.itemCode}</SkeletonText>
        ) : (
          stock.itemCode || <EmptyValueText>-</EmptyValueText>
        )}
      </Td>
      <Td width="300px">
        {isLoading ? (
          <SkeletonText>{stock.itemName}</SkeletonText>
        ) : (
          stock.itemName || <EmptyValueText>-</EmptyValueText>
        )}
      </Td>
      {priceColumns.map((columnIndex, displayIndex) => {
        const value = stock.money[columnIndex] ?? null;
        const inputId = `${stock.itemId}-${columnIndex}`;
        const headerName = displayIndex === 0 ? "현재가" : `${displayIndex}차`;
        const placeholder = `${headerName} 입력`;

        return (
          <Td
            key={columnIndex}
            width="140px"
            align="right"
            clickable={isEdit}
            onClick={e => isEdit ? onCellClick(inputId, e) : undefined}
            onDoubleClick={e => {
              if (isEdit) {
                e.preventDefault();
                const inputElement = inputRefs.current[inputId];
                if (inputElement) {
                  inputElement.focus();
                  setTimeout(() => inputElement.select(), 0);
                }
              }
            }}
          >
            {isEdit ? (
              <PriceInput
                ref={el => { inputRefs.current[inputId] = el; }}
                value={value}
                onChange={newValue => onPriceChange(stock.itemId, columnIndex, newValue)}
                placeholder={placeholder}
                onEnterPress={() => handleEnterPress(stock.itemId, columnIndex)}
              />
            ) : isLoading ? (
              <SkeletonText>{value === null ? placeholder : formatPrice(value)}</SkeletonText>
            ) : value === null ? (
              <EmptyValueText>{placeholder}</EmptyValueText>
            ) : (
              formatPrice(value)
            )}
          </Td>
        );
      })}
    </tr>
  );
});

const EmptyState = memo(({ colSpan }: { colSpan: number }) => (
  <tr>
    <Td colSpan={colSpan} align="center">
      <EmptyStateContainer>
        <EmptyStateText>투자 종목을 추가해 주세요.</EmptyStateText>
      </EmptyStateContainer>
    </Td>
  </tr>
));

const AddRowButton = memo(({ colSpan, onClick }: { colSpan: number; onClick: () => void }) => (
  <tr>
    <PlusTd colSpan={colSpan} onClick={onClick}>
      <PlusField>
        <PlusIcon>+</PlusIcon>
        추가하기
      </PlusField>
    </PlusTd>
  </tr>
));

const TableControls = memo(({
  hasCheckedItems,
  onDeleteSelected,
  isEdit,
}: {
  hasCheckedItems: boolean;
  onDeleteSelected: () => void;
  isEdit: boolean;
}) => (
  <DeleteButtonContainer>
    <TableTitle>투자 종목</TableTitle>
    {isEdit && (
      <Button
        backgroundColor={color.zinc[50]}
        borderColor={color.zinc[200]}
        hoverBackgroundColor={color.zinc[100]}
        onClick={onDeleteSelected}
        disabled={!hasCheckedItems}
      >
        선택항목 삭제하기
      </Button>
    )}
  </DeleteButtonContainer>
));

// Main Component
export const StockTables = memo(({
  degree,
  isEdit = true,
  data = [],
  onPriceChange,
  onDeleteItems,
  onAddItems,
  isApiLoading,
}: StockTablesProps) => {
  const selectedRound = parseInt(degree, 10);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const isLoading = useTableLoading(isApiLoading);
  const { stockData, setStockData, updateStockPrice } = useStockData(data);
  const { checkedStockIds, resetSelection, toggleStock, toggleAll } = useStockSelection();

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Computed values
  const displayData = useMemo<DisplayStockData[]>(() => {
    return stockData.map(stock => ({
      ...stock,
      checked: checkedStockIds.includes(stock.itemId),
    }));
  }, [stockData, checkedStockIds]);

  const hasCheckedItems = checkedStockIds.length > 0;
  const isAllChecked = stockData.length > 0 && checkedStockIds.length === stockData.length;
  const colSpan = (isEdit ? 1 : 0) + 3 + selectedRound; // checkbox + code + name + price columns

  // Event handlers
  const handleToggleAll = useCallback(() => {
    toggleAll(stockData.map(stock => stock.itemId));
  }, [toggleAll, stockData]);

  const handleDeleteSelected = useCallback(() => {
    if (!hasCheckedItems || !onDeleteItems) return;
    onDeleteItems(checkedStockIds);
    setStockData(prev => prev.filter(item => !checkedStockIds.includes(item.itemId)));
    resetSelection();
  }, [hasCheckedItems, onDeleteItems, checkedStockIds, setStockData, resetSelection]);

  const handlePriceChange = useCallback((itemId: number, levelIndex: number, value: number | null) => {
    updateStockPrice(itemId, levelIndex, value);
    if (onPriceChange) {
      onPriceChange(itemId, levelIndex, value);
    }
  }, [updateStockPrice, onPriceChange]);

  // 키보드 내비게이션을 위한 필드 이동 함수
  const handleMoveToNextField = useCallback((currentItemId: number, currentColumnIndex: number, direction: 'next' | 'prev') => {
    const allStocks = displayData;
    const currentStockIndex = allStocks.findIndex(stock => stock.itemId === currentItemId);

    if (currentStockIndex === -1) return;

    let nextInputId: string | null = null;

    if (direction === 'next') {
      // 같은 행에서 다음 컬럼으로 이동
      if (currentColumnIndex < selectedRound + 1) {
        nextInputId = `${currentItemId}-${currentColumnIndex + 1}`;
      }
      // 다음 행의 첫 번째 컬럼으로 이동 (현재가)
      else if (currentStockIndex < allStocks.length - 1) {
        const nextStock = allStocks[currentStockIndex + 1];
        nextInputId = `${nextStock.itemId}-1`;
      }
    } else if (direction === 'prev') {
      // 같은 행에서 이전 컬럼으로 이동
      if (currentColumnIndex > 1) {
        nextInputId = `${currentItemId}-${currentColumnIndex - 1}`;
      }
      // 이전 행의 마지막 컬럼으로 이동
      else if (currentStockIndex > 0) {
        const prevStock = allStocks[currentStockIndex - 1];
        nextInputId = `${prevStock.itemId}-${selectedRound + 1}`;
      }
    }

    if (nextInputId && inputRefs.current[nextInputId]) {
      setTimeout(() => {
        inputRefs.current[nextInputId]?.focus();
      }, 0);
    }
  }, [displayData, selectedRound]);

  const handleCellClick = useCallback((inputId: string, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    const inputElement = inputRefs.current[inputId];
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const handleOpenAddModal = useCallback(() => setShowAddModal(true), []);
  const handleCloseAddModal = useCallback(() => setShowAddModal(false), []);

  const handleAddItems = useCallback((newItems: StockData[]) => {
    if (onAddItems) {
      onAddItems(newItems);
    }
    setShowAddModal(false);
  }, [onAddItems]);

  return (
    <TableContainer>
      <TableControls
        hasCheckedItems={hasCheckedItems}
        onDeleteSelected={handleDeleteSelected}
        isEdit={isEdit}
      />

      <Table>
        <StockTableHeader
          isEdit={isEdit}
          degree={selectedRound}
          allChecked={isAllChecked}
          onToggleAll={handleToggleAll}
        />

        <Tbody>
          {displayData.length > 0 ? (
            displayData.map(stock => (
              <StockTableRow
                key={stock.itemId}
                stock={stock}
                isEdit={isEdit}
                isLoading={isLoading}
                degree={selectedRound}
                onToggle={toggleStock}
                onPriceChange={handlePriceChange}
                inputRefs={inputRefs}
                onCellClick={handleCellClick}
                onMoveToNextField={handleMoveToNextField}
              />
            ))
          ) : (
            <EmptyState colSpan={colSpan} />
          )}

          {isEdit && (
            <AddRowButton
              colSpan={colSpan}
              onClick={handleOpenAddModal}
            />
          )}
        </Tbody>
      </Table>

      {showAddModal && (
        <AddInvestItemModal
          close={handleCloseAddModal}
          onItemsSelected={handleAddItems}
          selectedDegree={selectedRound}
          existingItems={stockData.map(item => ({ id: item.itemId }))}
        />
      )}
    </TableContainer>
  );
});

// Styled Components
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
  width?: string;
}>`
  height: 48px;
  font: ${font.t4};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  text-align: ${props => props.align || "left"};
  cursor: ${props => (props.clickable ? "pointer" : "default")};
  width: ${props => props.width};
  vertical-align: middle;

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
  border-radius: 4px;
  padding: 2px 4px;
  transition: all 0.2s ease;

  &:focus {
    background-color: ${color.blue[50]};
    box-shadow: 0 0 0 2px ${color.blue[200]};
  }

  &:hover:not(:focus) {
    background-color: ${color.zinc[50]};
  }

  &::placeholder {
    color: ${color.zinc[400]};
    font-size: 12px;
  }

  &::selection {
    background-color: ${color.blue[200]};
  }
`;

const SkeletonText = styled(Skeleton)`
  color: transparent;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0 auto;

  & > * {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`;

const EmptyValueText = styled.span`
  color: ${color.zinc[400]};
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