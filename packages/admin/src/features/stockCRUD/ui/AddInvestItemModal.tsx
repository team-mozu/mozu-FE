import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, CheckBox, Input, Search } from "@mozu/ui";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetStockList } from "@/entities/stock";
import { StockItem } from "./StockItem";

interface AddInvestItemModalProps {
  close: () => void;
  onItemsSelected: (items: any[]) => void;
  selectedDegree: number;
  existingItems?: {
    id: number;
  }[];
}

/**
 * 투자종목 추가 모달 컴포넌트
 * 기존에 추가된 종목을 제외하고 새로운 종목을 선택할 수 있는 모달입니다.
 */
export const AddInvestItemModal = ({
  close,
  onItemsSelected,
  selectedDegree,
  existingItems = [],
}: AddInvestItemModalProps) => {
  const { data: stockData, isLoading } = useGetStockList();
  const [searchText, setSearchText] = useState("");
  const [selectedStockIds, setSelectedStockIds] = useState<number[]>([]);
  const navigate = useNavigate();

  /**
   * 이미 추가된 종목 ID 목록
   */
  const existingStockIds = useMemo(
    () => existingItems.map(item => item.id),
    [existingItems],
  );

  /**
   * 종목 목록 데이터를 배열로 변환
   */
  const stocks = useMemo(() => {
    if (!stockData) return [];
    return Array.isArray(stockData) ? stockData : [stockData];
  }, [stockData]);

  /**
   * 검색어와 기존 종목을 필터링한 종목 목록
   */
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const isNotExisting = !existingStockIds.includes(stock.itemId);
      const matchesSearch =
        searchText === "" ||
        stock.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
        String(stock.itemId).includes(searchText);

      return isNotExisting && matchesSearch;
    });
  }, [stocks, existingStockIds, searchText]);

  /**
   * 개별 종목 선택/해제 처리
   */
  const handleToggleStock = useCallback((stockId: number) => {
    setSelectedStockIds(prev =>
      prev.includes(stockId)
        ? prev.filter(id => id !== stockId)
        : [...prev, stockId],
    );
  }, []);

  /**
   * 전체 종목 선택/해제 처리
   */
  const handleToggleAllStocks = useCallback(() => {
    setSelectedStockIds(prev =>
      prev.length === filteredStocks.length ? [] : filteredStocks.map(stock => stock.itemId),
    );
  }, [filteredStocks]);

  /**
   * 선택된 종목을 상위 컴포넌트로 전달하고 모달 닫기
   */
  const handleSubmit = useCallback(() => {
    const selectedItems = filteredStocks
      .filter(stock => selectedStockIds.includes(stock.itemId))
      .map(stock => ({
        itemId: stock.itemId,
        itemCode: stock.itemId, // itemCode와 itemId가 같은 값으로 보임
        itemName: stock.itemName,
        money: Array(selectedDegree + 2).fill(null), // [현재가, 현재가, 1차, 2차, 3차] 형태
      }));

    onItemsSelected(selectedItems);
    close();
  }, [filteredStocks, selectedStockIds, selectedDegree, onItemsSelected, close]);

  /**
   * 검색어 변경 처리
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  /**
   * 모달 배경 클릭 시 모달 닫기
   */
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        close();
      }
    },
    [close],
  );

  /**
   * 종목 생성 페이지로 이동
   */
  const handleCreateNew = useCallback(() => {
    close();
    navigate('/stock-management/add');
  }, [close, navigate]);

  const isAllSelected = selectedStockIds.length === filteredStocks.length && filteredStocks.length > 0;
  const hasSelectedItems = selectedStockIds.length > 0;

  return (
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContainer>
        <ModalHeader>
          <HeaderTitle>투자종목 추가</HeaderTitle>
          <CloseButton onClick={close}>×</CloseButton>
        </ModalHeader>

        <SearchSection>
          <SearchInput
            placeholder="종목명이나 코드로 검색"
            startIcon={
              <Search
                color={color.zinc[400]}
                size={20}
              />
            }
            value={searchText}
            onChange={handleSearchChange}
          />
          {hasSelectedItems && <SelectionInfo>{selectedStockIds.length}개 선택됨</SelectionInfo>}
        </SearchSection>

        <ContentSection>
          <TableHeader>
            <HeaderCheckbox>
              <CheckBox
                id="select-all-articles"
                onChange={handleToggleAllStocks}
                checked={isAllSelected}
                disabled={filteredStocks.length === 0}
              />
            </HeaderCheckbox>
            <HeaderColumn>종목코드</HeaderColumn>
            <HeaderColumn>종목명</HeaderColumn>
          </TableHeader>

          <StockList>
            {isLoading ? (
              <LoadingState>로딩 중...</LoadingState>
            ) : filteredStocks.length > 0 ? (
              filteredStocks.map(stock => (
                <StockItem
                  key={stock.itemId}
                  title1={String(stock.itemId)}
                  title2={stock.itemName}
                  onChange={() => handleToggleStock(stock.itemId)}
                  checked={selectedStockIds.includes(stock.itemId)}
                  id={String(stock.itemId)}
                />
              ))
            ) : (
              <EmptyState>
                <EmptyIcon>📈</EmptyIcon>
                <EmptyText>{searchText ? "검색 결과가 없습니다" : "추가 가능한 종목이 없습니다"}</EmptyText>
                {!searchText && (
                  <CreateNewButton
                    type="plusImg"
                    backgroundColor={color.orange[500]}
                    color={color.white}
                    isIcon
                    iconSize={24}
                    iconColor={color.white}
                    hoverBackgroundColor={color.orange[600]}
                    onClick={handleCreateNew}
                  >
                    새 종목 등록하기
                  </CreateNewButton>
                )}
              </EmptyState>
            )}
          </StockList>
        </ContentSection>

        <ModalFooter>
          <FooterButton
            type="cancelImg"
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            color={color.zinc[800]}
            hoverBackgroundColor={color.zinc[100]}
            hoverBorderColor={color.zinc[300]}
            isIcon
            iconSize={20}
            iconColor={color.zinc[600]}
            onClick={close}>
            취소
          </FooterButton>
          <FooterButton
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[600]}
            hoverBorderColor={color.orange[600]}
            onClick={handleSubmit}
            disabled={!hasSelectedItems}>
            {hasSelectedItems ? `${selectedStockIds.length}개 종목 추가` : "종목 선택"}
          </FooterButton>
        </ModalFooter>
      </ModalContainer>
    </ModalBackground>
  );
};

