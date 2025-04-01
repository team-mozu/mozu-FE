import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { InvestCompleteModal } from '@mozu/ui';
import { useEffect, useState } from 'react';
import { useUnchangedValue } from '@/hook';
import { db } from '@/db';
import { liveQuery } from 'dexie';

interface ITransactionContentType {
  keyword: string; //매수 매도
  name: string; //삼성전자
  totalPrice: string; //10000만원
  stockPrice: string; //100원(5주)
  isUp?: boolean; // 매수인지 매도인지 확인 기능
}

interface ITeamDataProp {
  teamName: string;
  totalMoney: number;
  basicMoney: number;
  cashMoney: number;
  valueMoney: number;
  valueProfit: number;
  profitNum: number;
  totalBuy: number;
  totalSell: number;
  buyableAmount: number;
}

interface TransactionData extends ITransactionContentType {
  id: number;
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
        <CancleBtn>취소</CancleBtn>
      </TransactionContentContainer>
    </TransactionContainer>
  );
};

export const HistorySidebar = ({
  teamName,
  totalMoney,
  basicMoney,
  cashMoney,
  valueMoney,
  valueProfit,
  profitNum,
  totalBuy,
  totalSell,
  buyableAmount,
}: ITeamDataProp) => {
  const [transactions, setTransactions] = useState<ITransactionContentType[]>(
    [],
  );

  useEffect(() => {
    const observable = liveQuery(async () => {
      return await db.tradeHistory.orderBy('timestamp').reverse().toArray();
    });

    const subscription = observable.subscribe({
      next: (history) => {
        const mapped = history.map((trade) => ({
          id: trade.id!,
          keyword: trade.orderType === 'BUY' ? '매수' : '매도',
          name: trade.itemName,
          totalPrice: (trade.itemMoney * trade.orderCount).toLocaleString(),
          stockPrice: `${trade.itemMoney.toLocaleString()}원 (${trade.orderCount}주)`,
          isUp: trade.orderType === 'BUY',
        }));
        setTransactions(mapped);
      },
      error: (error) => console.error('실시간 업데이트 오류:', error),
    });

    return () => subscription.unsubscribe();
  }, []);

  const datas = { transactionHistory: transactions };

  const formattedData = {
    teamName: teamName,
    totalMoney: totalMoney.toLocaleString(),
    cashMoney: cashMoney.toLocaleString(),
    valueMoney: valueMoney.toLocaleString(),
    valueProfit: valueProfit.toLocaleString(),
    profitNum: `${profitNum > 0 ? '+' : ''}${profitNum.toFixed(2)}%`,
    totalBuy: totalBuy.toLocaleString(),
    totalSell: totalSell.toLocaleString(),
    buyableAmount: buyableAmount.toLocaleString(),
  };

  const sameValue: boolean = useUnchangedValue(
    totalMoney.toLocaleString(),
    basicMoney.toLocaleString(),
  );
  const [isOpen, setIsOpen] = useState(false);

  const IsOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <InvestCompleteModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <SidebarContainer>
        <UpperContainer>
          <TeamContainer>
            <TeamContent>{formattedData.teamName}</TeamContent>
          </TeamContainer>
          <TotalAssetContainer>
            <Title>총 평가 자산</Title>
            <TotalAssetPrice
              color={
                sameValue
                  ? color.green[600]
                  : profitNum > 0 // 숫자 비교로 변경
                    ? color.red[500]
                    : color.blue[500]
              }
            >
              {formattedData.totalMoney}원
            </TotalAssetPrice>
            {!formattedData.valueProfit ? null : (
              <UpDownDiv>
                {formattedData.valueProfit}원 ({formattedData.profitNum})
              </UpDownDiv>
            )}
          </TotalAssetContainer>
          <HoldContainer>
            <HoldContent>
              <HoldTitle>보유현금</HoldTitle>
              <HoldPrice>{formattedData.cashMoney}원</HoldPrice>
            </HoldContent>
            <HoldContent>
              <HoldTitle>보유주식</HoldTitle>
              <HoldPrice>{formattedData.valueMoney}원</HoldPrice>
            </HoldContent>
          </HoldContainer>
          <p>거래내역</p>
        </UpperContainer>
        <TransactionHistoryContents>
          {datas.transactionHistory.map((data, index) => (
            <TransactionContent
              key={index}
              keyword={data.keyword}
              name={data.name}
              totalPrice={data.totalPrice}
              stockPrice={data.stockPrice}
              isUp={data.isUp}
            />
          ))}
        </TransactionHistoryContents>
        <TotalPriceContainer>
          <PriceTitleContainer>
            <PriceTitle>총 매수금액</PriceTitle>
            <UpDownDiv isUp={true}>{formattedData.totalBuy}원</UpDownDiv>
          </PriceTitleContainer>
          <PriceTitleContainer>
            <PriceTitle>총 매도금액</PriceTitle>
            <UpDownDiv isUp={false}>{formattedData.totalSell}원</UpDownDiv>
          </PriceTitleContainer>
          <PriceTitleContainer>
            <PriceTitle>구매가능 금액</PriceTitle>
            <HoldPrice>{formattedData.buyableAmount}원</HoldPrice>
          </PriceTitleContainer>
        </TotalPriceContainer>
        <FooterContainer>
          <Btn onClick={IsOpen}>투자 완료</Btn>
        </FooterContainer>
      </SidebarContainer>
    </>
  );
};

const CancleBtn = styled.button`
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: ${color.zinc[800]};
  cursor: pointer;
  :hover {
    background-color: ${color.zinc[100]};
  }
`;

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
  cursor: pointer;
  :hover {
    background-color: ${color.orange[600]};
  }
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
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
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

const TotalAssetPrice = styled.div<{ color?: string }>`
  font: ${font.h3};
  color: ${({ color }) => color};
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
