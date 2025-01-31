import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface ITransactionContentType {
  keyword: string; //매수 매도
  name: string; //삼성전자
  totalPrice: string; //10000만원
  stockPrice: string; //100원(5주)
  isUp?: boolean; // 매수인지 매도인지 확인 기능
}

const TransactionContent = ({
  keyword,
  name,
  totalPrice,
  stockPrice,
  isUp,
}: ITransactionContentType) => {
  return (
    <TransactionContainer>
      <TransactionContentContainer>
        <UpDownDiv isUp={isUp}>{keyword}</UpDownDiv>
        <TransactionName>{name}</TransactionName>
      </TransactionContentContainer>
      <TransactionContentContainer>
        <TransactionPriceContainer>
          <UpDownDiv isUp={isUp}>{totalPrice}원</UpDownDiv>
          <StockPrice>{stockPrice}</StockPrice>
        </TransactionPriceContainer>
        <button
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: `1px solid ${color.zinc[200]}`,
            backgroundColor: `${color.zinc[50]}`,
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '18px',
            color: `${color.zinc[800]}`,
            cursor: 'pointer',
          }}
        >
          취소
        </button>
      </TransactionContentContainer>
    </TransactionContainer>
  );
};

export const HistorySidebar = () => {
  const datas = {
    teamName: '대마고 화이팅',
    total: [
      {
        isUp: true,
        totalAssets: '1,850,000',
        totalUpDown: {
          upDownPrice: '+850,000',
          upDownPercent: '+85',
        },
      },
    ],
    hold: {
      holdPrice: '500,000',
      holdStock: '1,350,000',
    },
    transactionHistory: [
      {
        keyword: '매수',
        name: '삼성전자',
        totalPrice: '429,600',
        stockPrice: '53,700원 (8주)',
        isUp: true,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },

      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
      {
        keyword: '매도',
        name: 'LG전자',
        totalPrice: '502,200',
        stockPrice: '83,700원 (6주)',
        isUp: false,
      },
    ],
    totalBuy: '429,600',
    totalSell: '931,200',
    buyableAmount: '1,001,600',
  };

  return (
    <SidebarContainer>
      <UpperContainer>
        <TeamContainer>
          <TeamContent>{datas.teamName}</TeamContent>
        </TeamContainer>
        <TotalAssetContainer>
          <Title>총 평가 자산</Title>
          <TotalAssetPrice isUp={datas.total[0].isUp}>
            {datas.total[0].totalAssets}원
          </TotalAssetPrice>
          <UpDownDiv isUp={datas.total[0].isUp}>
            {datas.total[0].totalUpDown.upDownPrice}원 (
            {datas.total[0].totalUpDown.upDownPercent}%)
          </UpDownDiv>
        </TotalAssetContainer>
        <HoldContainer>
          <HoldContent>
            <HoldTitle>보유현금</HoldTitle>
            <HoldPrice>{datas.hold.holdPrice}원</HoldPrice>
          </HoldContent>
          <HoldContent>
            <HoldTitle>보유주식</HoldTitle>
            <HoldPrice>{datas.hold.holdStock}원</HoldPrice>
          </HoldContent>
        </HoldContainer>
        <p>거래내역</p>
      </UpperContainer>
      <TransactionHistoryContents>
        {datas.transactionHistory.map((data, index) => (
          <TransactionContent
            keyword={data.keyword}
            name={data.name}
            totalPrice={data.totalPrice}
            stockPrice={data.stockPrice}
            isUp={data.isUp}
            key={index}
          />
        ))}
      </TransactionHistoryContents>
      <TotalPriceContainer>
        <PriceTitleContainer>
          <PriceTitle>총 매수금액</PriceTitle>
          <UpDownDiv isUp={true}>{datas.totalBuy}원</UpDownDiv>
        </PriceTitleContainer>
        <PriceTitleContainer>
          <PriceTitle>총 매도금액</PriceTitle>
          <UpDownDiv isUp={false}>{datas.totalSell}원</UpDownDiv>
        </PriceTitleContainer>
        <PriceTitleContainer>
          <PriceTitle>구매가능 금액</PriceTitle>
          <HoldPrice>{datas.buyableAmount}원</HoldPrice>
        </PriceTitleContainer>
      </TotalPriceContainer>
      <FooterContainer>
        <Btn>투자 완료</Btn>
        <FooterContent>© 대덕소프트웨어마이스터고등학교</FooterContent>
      </FooterContainer>
    </SidebarContainer>
  );
};

const UpperContainer = styled.div`
  padding: 24px 1rem 1rem 1rem;
  width: 100%;
  display: flex;
  gap: 24px;
  flex-direction: column;
  > p {
    font: ${font.b1};
    color: ${color.zinc[600]};
  }
`;

const Btn = styled.button`
  width: 328px;
  height: 48px;
  border-radius: 8px;
  border: none;
  outline: none;
  font: ${font.b1};
  color: ${color.white};
  background-color: ${color.orange[500]};
`;

const SidebarContainer = styled.div`
  position: fixed;
  right: 0;
  width: 360px;
  height: calc(100vh - 64px);
  background-color: ${color.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid ${color.zinc[200]};
`;

const FooterContent = styled.div`
  font: ${font.l2};
  color: ${color.zinc[500]};
`;

const FooterContainer = styled.div`
  border-top: 1px solid ${color.zinc[200]};
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: auto;
`;

const PriceTitle = styled.div`
  font: ${font.l1};
  color: ${color.zinc[600]};
`;

const PriceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TotalPriceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
`;
const TransactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  width: 100%;
`;

const TransactionContentContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const UpDownDiv = styled.div<Pick<ITransactionContentType, 'isUp'>>`
  font: ${font.b1};
  color: ${({ isUp }) => (isUp ? color.red[500] : color.blue[500])};
`;

const TotalAssetPrice = styled.div<Pick<ITransactionContentType, 'isUp'>>`
  font: ${font.h3};
  color: ${({ isUp }) => (isUp ? color.red[500] : color.blue[500])};
`;

const TransactionName = styled.div`
  font: ${font.b1};
  color: ${color.black};
`;

const StockPrice = styled.div`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;

const TransactionPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 4px;
`;

const TotalAssetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

const TeamContainer = styled.div`
  width: 100%;
`;

const TeamContent = styled.div`
  padding: 6px 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${color.black};
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  font: ${font.t3};
`;

const Title = styled.div`
  font: ${font.b1};
  color: ${color.zinc[600]};
`;

const HoldContainer = styled.div`
  padding: 12px;
  width: 100%;
  height: 72px;
  border-radius: 8px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HoldContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HoldTitle = styled.div`
  font: ${font.l1};
  color: ${color.zinc[600]};
`;

const HoldPrice = styled.div`
  font: ${font.b1};
  color: ${color.black};
`;

const TransactionHistoryContents = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 360px;
  flex: 1;
  border-top: 1px solid ${color.zinc[200]};
  border-bottom: 1px solid ${color.zinc[200]};
`;
