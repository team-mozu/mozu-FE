import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { ExitBtn } from "@mozu/ui";
import { useNavigate } from "react-router-dom";
import { NewsDetail } from "@/features";

const mockArticle = {
  articleId: 1,
  title: "[MOCK] 모의 뉴스 상세 페이지",
  description:
    "이것은 모의 뉴스 상세 페이지입니다. 실제 데이터 없이 UI만 보여주기 위한 목적으로 사용됩니다. 여기에 더 많은 내용이 들어갈 수 있습니다.",
  image: "https://via.placeholder.com/600x400?text=Mock+News+Image",
};

export const MockNewsDetailPage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Wrapper>
        <Container>
          <ArticleDiv>
            <NewsDetail
              img={mockArticle.image}
              title={mockArticle.title}
              main={mockArticle.description}
            />
          </ArticleDiv>
        </Container>
        <BtnWrapper onClick={() => navigate(-1)}>
          <ExitBtn />
        </BtnWrapper>
      </Wrapper>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled.div`
  padding: 40px;
  display: flex;
  width: 100%;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 1rem;
  height: calc(100vh - 144px);
  display: flex;
  overflow-y: auto;
`;

const ArticleDiv = styled.div`
  padding: 32px;
  height: 100%;
`;

const BtnWrapper = styled.div`
  position: absolute;
  transform: translate(24px, 24px);
  z-index: 100;
`;
