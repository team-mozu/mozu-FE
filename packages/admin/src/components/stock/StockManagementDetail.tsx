import { Del, Edit, Button, Accounts, StockNoLogo } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useDeleteStock, useGetStockDetail } from '@/apis';
import { usePriceFormatter } from '@/hooks';

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
    name: '',
    info: '',
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
    datas.debt?.toString() || '',
    datas.capital?.toString() || '',
    datas.profit?.toString() || '',
    datas.profitOG?.toString() || '',
    datas.profitBen?.toString() || '',
    datas.netProfit?.toString() || '',
  ];

  const { data: stockData, isLoading } = useGetStockDetail(stockId);
  const { mutate: stockDelete } = useDeleteStock(stockId);

  if (isLoading) {
    <div>로딩중...</div>;
  }

  useEffect(() => {
    if (stockData) {
      setDatas({
        name: stockData.name || '',
        info: stockData.info || '',
        logo:
          stockData.logo ==
          'https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/종목 기본 이미지.svg'
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

  return (
    <Container>
      <UpperContainer>
        <div>
          <Logo>
            {datas.logo ? (
              <LogoImg src={datas.logo} alt="로고" />
            ) : (
              <StockNoLogo />
            )}
          </Logo>
          <Text>
            <Title>{datas.name}</Title>
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
            <p>{datas.info}</p>
          </div>
        </CompanyInfo>
        <CompanyMain>
          <Section>
            <div>
              <Label>재무상태표</Label>
              <ContentWrapper>
                <Accounts title={'부채'} content={datas.debt} />
                <Accounts title={'자본금'} content={datas.capital} />
              </ContentWrapper>
            </div>
            <div>
              <Label>손익계산서</Label>
              <ContentWrapper>
                <Accounts title={'매출액'} content={datas.profit} />
                <Accounts title={'매출원가'} content={datas.profitOG} />
                <Accounts title={'매출이익'} content={datas.profitBen} />
                <Accounts title={'당기순이익'} content={datas.netProfit} />
              </ContentWrapper>
            </div>
          </Section>
        </CompanyMain>
      </UnderContainer>
    </Container>
  );
};

const LogoImg = styled.img`
  width: 64px;
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
  font: ${font.t1};
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
