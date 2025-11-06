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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <PlaceholderWrapper>
            <NoNewsImg />
          </PlaceholderWrapper>
        )}
      </ArticleImgContainer>
      
      <ContentWrapper>
        {title && (
          <ArticleTitle>{title}</ArticleTitle>
        )}
        
        {main && (
          <ArticleMain>
            {lines.map((line, index) => 
              line.trim() === "" ? (
                <LineBreak key={`br-${index}`} />
              ) : (
                <Paragraph key={`p-${index}`}>{line}</Paragraph>
              )
            )}
          </ArticleMain>
        )}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px;
  background: ${color.white};
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid ${color.zinc[200]};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ArticleImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ArticleImgContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 280px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${color.zinc[50]} 0%, ${color.zinc[100]} 100%);
  border: 1px solid ${color.zinc[200]};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PlaceholderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${color.zinc[50]};
`;

const ArticleTitle = styled.h1`
  font: ${font.h3};
  font-weight: 700;
  color: ${color.zinc[900]};
  line-height: 1.4;
  margin: 0;
  word-wrap: break-word;
  word-break: keep-all;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, ${color.orange[500]}, ${color.orange[600]});
    margin-top: 16px;
    border-radius: 2px;
  }
`;

const ArticleMain = styled.div`
  line-height: 1.8;
  color: ${color.zinc[700]};
`;

const Paragraph = styled.p`
  font: ${font.b1};
  color: ${color.zinc[800]};
  margin: 0 0 16px 0;
  line-height: 1.7;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LineBreak = styled.div`
  height: 8px;
`;
