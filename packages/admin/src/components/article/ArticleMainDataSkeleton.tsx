import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Skeleton } from "../../../../design-token/src/theme/Skeleton";

interface IArticleMainDataType {
  title?: string;
  main?: string;
}

export const ArticleMainDataSkeleton = ({
  title,
  main,
}: IArticleMainDataType) => {
  const lines = main ? main.split("\n") : [];

  return (
    <Container>
      <ArticleImgContainer />
      <ContentWrapper>
        <ArticleTitle>
          <p>{title}</p>
        </ArticleTitle>
        <ArticleMain>
          {lines.map((line) =>
            line.trim() === "" ? <br key={line} /> : <p key={line}>{line}</p>
          )}
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

const ArticleImgContainer = styled(Skeleton)`
  overflow: hidden;
  width: 100%;
  height: 320px;
  border-radius: 16px;
  background-color: ${color.zinc[100]};
  border: 1px solid ${color.zinc[200]};
`;

const ArticleTitle = styled(Skeleton)`
  color: transparent;
  font: ${font.h4};
  width: 70%;
  white-space: normal;
  word-wrap: break-word;
  word-break: keep-all;
`;

const ArticleMain = styled(Skeleton)`
  p {
    font: ${font.b2};
    color: transparent;
  }
`;
