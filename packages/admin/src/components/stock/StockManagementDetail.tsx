import {
  Del,
  Edit,
  Button,
  Accounts,
  StockNoLogo,
  AccountsSkeleton,
} from "@mozu/ui";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useDeleteStock, useGetStockDetail } from "@/apis";
import { usePriceFormatter } from "@/hooks";
import { Skeleton } from "../../../../design-token/src/theme/Skeleton";

interface IStockManagementDetailProps {
  onClick?: () => void; // onClick을 옵션으로 추가
}

export const StockManagementDetail = ({
  onClick,
}: IStockManagementDetailProps) => {
  const navigate = useNavigate();

  const { id } = useParams();
  const stockId = id ? parseInt(id) : null;

  // const [imgUrl, setImgUrl] = useState<string>('');
  const [datas, setDatas] = useState<{
    name: string;
    info: string;
    logo: string;
    money: number;
    debt: number;
    capital: number;
    profit: number;
    profitOG: number;
    profitBen: number;
    netProfit: number;
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
  const initialPrices = [
    datas.debt?.toString() || "",
    datas.capital?.toString() || "",
    datas.profit?.toString() || "",
    datas.profitOG?.toString() || "",
    datas.profitBen?.toString() || "",
    datas.netProfit?.toString() || "",
  ];

  const { data: stockData, isLoading: apiLoading } = useGetStockDetail(stockId);
  const { mutate: stockDelete } = useDeleteStock(stockId);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [stockId]);

  useEffect(() => {
    if (!apiLoading && stockData) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [apiLoading, stockData]);

  const lines = datas.info ? datas.info.split("\n") : [];

  // if (isLoading) {
  //   <div>로딩중...</div>;
  // }

  useEffect(() => {
    if (stockData) {
      setDatas({
        name: stockData.name || "",
        info: stockData.info || "",
        logo:
          stockData.logo ==
          "https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/종목 기본 이미지.svg"
            ? null
            : stockData.logo,
        money: stockData.money || null,
        debt: stockData.debt || null,
        capital: stockData.capital || null,
        profit: stockData.profit || null,
        profitOG: stockData.profitOG || null,
        profitBen: stockData.profitBen || null,
        netProfit: stockData.netProfit || null,
      });
    }
  }, [stockData]);

  // useEffect(() => {
  //   if (datas.logo) {
  //     const img = URL.createObjectURL(datas.logo || '');
  //     setImgUrl(img);

  //     return () => URL.revokeObjectURL(img);
  //   } else {
  //     setImgUrl(datas.logo);
  //   }
  // }, [datas.logo]);

  console.log(datas);

  return (
    <Container>
      <UpperContainer>
        <div>
          <Logo>
            {isLoading ? (
              <LogoImgDiv />
            ) : datas.logo ? (
              <LogoImg src={datas.logo} alt="로고" />
            ) : (
              <StockNoLogo />
            )}
          </Logo>
          <Text>
            {isLoading ? (
              <TitleDiv>{datas.name}</TitleDiv>
            ) : (
              <Title>{datas.name}</Title>
            )}
          </Text>
        </div>
        <ButtonContainer>
          <div onClick={onClick}>
            <Button
              backgroundColor={color.zinc[50]}
              color={color.zinc[800]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[100]}
            >
              삭제하기
              <Del size={20} color={color.zinc[800]} />
            </Button>
          </div>
          <Button
            backgroundColor={color.orange[50]}
            color={color.orange[500]}
            borderColor={color.orange[200]}
            hoverBackgroundColor={color.orange[100]}
            onClick={() => navigate(`/stock-management/${stockId}/edit`)}
          >
            수정하기
            <Edit size={20} color={color.orange[500]} />
          </Button>
        </ButtonContainer>
      </UpperContainer>
      <UnderContainer>
        <CompanyInfo>
          <Label>회사 정보</Label>
          <div>
            {isLoading ? (
              <CompanyDiv>{lines}</CompanyDiv>
            ) : (
              lines.map((line, index) =>
                line.trim() === "" ? (
                  // 빈 줄은 <br>로 처리
                  <br key={index} />
                ) : (
                  <CompanyText key={index}>{line}</CompanyText>
                )
              )
            )}
          </div>
        </CompanyInfo>
        <CompanyMain>
          <Section>
            <div>
              <Label>재무상태표</Label>
              {isLoading ? (
                <ContentWrapper>
                  <AccountsSkeleton title={"부채"} content={datas.debt} />
                  <AccountsSkeleton title={"자본금"} content={datas.capital} />
                </ContentWrapper>
              ) : (
                <ContentWrapper>
                  <Accounts title={"부채"} content={datas.debt} />
                  <Accounts title={"자본금"} content={datas.capital} />
                </ContentWrapper>
              )}
            </div>
            <div>
              <Label>손익계산서</Label>
              {isLoading ? (
                <ContentWrapper>
                  <AccountsSkeleton title={"매출액"} content={datas.profit} />
                  <AccountsSkeleton
                    title={"매출원가"}
                    content={datas.profitOG}
                  />
                  <AccountsSkeleton
                    title={"매출이익"}
                    content={datas.profitBen}
                  />
                  <AccountsSkeleton
                    title={"당기순이익"}
                    content={datas.netProfit}
                  />
                </ContentWrapper>
              ) : (
                <ContentWrapper>
                  <Accounts title={"매출액"} content={datas.profit} />
                  <Accounts title={"매출원가"} content={datas.profitOG} />
                  <Accounts title={"매출이익"} content={datas.profitBen} />
                  <Accounts title={"당기순이익"} content={datas.netProfit} />
                </ContentWrapper>
              )}
            </div>
          </Section>
        </CompanyMain>
      </UnderContainer>
    </Container>
  );
};

const CompanyText = styled.div`
  font: ${font.h5};
  word-break: break-all;
`;

const CompanyDiv = styled(Skeleton)`
  font: ${font.h5};
  word-break: break-all;
  color: transparent;
  width: fit-content;
`;

const LogoImg = styled.img`
  width: 64px;
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

const Number = styled.p`
  font: ${font.b2};
  color: ${color.zinc[600]};
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
