import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NewsPost } from "@/features";

// 타입 정의 추가
interface Article {
  articleId: number;
  title: string;
  description: string;
  image?: string;
}

const mockArticles: Article[] = [
  {
    articleId: 1,
    title: "[MOCK] 시장, 기록적인 최고치 경신",
    description:
      "이것은 모의 뉴스 기사입니다. 주식 시장은 기술 및 재생 에너지 부문에 힘입어 전례 없는 성장을 보였습니다. 투자자들은 미래에 대해 낙관적입니다.",
    image: "https://via.placeholder.com/150x100?text=News1",
  },
  {
    articleId: 2,
    title: "[MOCK] AI의 새로운 혁신에 대한 보고서",
    description:
      "인공 지능의 획기적인 발전이 발표되어 여러 산업에 혁명을 일으킬 것으로 예상됩니다. 이 기사는 뉴스 모달 기능을 시연하기 위한 것입니다.",
    image: "https://via.placeholder.com/150x100?text=News2",
  },
  {
    articleId: 3,
    title: "[MOCK] 글로벌 경제 회복세",
    description:
      "주요 경제 지표들이 글로벌 경제의 강력한 회복세를 나타내고 있습니다. 이는 기업 실적 개선과 고용 증가로 이어질 것으로 기대됩니다.",
    image: "https://via.placeholder.com/150x100?text=News3",
  },
  {
    articleId: 4,
    title: "[MOCK] 신기술 스타트업 투자 활발",
    description:
      "새로운 기술을 개발하는 스타트업에 대한 투자가 활발하게 이루어지고 있습니다. 이는 미래 성장 동력 확보에 중요한 역할을 할 것입니다.",
    image: "https://via.placeholder.com/150x100?text=News4",
  },
];

export const MockNewsPage = () => {
  const navigate = useNavigate();

  const validArticles = useMemo(() => {
    return mockArticles;
  }, []);

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Label>전체 뉴스 (Mock)</Label>
          <ArticleCount>{validArticles.length}개의 기사</ArticleCount>
        </Header>
        <NewsContainer>
          {validArticles.map((article: Article) => (
            <NewsPost
              key={article.articleId}
              imgUrl={article.image}
              title={article.title}
              content={article.description}
              onClick={() => navigate(`__test__/mock-news/${article.articleId}`)} // Mock 경로로 변경
            />
          ))}
        </NewsContainer>
      </Container>
    </PageWrapper>
  );
};

// 스타일 컴포넌트들 (NewsPage.tsx에서 복사)
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
