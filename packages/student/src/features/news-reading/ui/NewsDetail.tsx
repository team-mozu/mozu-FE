import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { noImgIcon } from "@mozu/ui";

// 데스크탑 반응형 브레이크포인트
const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

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
        onError={e => {
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
  width: 100%;
  max-width: 580px;
  min-width: 300px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    gap: 20px;
    max-width: 480px;
    min-width: 280px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    gap: 22px;
    max-width: 530px;
  }
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

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    height: 260px;
    border-radius: 12px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    height: 290px;
    border-radius: 14px;
  }
`;

const ArticleTitle = styled.div`
  color: ${color.black};
  font: ${font.h4};
  width: 100%;
  white-space: normal;
  word-wrap: break-word;
  word-break: keep-all;
  line-height: 1.4;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    font-size: 18px;
    line-height: 1.3;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    font-size: 20px;
    line-height: 1.35;
  }
`;

const ArticleMain = styled.div`
  padding-bottom: 1.5rem;
  
  p {
    font: ${font.b2};
    color: ${color.zinc[800]};  
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: keep-all;
    line-height: 1.6;
    margin: 0;
  }

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    padding-bottom: 1.2rem;
    
    p {
      font-size: 14px;
      line-height: 1.5;
    }
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    padding-bottom: 1.35rem;
    
    p {
      font-size: 15px;
      line-height: 1.55;
    }
  }
`;
