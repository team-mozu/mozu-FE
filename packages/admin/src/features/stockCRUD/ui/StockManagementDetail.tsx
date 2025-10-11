import styled from "@emotion/styled";
import { color, font, Skeleton } from "@mozu/design-token";
import { Accounts, AccountsSkeleton, Button, CompanySkeleton, Del, Edit, StockNoLogo } from "@mozu/ui";
import { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetStockDetail } from "@/entities/stock";
import { FullPageLoader } from "@/shared/ui";

interface IStockManagementDetailProps {
  onClick?: () => void; // onClick을 옵션으로 추가
}

const LogoSection = memo(({ logo, name, isLoading }: { logo?: string | null; name: string; isLoading: boolean }) => (
  <div>
    <Logo>
      {isLoading ? (
        <LogoImgDiv />
      ) : logo ? (
        <LogoImg
          src={logo}
          alt="로고"
        />
      ) : (
        <StockNoLogo />
      )}
    </Logo>
    <Text>{isLoading ? <TitleDiv>{name}</TitleDiv> : <Title>{name}</Title>}</Text>
  </div>
));

const CompanyInfoSection = memo(({ info, isLoading }: { info: string; isLoading: boolean }) => (
  <CompanyInfo>
    <Label>회사 정보</Label>
    {isLoading ? <CompanySkeleton /> : <CompanyText>{info}</CompanyText>}
  </CompanyInfo>
));

const BalanceSheetSection = memo(
  ({ money, debt, capital, isLoading }: { money: number | null; debt: number | null; capital: number | null; isLoading: boolean }) => (
    <div>
      <Label>재무상태표</Label>
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
            content={money ?? 0}
          />
          <Accounts
            title="부채"
            content={debt ?? 0}
          />
          <Accounts
            title="자본금"
            content={capital ?? 0}
          />
        </ContentWrapper>
      )}
    </div>
  ),
);

const IncomeStatementSection = memo(
  ({
    profit,
    profitOG,
    profitBen,
    netProfit,
    isLoading,
  }: {
    profit: number | null;
    profitOG: number | null;
    profitBen: number | null;
    netProfit: number | null;
    isLoading: boolean;
  }) => (
    <div>
      <Label>손익계산서</Label>
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
            content={profit ?? 0}
          />
          <Accounts
            title="매출원가"
            content={profitOG ?? 0}
          />
          <Accounts
            title="매출이익"
            content={profitBen ?? 0}
          />
          <Accounts
            title="당기순이익"
            content={netProfit ?? 0}
          />
        </ContentWrapper>
      )}
    </div>
  ),
);

export const StockManagementDetail = memo(({ onClick }: IStockManagementDetailProps) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const stockId = Number(id);

  // const [imgUrl, setImgUrl] = useState<string>('');
  const [datas, setDatas] = useState<{
    name: string;
    info: string;
    logo?: string | null;
    money: number | null;
    debt: number | null;
    capital: number | null;
    profit: number | null;
    profitOG: number | null;
    profitBen: number | null;
    netProfit: number | null;
  }>({
    name: "",
    info: "",
    logo: null,
    money: null,
    debt: null,
    capital: null,
    profit: null,
    profitOG: null,
    profitBen: null,
    netProfit: null,
  });

  const { data: stockData, isLoading: apiLoading } = useGetStockDetail(stockId ?? 0);

  const [isLoading, setIsLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    setIsLoading(true);
  }, [
    id,
  ]);

  useEffect(() => {
    if (!apiLoading && stockData) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [
    apiLoading,
    stockData,
  ]);

  useEffect(() => {
    if (stockData) {
      setDatas({
        name: stockData.itemName || "",
        info: stockData.itemInfo || "",
        logo:
          stockData.itemLogo === "https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/종목 기본 이미지.svg"
            ? null
            : stockData.itemLogo,
        money: stockData.money || null,
        debt: stockData.debt || null,
        capital: stockData.capital || null,
        profit: stockData.profit || null,
        profitOG: stockData.profitOg || null,
        profitBen: stockData.profitBenefit || null,
        netProfit: stockData.netProfit || null,
      });
    }
  }, [
    stockData,
  ]);

  if (apiLoading) return <FullPageLoader />;

  return (
    <Container>
      <UpperContainer>
        <LogoSection
          logo={datas?.logo}
          name={datas.name}
          isLoading={isLoading}
        />
        <ButtonContainer>
          <Button
            backgroundColor={color.zinc[50]}
            color={color.zinc[800]}
            borderColor={color.zinc[200]}
            hoverBackgroundColor={color.zinc[100]}
            disabled={isLoading}
            onClick={onClick}>
            삭제하기
            <Del
              size={20}
              color={color.zinc[800]}
            />
          </Button>
          <Button
            backgroundColor={color.orange[50]}
            color={color.orange[500]}
            borderColor={color.orange[200]}
            hoverBackgroundColor={color.orange[100]}
            onClick={() => navigate(`/stock-management/${id}/edit`)}
            disabled={isLoading}>
            수정하기
            <Edit
              size={20}
              color={color.orange[500]}
            />
          </Button>
        </ButtonContainer>
      </UpperContainer>
      <UnderContainer>
        <CompanyInfoSection
          info={datas.info}
          isLoading={isLoading}
        />
        <CompanyMain>
          <Section>
            <BalanceSheetSection
              money={datas.money}
              debt={datas.debt}
              capital={datas.capital}
              isLoading={isLoading}
            />
            <IncomeStatementSection
              profit={datas.profit}
              profitOG={datas.profitOG}
              profitBen={datas.profitBen}
              netProfit={datas.netProfit}
              isLoading={isLoading}
            />
          </Section>
        </CompanyMain>
      </UnderContainer>
    </Container>
  );
});

const CompanyText = styled.div`
  font: ${font.b2};
  word-break: break-all;
  white-space: pre-wrap; /* 줄바꿈 문자를 실제 줄바꿈으로 처리 */
`;
const LogoImg = styled.img`
width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;
const LogoImgDiv = styled(Skeleton)`
  width: 64px;
  height: 64px;
`;

const Container = styled.div`
  padding: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const UpperContainer = styled.div`
  & > div:first-of-type {
    display: flex;
    gap: 12px;
  }
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${color.zinc[100]};
  border: 1px solid ${color.zinc[200]};
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const Title = styled.p`
  font: ${font.h3};
  color: ${color.black};
`;

const TitleDiv = styled(Skeleton)`
  color: transparent;
  width: fit-content;
  font: ${font.h3};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: end;
`;

const Label = styled.label`
  color: ${color.black};
  font: ${font.h4};
`;

const UnderContainer = styled.div`
  overflow: scroll;
  padding: 32px;
  background-color: ${color.white};
  width: 100%;
  height: 95%;
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  display: grid;
  grid-template-columns: 50% 1fr;
  gap: 52px;
`;

const CompanyInfo = styled.div`
  grid-column: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  & > div {
    width: 100%;
    padding: 16px;
    background-color: ${color.zinc[50]};
    font: ${font.t2};
    color: ${color.black};
    border-radius: 12px;
  }
  & > div > p {
    line-height: 1.7;
  }
`;

const CompanyMain = styled.div`
  grid-column: 2; /* 두 번째 열에 배치 */
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