// Styled Components
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  width: 900px;
  max-height: 80vh;
  background: ${color.white};
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 32px 0 32px;
  border-bottom: 1px solid ${color.zinc[100]};
  padding-bottom: 24px;
`;

const HeaderTitle = styled.h2`
  font: ${font.h3};
  color: ${color.zinc[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: ${color.zinc[50]};
  color: ${color.zinc[500]};
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${color.zinc[100]};
    color: ${color.zinc[700]};
  }
`;

const SearchSection = styled.div`
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${color.zinc[50]};
`;

const SearchInput = styled(Input)`
  flex: 1;
`;

const SelectionInfo = styled.div`
  font: ${font.b2};
  color: ${color.orange[600]};
  background: ${color.orange[50]};
  padding: 8px 16px;
  border-radius: 8px;
  white-space: nowrap;
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 1fr;
  gap: 16px;
  padding: 16px 32px;
  background: ${color.zinc[50]};
  border-bottom: 1px solid ${color.zinc[200]};
  align-items: center;
`;

const HeaderCheckbox = styled.div`
  display: flex;
  justify-content: center;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${color.orange[500]};
    cursor: pointer;
  }
`;

const HeaderColumn = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};
  font-weight: 600;
`;

const StockList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font: ${font.b2};
  color: ${color.zinc[500]};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
  text-align: center;
`;

const CreateNewButton = styled(Button)`
  margin-top: 16px;
  transition: all 0.2s ease;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid ${color.zinc[100]};
  background: ${color.white};
`;

const FooterButton = styled(Button)`
  min-width: 120px;
  height: 44px;
  border-radius: 12px;
  font: ${font.b2};
  font-weight: 600;
  transition: all 0.2s ease;

  &:disabled {
    background: ${color.zinc[100]} !important;
    border-color: ${color.zinc[200]} !important;
    color: ${color.zinc[400]} !important;
    cursor: not-allowed;
  }
`;
