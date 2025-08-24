import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Input, Search } from "@mozu/ui";
import { useEffect, useMemo, useState } from "react";
import { useGetArticleList } from "@/apis";
import { ArticleItem } from "./ArticleItem";

interface SelectedArticle {
  id: number;
  title: string;
}

interface IArticleModalType {
  close: () => void;
  onArticlesSelected: (articles: SelectedArticle[]) => void;
  selectedDegree: number;
  existingArticles?: {
    id: number;
  }[];
}

export const AddArticleItemModal = ({ close, onArticlesSelected, existingArticles = [] }: IArticleModalType) => {
  const { data: articleData } = useGetArticleList();
  const [searchText, setSearchText] = useState("");
  const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);

  const articles = useMemo(
    () => articleData?.article || [],
    [
      articleData,
    ],
  );
  const existingArticleIds = useMemo(
    () => existingArticles.map(article => article.id),
    [
      existingArticles,
    ],
  );

  const filteredArticles = useMemo(
    () =>
      articles.filter(
        article =>
          !existingArticleIds.includes(article.id) &&
          (searchText === "" ||
            article.title.toLowerCase().includes(searchText.toLowerCase()) ||
            String(article.id).includes(searchText)),
      ),
    [
      articles,
      existingArticleIds,
      searchText,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    setSelectedArticleIds([]);
  }, [filteredArticles]);

  const handleToggleArticle = (articleId: number) => {
    setSelectedArticleIds(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [
          ...prev,
          articleId,
        ],
    );
  };

  const handleToggleAllArticles = () => {
    if (selectedArticleIds.length === filteredArticles.length) {
      setSelectedArticleIds([]);
    } else {
      setSelectedArticleIds(filteredArticles.map(article => article.id));
    }
  };

  const handleSubmit = () => {
    const selectedArticles = filteredArticles
      .filter(article => selectedArticleIds.includes(article.id))
      .map(article => ({
        id: article.id,
        title: article.title,
      }));
    onArticlesSelected(selectedArticles);
    close();
  };

  const isAllSelected = selectedArticleIds.length === filteredArticles.length && filteredArticles.length > 0;

  return (
    <ModalBackground>
      <ArticleContainer>
        <SearchContainer>
          <Input
            label="기사 추가"
            placeholder="기사 검색.."
            fullWidth={true}
            startIcon={<Search color={color.zinc[400]} size={20} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </SearchContainer>
        <TableContainer>
          <ArticleItem
            isHeader={true}
            title1="기사 제목"
            title2="등록일자"
            id="title"
            checked={isAllSelected}
            onChange={handleToggleAllArticles}
          />
          <ItemContents>
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <ArticleItem
                  key={article.id}
                  title1={article.title}
                  title2={article.date}
                  onChange={() => handleToggleArticle(article.id)}
                  checked={selectedArticleIds.includes(article.id)}
                  id={String(article.id)}
                />
              ))
            ) : (
              <EmptyState>{searchText ? "검색 결과가 없습니다." : "추가 가능한 기사가 없습니다."}</EmptyState>
            )}
          </ItemContents>
        </TableContainer>
        <FooterContainer>
          <BtnContainer>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              color={color.zinc[800]}
              onClick={close}>
              취소
            </Button>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
              onClick={handleSubmit}
              disabled={selectedArticleIds.length === 0}>
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

const Title = styled.div`
  font: ${font.b1};
  color: ${color.black};
  margin-left: 4px;
`;
