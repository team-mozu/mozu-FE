import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { NoNewsImg } from "@mozu/ui";

interface IArticleMainDataType {
  img?: string | null | undefined;
  title?: string;
  main?: string;
}

export const ArticleMainData = ({ img, title, main }: IArticleMainDataType) => {
  const lines = main ? main.split("\n") : [];

  return (
    <Container>
      <ArticleImgContainer>
        {img ? (
          <ArticleImg
            src={img}
            alt="기사 이미지"
          />
        ) : (
          <NoNewsImg />
        )}
      </ArticleImgContainer>
      <ContentWrapper>
        <ArticleTitle>
          <p>{title}</p>
        </ArticleTitle>
        <ArticleMain>
          {lines.map((line) => (line.trim() === "" ? <br key={line} /> : <p key={line}>{line}</p>))}
        </ArticleMain>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
  width: 580px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ArticleImg = styled.img`
  width: 100%;
  background-color: transparent;
`;

const ArticleImgContainer = styled.div`
  overflow: hidden;
  width: 100%;
  height: 320px;
  border-radius: 16px;
  background-color: ${color.zinc[100]};
  border: 1px solid ${color.zinc[200]};
`;

const ArticleTitle = styled.div`
  color: ${color.black};
  font: ${font.h4};
  width: 70%;
  white-space: normal;
  word-wrap: break-word;
  word-break: keep-all;
`;

const ArticleMain = styled.div`
  p {
    font: ${font.b2};
    color: ${color.zinc[800]};
  }
`;
