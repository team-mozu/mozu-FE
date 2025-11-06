import styled from "@emotion/styled";
import { color, Skeleton } from "@mozu/design-token";

interface IArticleMainDataType {
  main?: string;
}

export const ArticleMainDataSkeleton = ({ main }: IArticleMainDataType) => {
  const lines = main ? main.split("\n") : [];

  // 스켈레톤용 가짜 라인 생성 (실제 텍스트가 없을 때)
  const skeletonLines = lines.length > 0 ? lines : ['', '', '', ''];

  return (
    <Container>
      <ArticleImgContainer />

      <ContentWrapper>
        {/* 제목 스켈레톤 */}
        <TitleSkeletonWrapper>
          <TitleSkeleton />
          <UnderlineSkeleton />
        </TitleSkeletonWrapper>

        {/* 본문 스켈레톤 */}
        <ArticleMain>
          {skeletonLines.map((line, index) =>
            line.trim() === "" ? (
              <LineBreakSkeleton key={`br-${index}`} />
            ) : (
              <ParagraphSkeleton
                key={`p-${index}`}
                width={index === skeletonLines.length - 1 ? '60%' : '100%'}
              />
            )
          )}
        </ArticleMain>
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

const ArticleImgContainer = styled(Skeleton)`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 280px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    ${color.zinc[100]} 0%,
    ${color.zinc[200]} 50%,
    ${color.zinc[100]} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border: 1px solid ${color.zinc[200]};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const TitleSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleSkeleton = styled(Skeleton)`
  height: 32px;
  width: 75%;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${color.zinc[200]} 0%,
    ${color.zinc[300]} 50%,
    ${color.zinc[200]} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const UnderlineSkeleton = styled(Skeleton)`
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    ${color.orange[300]} 0%,
    ${color.orange[400]} 50%,
    ${color.orange[300]} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const ArticleMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ParagraphSkeleton = styled(Skeleton) <{ width: string }>`
  height: 20px;
  width: ${props => props.width};
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    ${color.zinc[200]} 0%,
    ${color.zinc[300]} 50%,
    ${color.zinc[200]} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const LineBreakSkeleton = styled.div`
  height: 8px;
`;
