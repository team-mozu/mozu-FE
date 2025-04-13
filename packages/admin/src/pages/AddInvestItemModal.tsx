import { useGetStockList } from '@/apis';
import { Button, Item, SearchInput } from '@mozu/ui';
import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { useState, useEffect } from 'react';
import { ClassItemRequest } from '@/apis/class/type';

interface IInvestModalType {
  close: () => void;
  onItemsSelected: (items: ClassItemRequest[]) => void;
  selectedDegree: number;
  existingItems?: ClassItemRequest[];
}

export const AddInvestItemModal = ({
  close,
  onItemsSelected,
  selectedDegree,
  existingItems = [],
}: IInvestModalType) => {
  const { data: stockData } = useGetStockList();
  const [searchText, setSearchText] = useState('');

  const items = stockData?.items || [];
  const existingItemIds = existingItems.map((item) => item.id);

  // Filter out already selected items and apply search filter
  const filteredItems = items.filter(
    (item) =>
      !existingItemIds.includes(item.id) &&
      (searchText === '' ||
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        String(item.id).includes(searchText)),
  );

  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    Array(filteredItems.length).fill(false),
  );

  const [isHeadCheck, setIsHeadCheck] = useState<boolean>(false);

  useEffect(() => {
    // Reset checked items when filtered items change
    setCheckedItems(Array(filteredItems.length).fill(false));
    setIsHeadCheck(false);
  }, [filteredItems.length, searchText]);

  const checkClick = (index: number) => {
    setCheckedItems((prev) => {
      const updateCheckItems = [...prev];
      updateCheckItems[index] = !updateCheckItems[index];

      // Update header checkbox state
      const allChecked = updateCheckItems.every((item) => item);
      setIsHeadCheck(allChecked);

      return updateCheckItems;
    });
  };

  const handleSubmit = () => {
    const selectedItems = filteredItems
      .filter((_, index) => checkedItems[index])
      .map((item) => ({
        id: item.id,
        money: Array(selectedDegree + 1).fill(0), // +1 for current price
      }));

    onItemsSelected(selectedItems);
    close();
  };

  const headClick = () => {
    const newState = !isHeadCheck;
    setIsHeadCheck(newState);
    setCheckedItems(Array(filteredItems.length).fill(newState));
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const hasSelectedItems = checkedItems.some((item) => item);

  return (
    <ModalBackground>
      <InvestItemContainer>
        <SearchContainer>
          <Title isHeader>투자종목 추가</Title>
          <SearchInput
            inputText="종목 검색.."
            value={searchText}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        <TableContainer>
          <Item
            isHeader={true}
            title1="종목 코드"
            title2="종목 이름"
            id="title"
            checked={isHeadCheck}
            onChange={headClick}
          />
          <ItemContents>
            {filteredItems.length > 0 ? (
              filteredItems.map((data, index) => (
                <Item
                  title1={String(data.id)}
                  title2={data.name}
                  onChange={() => checkClick(index)}
                  checked={checkedItems[index]}
                  id={String(data.id)}
                  key={data.id}
                />
              ))
            ) : (
              <EmptyState>
                {searchText
                  ? '검색 결과가 없습니다.'
                  : '추가 가능한 종목이 없습니다.'}
              </EmptyState>
            )}
          </ItemContents>
        </TableContainer>
        <FooterContainer>
          <BtnContainer>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              color={color.zinc[800]}
              onClick={close}
            >
              취소
            </Button>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
              onClick={handleSubmit}
              disabled={!hasSelectedItems}
            >
              선택 종목 추가
            </Button>
          </BtnContainer>
        </FooterContainer>
      </InvestItemContainer>
    </ModalBackground>
  );
};

export const FooterContainer = styled.footer`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
`;

export const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${color.zinc[200]};
`;

const SearchContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: start;
  width: 456px;
  margin-bottom: 12px;
`;

const InvestItemContainer = styled.div`
  width: 480px;
  height: 640px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${color.white};
  padding-top: 12px;
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ItemContents = styled.div`
  overflow: auto;
  height: 432px;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font: ${font.b2};
  color: ${color.zinc[500]};
`;

export const Title = styled.div<{ isHeader: boolean }>`
  font: ${font.b1};
  color: ${color.black};
  margin-left: 4px;
`;
