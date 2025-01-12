import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { SearchInput } from './SearchInput';
import { Item } from './Item';
import { Button } from './Button';
import { useState } from 'react';

export const AddInvestItemModal = () => {
  const datas = [
    { id: '0', code: '035720', name: '카카오' },
    { id: '1', code: '005380', name: '현대차' },
    { id: '2', code: '000270', name: '기아' },
    { id: '3', code: '035420', name: 'NAVER' },
    { id: '4', code: '259960', name: '크래프톤' },
    { id: '5', code: '247540', name: '에코프로비엠' },
    { id: '6', code: '068270', name: '셀트리온' },
    { id: '7', code: '006400', name: '삼성SDI' },
    { id: '8', code: '373220', name: 'LG에너지솔루션' },
  ];
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    Array(datas.length).fill(false),
  );
  const [isHeadCheck, setIsHeadCheck] = useState<boolean>(false);

  const checkClick = (index: number) => {
    setCheckedItems((prev) => {
      const updateCheckItems = [...checkedItems];
      updateCheckItems[index] = !updateCheckItems[index];
      return updateCheckItems;
    });
  };

  const headClick = () => {
    setIsHeadCheck(!isHeadCheck);
    setCheckedItems((prev) => prev.map(() => !isHeadCheck));
  };

  return (
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
            {datas.map((data, index) => {
              return (
                <Item
                  title1={data.code}
                  title2={data.name}
                  onChange={() => checkClick(index)}
                  checked={checkedItems[index]}
                  id={data.id}
                  key={index}
                />
              );
            })}
          </ItemContents>
        </TableContainer>
        <FooterContainer>
          <BtnContainer>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              color={color.zinc[800]}
            >
              취소
            </Button>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
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
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
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

const TableContent = styled.div<{ isHeader: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  background-color: ${({ isHeader }) =>
    isHeader ? color.zinc[50] : 'transparent'};
  border-bottom: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : 'transparent')};
  border-top: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : 'transparent')};
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 64px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
`;
