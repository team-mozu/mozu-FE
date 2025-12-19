import styled from "@emotion/styled";
import { color, Skeleton } from "@mozu/design-token";

export const SkeletonClassCard = () => {
  return (
    <CardContainer>
      <ContentWrapper>
        <Header>
          <TitleSection>
            <TitleSkeleton />
            <DateSkeleton />
          </TitleSection>
          <StarSkeleton />
        </Header>
        <Footer>
          <ButtonSkeleton />
        </Footer>
      </ContentWrapper>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  width: 100%;
  max-width: 480px;
  min-width: 320px;
  height: 156px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  background-color: ${color.white};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 1366px) {
    max-width: 400px;
    height: 140px;
  }

  @media (max-width: 1440px) {
    max-width: 440px;
    height: 148px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
`;

const TitleSkeleton = styled(Skeleton)`
  width: 70%;
  height: 24px;
  border-radius: 4px;
`;

const DateSkeleton = styled(Skeleton)`
  width: 40%;
  height: 18px;
  border-radius: 4px;
`;

const StarSkeleton = styled(Skeleton)`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
`;

const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ButtonSkeleton = styled(Skeleton)`
  width: 80px;
  height: 36px;
  border-radius: 6px;
`;
