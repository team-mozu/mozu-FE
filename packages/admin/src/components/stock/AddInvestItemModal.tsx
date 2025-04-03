import { useGetStockList } from '@/apis';
import { Button, Item, SearchInput } from '../../../../ui/src';
import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { useState } from 'react';
import { useClassStore } from '@/store';

interface IInvestModalType {
  close: () => void;
}

export const AddInvestItemModal = ({ close }: IInvestModalType) => {
  const { data: stockData } = useGetStockList();
  const { updateStockItems, classData } = useClassStore();
  const [selectedRound, setSelectedRound] = useState(1);

  const items = stockData?.items || [];

  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    Array(items.length).fill(false),
  );

  const [isHeadCheck, setIsHeadCheck] = useState<boolean>(false);
  const [isClose, setIsClose] = useState<boolean>(false);

  const checkClick = (index: number) => {
    setCheckedItems((prev) => {
      const updateCheckItems = [...prev];
      updateCheckItems[index] = !updateCheckItems[index];
      return updateCheckItems;
    });
  };

  const handleSubmit = () => {
    const selectedItems = items.filter((_, index) => checkedItems[index]);

    const newStockItems = selectedItems.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      money: Array(selectedRound + 1).fill(0),
      currentPrice: 0,
      stockChecked: false,
    }));

    const currentItems = classData?.classItems || [];
    const existingIds = new Set(currentItems.map((item) => item.itemId));

    const uniqueNewItems = newStockItems.filter(
      (item) => !existingIds.has(item.itemId),
    );

    updateStockItems([...currentItems, ...uniqueNewItems]);

    close();
  };

  const headClick = () => {
    setIsHeadCheck(!isHeadCheck);
    setCheckedItems((prev) => prev.map(() => !isHeadCheck));
  };

  return (
    !isClose && (
      <ModalBackground>
        <InvestItemContainer>
          <SearchContainer>
            <Title isHeader>투자종목 추가</Title>
            <SearchInput inputText="종목 검색.." />
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
              {items.map((data, index) => (
                <Item
                  title1={data.id}
                  title2={data.name}
                  onChange={() => checkClick(index)}
                  checked={checkedItems[index]}
                  id={String(data.id)}
                  key={data.id}
                />
              ))}
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
              >
                선택 종목 추가
              </Button>
            </BtnContainer>
          </FooterContainer>
        </InvestItemContainer>
      </ModalBackground>
    )
  );
};

export const FooterContainer = styled.footer`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: end;
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
  background: rgba(0, 0, 0, 0.08); // 배경 흐림 효과
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ItemContents = styled.div`
  overflow: scroll;
  height: 432px;
`;

export const Title = styled.div<{ isHeader: boolean }>`
  font: ${font.b1};
  color: ${color.black};
  margin-left: 4px;
`;
