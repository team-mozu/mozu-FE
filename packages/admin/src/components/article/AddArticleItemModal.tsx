import { useGetArticleList } from '@/apis';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, SearchInput } from '@mozu/ui';
import { useState, useEffect } from 'react';
import { ArticleItem } from './ArticleItem';

// 서버 응답 인터페이스 정의
interface ArticleItem {
  id: number;
  title: string;
  date: string;
}

interface IArticleModalType {
  close: () => void;
  onArticlesSelected: (articles: any[]) => void;
  selectedDegree: number;
  existingArticles?: { id: number }[];
}

export const AddArticleItemModal = ({
  close,
  onArticlesSelected,
  selectedDegree,
  existingArticles = [],
}: IArticleModalType) => {
  // API에서 기사 리스트 가져오기
  const { data: articleData } = useGetArticleList();
  const [searchText, setSearchText] = useState('');

  const articles = articleData?.article || [];
  const existingArticleIds = existingArticles.map((article) => article.id);

  // 이미 선택된 아이템 필터링 및 검색어 적용
  const filteredArticles = articles.filter(
    (article) =>
      !existingArticleIds.includes(article.id) &&
      (searchText === '' ||
        article.title.toLowerCase().includes(searchText.toLowerCase()) ||
        String(article.id).includes(searchText)),
  );

  const [checkedArticles, setCheckedArticles] = useState<boolean[]>(
    Array(filteredArticles.length).fill(false),
  );

  const [isHeadCheck, setIsHeadCheck] = useState<boolean>(false);

  // 필터링된 아이템이 변경될 때마다 체크 상태 초기화
  useEffect(() => {
    setCheckedArticles(Array(filteredArticles.length).fill(false));
    setIsHeadCheck(false);
  }, [filteredArticles.length, searchText]);

  // 개별 아이템 체크 토글
  const checkClick = (index: number) => {
    setCheckedArticles((prev) => {
      const updateCheckItems = [...prev];
      updateCheckItems[index] = !updateCheckItems[index];

      // 헤더 체크박스 상태 업데이트
      const allChecked = updateCheckItems.every((item) => item);
      setIsHeadCheck(allChecked);

      return updateCheckItems;
    });
  };

  // 선택 완료 후 제출
  const handleSubmit = () => {
    const selectedArticles = filteredArticles
      .filter((_, index) => checkedArticles[index])
      .map((article) => ({
        id: article.id,
        title: article.title,
      }));

    console.log('Selected articles in modal:', selectedArticles);
    onArticlesSelected(selectedArticles);
  };

  // 전체 선택 토글
  const headClick = () => {
    const newState = !isHeadCheck;
    setIsHeadCheck(newState);
    setCheckedArticles(Array(filteredArticles.length).fill(newState));
  };

  // 검색어 변경 처리
  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  // 선택된 아이템이 있는지 확인
  const hasSelectedItems = checkedArticles.some((item) => item);

  return (
    <ModalBackground>
      <ArticleContainer>
        <SearchContainer>
          <Title isHeader>기사 추가</Title>
          <SearchInput
            inputText="기사 검색.."
            value={searchText}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        <TableContainer>
          <ArticleItem
            isHeader={true}
            title1="기사 제목"
            title2="등록일자"
            id="title"
            checked={isHeadCheck}
            onChange={headClick}
          />
          <ItemContents>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <ArticleItem
                  title1={article.title}
                  title2={article.date}
                  onChange={() => checkClick(index)}
                  checked={checkedArticles[index]}
                  id={String(article.id)}
                  key={article.id}
                />
              ))
            ) : (
              <EmptyState>
                {searchText
                  ? '검색 결과가 없습니다.'
                  : '추가 가능한 기사가 없습니다.'}
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
              선택 기사 추가
            </Button>
          </BtnContainer>
        </FooterContainer>
      </ArticleContainer>
    </ModalBackground>
  );
};

// Styled components
const ModalBackground = styled.div`
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

const ArticleContainer = styled.div`
  width: 800px;
  height: 640px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${color.white};
  padding-top: 12px;
`;

const SearchContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: start;
  width: 776px;
  margin-bottom: 12px;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${color.zinc[200]};
`;

const FooterContainer = styled.footer`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
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

const Title = styled.div<{ isHeader: boolean }>`
  font: ${font.b1};
  color: ${color.black};
  margin-left: 4px;
`;
