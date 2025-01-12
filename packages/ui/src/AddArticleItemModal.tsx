import styled from '@emotion/styled';
import {
  BtnContainer,
  FooterContainer,
  ModalBackground,
  TableContainer,
  Title,
} from './AddInvestItemModal';
import { color } from '@mozu/design-token';
import { SearchInput } from './SearchInput';
import { ArticleItem } from './ArticleItem';
import { Button } from './Button';
import { useState } from 'react';

interface IArticleModalType {
  close: () => void;
}

export const AddArticleItemModal = ({ close }: IArticleModalType) => {
  const onClose = () => {
    close();
  };

  const ArticleData = [
    {
      title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"',
      date: '2024-12-01',
    },
    {
      title: '[단독] 경찰, 안가 CCTV 압수수색 시도..."경호처 불승인"',
      date: '2024-12-01',
    },
    {
      title: '"대통령 3월부터 계엄 모의"..."해제해도 2번3번 선포"',
      date: '2024-12-01',
    },
    {
      title:
        '"대통령, 총 쏴서라도 문 부수고 끌어내라 지시"...검찰, 김용현 기소',
      date: '2024-12-01',
    },
  ];

  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    Array(ArticleData.length).fill(false),
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
      <ArticleModal>
        <SearchContainer>
          <Title isHeader>기사 추가</Title>
          <SearchInput inputText="기사 검색.." />
        </SearchContainer>
        <TableContainer>
          <ArticleItem
            isHeader={true}
            id="head"
            title1="기사 제목"
            title2="등록일자"
            checked={isHeadCheck}
            onChange={headClick}
          />
          <ItemContents>
            {ArticleData.map((data, index) => (
              <ArticleItem
                key={index}
                id={`Item-${index}`}
                title1={data.title}
                title2={data.date}
                onChange={() => checkClick(index)}
                checked={checkedItems[index]}
              />
            ))}
          </ItemContents>
        </TableContainer>
        <FooterContainer>
          <BtnContainer>
            <div onClick={onClose}>
              <Button
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                color={color.zinc[800]}
              >
                취소
              </Button>
            </div>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
            >
              선택 기사 추가
            </Button>
          </BtnContainer>
        </FooterContainer>
      </ArticleModal>
    </ModalBackground>
  );
};

const CancleBtn = styled.div``;

const ItemContents = styled.div`
  overflow: scroll;
  height: 428px;
`;

const ArticleModal = styled.div`
  background-color: ${color.white};
  width: 800px;
  height: 640px;
  border-radius: 16px;
  border: 1px solid ${color.zinc[200]};
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 12px 12px;
`;
