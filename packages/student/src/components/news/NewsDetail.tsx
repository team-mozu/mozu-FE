import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { noImgIcon } from '@mozu/ui';

interface IArticleMainDataType {
  img?: string;
  title?: string;
  main?: string;
}

export const NewsDetail = ({ img, title, main }: IArticleMainDataType) => {
  return (
    <Container>
      <ArticleImg
        src={img}
        alt="기사 이미지"
        onError={(e) => {
          e.currentTarget.src = noImgIcon;
        }}
      />

      <ContentWrapper>
        <ArticleTitle>
          <p>{title}</p>
        </ArticleTitle>
        <ArticleMain>
          <p>{main}</p>
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
  height: 320px;
  object-fit: cover;
  border-radius: 16px;
  background-color: ${color.zinc[50]};
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
  padding-bottom: 1.5rem;
  p {
    font: ${font.b2};
    color: ${color.zinc[800]};  
    white-space: pre-wrap; // 줄바꿈 유지
    word-wrap: break-word; // 단어 단위로 줄바꿈
    overflow-wrap: break-word; // 긴 단어 처리
    word-break: keep-all; // 한글 줄바꿈
  }
`;
