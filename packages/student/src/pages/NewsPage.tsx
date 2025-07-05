import { useGetArticleList } from "@/apis";
import { NewsPost } from "@/components";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

// 타입 정의 추가
interface Article {
  articleId: number;
  title: string;
  description: string;
  image?: string;
}

export const NewsPage = () => {
  const navigate = useNavigate();
  const { data: articleData, isLoading, error } = useGetArticleList();

  // 데이터 메모이제이션
  const validArticles = useMemo(() => {
    return articleData?.filter(article =>
      article && article.articleId && article.title
    ) || [];
  }, [articleData]);

  // 에러 처리 추가
  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>뉴스를 불러오는 중 오류가 발생했습니다.</ErrorMessage>
        <RetryButton onClick={() => window.location.reload()}>
          다시 시도
        </RetryButton>
      </ErrorContainer>
    );
  }

  // 로딩 상태 개선
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>뉴스를 불러오는 중...</LoadingText>
      </LoadingContainer>
    );
  }

  // 빈 데이터 처리 개선
  if (validArticles.length === 0) {
    return (
      <EmptyContainer>
        <EmptyMessage>표시할 뉴스가 없습니다.</EmptyMessage>
      </EmptyContainer>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Label>전체 뉴스</Label>
          <ArticleCount>{validArticles.length}개의 기사</ArticleCount>
        </Header>
        <NewsContainer>
          {validArticles.map((article: Article) => (
            <NewsPost
              key={article.articleId}
              imgUrl={article.image}
              title={article.title}
              content={article.description}
              onClick={() => navigate(`${article.articleId}`)}
            />
          ))}
        </NewsContainer>
      </Container>
    </PageWrapper>
  );
};

// 스타일 컴포넌트들
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${color.zinc[50]};
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 32px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Label = styled.h1`
  font: ${font.t2};
  color: ${color.black};
  margin: 0;
`;

const ArticleCount = styled.span`
  font: ${font.t4};
  color: ${color.zinc[600]};
`;

const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

// 로딩 관련 스타일
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${color.zinc[200]};
  border-top: 4px solid ${color.blue[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font: ${font.t3};
  color: ${color.zinc[600]};
  margin: 0;
`;

// 에러 상태 스타일
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
`;

const ErrorMessage = styled.p`
  font: ${font.t3};
  color: ${color.red[600]};
  margin: 0;
`;

const RetryButton = styled.button`
  padding: 12px 24px;
  background-color: ${color.blue[500]};
  color: ${color.white};
  border: none;
  border-radius: 8px;
  font: ${font.t3};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${color.blue[600]};
  }
`;

// 빈 상태 스타일
const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
`;

const EmptyMessage = styled.p`
  font: ${font.t3};
  color: ${color.zinc[600]};
  margin: 0;
`;