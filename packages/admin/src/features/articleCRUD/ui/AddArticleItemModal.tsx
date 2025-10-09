import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, CheckBox, Input, Search } from "@mozu/ui";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetArticleList } from "@/entities/article";
import { ArticleItem } from "./ArticleItem";

interface AddArticleItemModalProps {
  close: () => void;
  onArticlesSelected: (articles: LessonArticle[]) => void;
  existingArticles?: {
    articleId: string;
  }[];
}

interface LessonArticle {
  articleId: string;
  title: string;
}

/**
 * 기사 추가 모달 컴포넌트
 * 기존에 추가된 기사를 제외하고 새로운 기사를 선택할 수 있는 모달입니다.
 */
export const AddArticleItemModal = ({ close, onArticlesSelected, existingArticles = [] }: AddArticleItemModalProps) => {
  const { data: articleData, isLoading } = useGetArticleList();
  const [searchText, setSearchText] = useState("");
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const navigate = useNavigate();

  /**
   * 이미 추가된 기사 ID 목록
   */
  const existingArticleIds = useMemo(
    () => existingArticles.map(article => article.articleId),
    [
      existingArticles,
    ],
  );

  /**
   * 기사 목록 데이터를 배열로 변환
   */
  const articles = useMemo(() => {
    if (!articleData) return [];
    // ArticleListResponse가 단일 객체인 경우 배열로 변환
    return Array.isArray(articleData)
      ? articleData
      : [
        articleData,
      ];
  }, [
    articleData,
  ]);

  /**
   * 검색어와 기존 기사를 필터링한 기사 목록
   */
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const isNotExisting = !existingArticleIds.includes(article.id);
      const matchesSearch =
        searchText === "" ||
        article.articleName.toLowerCase().includes(searchText.toLowerCase()) ||
        article.id.includes(searchText);

      return isNotExisting && matchesSearch;
    });
  }, [
    articles,
    existingArticleIds,
    searchText,
  ]);

  /**
   * 개별 기사 선택/해제 처리
   */
  const handleToggleArticle = useCallback((articleId: string) => {
    setSelectedArticleIds(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [
          ...prev,
          articleId,
        ],
    );
  }, []);

  /**
   * 전체 기사 선택/해제 처리
   */
  const handleToggleAllArticles = useCallback(() => {
    setSelectedArticleIds(prev =>
      prev.length === filteredArticles.length ? [] : filteredArticles.map(article => article.id),
    );
  }, [
    filteredArticles,
  ]);

  /**
   * 선택된 기사를 상위 컴포넌트로 전달하고 모달 닫기
   */
  const handleSubmit = useCallback(() => {
    const selectedArticles = filteredArticles
      .filter(article => selectedArticleIds.includes(article.id))
      .map(article => ({
        articleId: article.id,
        title: article.articleName,
      })) as LessonArticle[];

    onArticlesSelected(selectedArticles);
    close();
  }, [
    filteredArticles,
    selectedArticleIds,
    onArticlesSelected,
    close,
  ]);

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
    [
      close,
    ],
  );

  /**
   * 기사 생성 페이지로 이동
   */
  const handleCreateNew = useCallback(() => {
    close();
    navigate("/article-management/add");
  }, [
    close,
    navigate,
  ]);

  // TODO: 여기 수정
  // 검색어가 변경될 때 선택 상태 초기화
  // useEffect(() => {
  //   setSelectedArticleIds([]);
  // }, [searchText]);

  const isAllSelected = selectedArticleIds.length === filteredArticles.length && filteredArticles.length > 0;
  const hasSelectedItems = selectedArticleIds.length > 0;

  return (
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContainer>
        <ModalHeader>
          <HeaderTitle>기사 추가</HeaderTitle>
          <CloseButton onClick={close}>×</CloseButton>
        </ModalHeader>

        <SearchSection>
          <SearchInput
            placeholder="기사 제목이나 ID로 검색"
            startIcon={
              <Search
                color={color.zinc[400]}
                size={20}
              />
            }
            value={searchText}
            onChange={handleSearchChange}
          />
          {hasSelectedItems && <SelectionInfo>{selectedArticleIds.length}개 선택됨</SelectionInfo>}
        </SearchSection>

        <ContentSection>
          <TableHeader>
            <HeaderCheckbox>
              <CheckBox
                id="select-all-articles"
                onChange={handleToggleAllArticles}
                checked={isAllSelected}
                disabled={filteredArticles.length === 0}
              />
            </HeaderCheckbox>
            <HeaderColumn>기사 제목</HeaderColumn>
            <HeaderColumn>등록일자</HeaderColumn>
          </TableHeader>

          <ArticleList>
            {isLoading ? (
              <LoadingState>로딩 중...</LoadingState>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <ArticleItem
                  key={article.id}
                  title1={article.articleName}
                  title2={new Date(article.createdAt).toLocaleDateString("ko-KR")}
                  onChange={() => handleToggleArticle(article.id)}
                  checked={selectedArticleIds.includes(article.id)}
                  id={String(article.id)}
                />
              ))
            ) : (
              <EmptyState>
                <EmptyIcon>📄</EmptyIcon>
                <EmptyText>{searchText ? "검색 결과가 없습니다" : "추가 가능한 기사가 없습니다"}</EmptyText>
                {!searchText && (
                  <CreateNewButton
                    type="plusImg"
                    backgroundColor={color.orange[500]}
                    color={color.white}
                    isIcon
                    iconSize={24}
                    iconColor={color.white}
                    hoverBackgroundColor={color.orange[600]}
                    onClick={handleCreateNew}>
                    새 기사 만들기
                  </CreateNewButton>
                )}
              </EmptyState>
            )}
          </ArticleList>
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
            {hasSelectedItems ? `${selectedArticleIds.length}개 기사 추가` : "기사 선택"}
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
  grid-template-columns: 48px 1fr 180px;
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

const ArticleList = styled.div`
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
