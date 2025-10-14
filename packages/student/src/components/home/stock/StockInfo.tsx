import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Accounts, AccountsSkeleton, CompanySkeleton } from "@mozu/ui";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetStockDetail } from "@/apis";

// 데스크탑 반응형 브레이크포인트
const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

interface StockData {
  itemInfo: string;
  debt: number;
  capital: number;
  profit: number;
  profitOG: number;
  profitBen: number;
  netProfit: number;
}

export const StockInfo = () => {
  const { stockId } = useParams<{
    stockId: string;
  }>();

  const itemId = useMemo(() => {
    if (!stockId) return null;
    const parsed = parseInt(stockId, 10);
    return isNaN(parsed) ? null : parsed;
  }, [
    stockId,
  ]);

  const { data, isLoading, error } = useGetStockDetail(itemId ?? 0);

  // 에러 처리
  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>주식 정보를 불러오는 중 오류가 발생했습니다.</ErrorMessage>
      </ErrorContainer>
    );
  }

  // 잘못된 ID 처리
  if (!itemId) {
    return (
      <ErrorContainer>
        <ErrorMessage>잘못된 주식 ID입니다.</ErrorMessage>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <CompanyInfo>
        <SectionTitle>회사 정보</SectionTitle>
        {isLoading ? (
          <CompanySkeleton />
        ) : (
          <InfoCard>
            <StyledText>{data?.itemInfo || "회사 정보가 없습니다."}</StyledText>
          </InfoCard>
        )}
      </CompanyInfo>

      <FinancialInfo>
        <FinancialSection>
          <SectionTitle>재무상태표</SectionTitle>
          {isLoading ? (
            <ContentWrapper>
              <AccountsSkeleton />
              <AccountsSkeleton />
              <AccountsSkeleton />
            </ContentWrapper>
          ) : (
            <ContentWrapper>
              <Accounts
                title="자산"
                content={data?.money ?? 0}
              />
              <Accounts
                title="부채"
                content={data?.debt ?? 0}
              />
              <Accounts
                title="자본금"
                content={data?.capital ?? 0}
              />
            </ContentWrapper>
          )}
        </FinancialSection>

        <FinancialSection>
          <SectionTitle>손익계산서</SectionTitle>
          {isLoading ? (
            <ContentWrapper>
              <AccountsSkeleton />
              <AccountsSkeleton />
              <AccountsSkeleton />
              <AccountsSkeleton />
            </ContentWrapper>
          ) : (
            <ContentWrapper>
              <Accounts
                title="매출액"
                content={data?.profit ?? 0}
              />
              <Accounts
                title="매출원가"
                content={data?.profitOg ?? 0}
              />
              <Accounts
                title="매출이익"
                content={data?.profitBen ?? 0}
              />
              <Accounts
                title="당기순이익"
                content={data?.netProfit ?? 0}
              />
            </ContentWrapper>
          )}
        </FinancialSection>
      </FinancialInfo>
    </Container>
  );
};

// 스타일 컴포넌트들
const Container = styled.div`
  width: 100%;
  min-height: 95vh;
  padding: 32px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  overflow-y: auto;
  
  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px;
    min-height: 90vh;
  }
  
  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    padding: 28px;
    gap: 28px;
  }
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${color.zinc[100]};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${color.zinc[400]};
    border-radius: 4px;
  }
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  /* 태블릿 이하에서는 전체 너비 사용 */
  @media (max-width: 1024px) {
    grid-column: 1;
  }
`;

const InfoCard = styled.div`
  width: 100%;
  padding: 24px;
  background-color: ${color.zinc[50]};
  border-radius: 12px;
  border: 1px solid ${color.zinc[100]};
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const StyledText = styled.p`
  font: ${font.t2};
  color: ${color.black};
  white-space: pre-line;
  line-height: 1.7;
  word-break: break-word;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.6;
  }
`;

const FinancialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  
  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const FinancialSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  font: ${font.t3};
  color: ${color.black};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  padding: 32px;
  
  @media (max-width: 768px) {
    padding: 20px;
    min-height: 150px;
  }
`;

const ErrorMessage = styled.p`
  font: ${font.t2};
  color: ${color.red[600]};
  text-align: center;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
