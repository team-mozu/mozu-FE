import { Del, Edit, Button, Accounts, StockNoLogo } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stockManagementDetail } from '@/apis';

interface IStockManagementDetailProps {
  onClick?: () => void; // onClick을 옵션으로 추가
}

export const StockManagementDetail = ({
  onClick,
}: IStockManagementDetailProps) => {
  const navigate = useNavigate();

  const {id} = useParams();
  const stockId = id? parseInt(id) : null;
  
  const [imgUrl, setImgUrl] = useState<string>('')
   const [datas, setDatas] = useState<{
      name: string,
      info: string,
      logo: File,
      money: number,
      debt: number,
      capital: number,
      profit: number,
      profitOG: number,
      profitBen: number,
      netProfit: number,}>({
        name: '',
        info: '',
        logo: null,
        money: null,
        debt: null,
        capital: null,
        profit: null,
        profitOG: null,
        profitBen: null,
        netProfit: null,})

        const {data: stockData, isLoading} = useQuery({
          queryKey: ['stocks', stockId],
          queryFn: () => stockManagementDetail(stockId),
          enabled: !!stockId,
        })
    
      useEffect(() => {
        if(stockData?.data) {
          setDatas({
            name: stockData.data.name || '',
            info: stockData.data.info || '',
            logo: stockData.data.logo == "https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/종목 기본 이미지.svg" ? null : stockData.data.logo, //사진 없을 시 기본 로고 띄우기 위해
            money: stockData.data.money || null,
            debt: stockData.data.debt || null,
            capital: stockData.data.capital || null,
            profit: stockData.data.profit || null,
            profitOG: stockData.data.profitOG || null,
            profitBen: stockData.data.profitBen || null,
            netProfit: stockData.data.netProfit || null,
          });
        }
      }, [stockData])

  useEffect(() => {
    if(datas.logo instanceof File) {
      const img = URL.createObjectURL(datas.logo || '')
      setImgUrl(img)

      return () => URL.revokeObjectURL(img)
    } else {
      setImgUrl(datas.logo)
    }
  },[datas.logo])


  return (
    <Container>
      <UpperContainer>
        <div>
          <Logo>
            {imgUrl ? (
              <LogoImg src={imgUrl} alt="로고" />
            ) : (
              <StockNoLogo/>
            )
          }
          </Logo>
          <Text>
            <Title>{datas.name}</Title>
            <Number>{stockId}</Number>
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
            <p>
            {datas.info} 
            </p>
          </div>
        </CompanyInfo>
        <CompanyMain>
          <LeftSection>
            <Label>재무상태표</Label>
            <ContentWrapper>
              <Accounts title={'부채'} content={datas.debt}  />
              <Accounts title={'자본금'} content={datas.capital} />
            </ContentWrapper>
          </LeftSection>

          <RightSection>
            <Label>손익계산서</Label>
            <ContentWrapper>
              <Accounts title={'매출액'} content={datas.profit} />
              <Accounts title={'매출원가'} content={datas.profitOG} />
              <Accounts title={'매출이익'} content={datas.profitBen} />
              <Accounts title={'당기순이익'} content={datas.netProfit} />
            </ContentWrapper>
          </RightSection>
        </CompanyMain>
      </UnderContainer>
    </Container>
  );
};

const LogoImg = styled.img `
  width: 64px;
  `

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

const UnderContainer = styled.div`
  overflow: scroll;
  padding: 32px;
  background-color: ${color.white};
  width: 100%;
  height: 95%;
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 52px;
`;

const CompanyInfo = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  & > div {
    width: 100%;
    padding: 16px;
    background-color: ${color.zinc[50]};
    font: ${font.b2};
    color: ${color.black};
    border-radius: 12px;
  }
`;

const CompanyMain = styled.div`
  display: flex;
  gap: 24px;
`;

const LeftSection = styled.div`
  flex: 1; /* 동일한 비율로 공간 차지 */
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const RightSection = styled.div`
  flex: 1; /* 기존 2에서 1로 변경 */
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: grid;
  gap: 12px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
`;

const Label = styled.label`
  color: ${color.black};
  font: ${font.t3};
`;
