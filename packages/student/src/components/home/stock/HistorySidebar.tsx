import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useCallback, useEffect, useState } from "react";
import { useGetTeamDetail } from "@/apis";
import type { TeamEndProps } from "@/apis/team/type";
import { InvestCompleteModal } from "@/components";
import { useLocalStorage, useUnchangedValue } from "@/hook";
import { roundToFixed } from "@/utils";

interface ITransactionContentType {
  id: number;
  keyword: "BUY" | "SELL";
  name: string;
  totalPrice: number;
  stockPrice: number;
  onDelete: (id: number) => void;
  isBuy?: boolean;
}

const TransactionContent = ({ keyword, name, totalPrice, stockPrice, id, onDelete }: ITransactionContentType) => {
  const isBuy = keyword === "BUY";

  const handleDelete = async () => {
    onDelete(id);
  };
  return (
    <TransactionContainer>
      <TransactionContentContainer>
        <UpDownDiv isBuy={isBuy}>{keyword}</UpDownDiv>
        <TransactionName>{name}</TransactionName>
      </TransactionContentContainer>
      <TransactionContentContainer>
        <TransactionPriceContainer>
          <UpDownDiv isBuy={isBuy}>
            {totalPrice.toLocaleString()}원 ({(totalPrice / stockPrice).toLocaleString()}주)
          </UpDownDiv>
          <StockPrice>{stockPrice.toLocaleString()}원</StockPrice>
        </TransactionPriceContainer>
        <CancleBtn onClick={handleDelete}>취소</CancleBtn>
      </TransactionContentContainer>
    </TransactionContainer>
  );
};

export const HistorySidebar = () => {
  const { data, isLoading } = useGetTeamDetail();
  const [isOpen, setIsOpen] = useState(false);
  const [tradeData, setTradeData] = useLocalStorage<TeamEndProps>("trade", []);
  const [cashMoney, setCashMoney] = useLocalStorage<number>("cashMoney", 0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  const setCashMoneyStable = useCallback((value: number) => {
    setCashMoney(value);
  }, []);

  const totalBuy = tradeData
    .filter(tradeItem => tradeItem.orderType === "BUY")
    .reduce((acc, item) => acc + item.totalMoney, 0);
  const totalSell = tradeData
    .filter(tradeItem => tradeItem.orderType === "SELL")
    .reduce((acc, item) => acc + item.totalMoney, 0);
  const buyableAmount = cashMoney;

  useEffect(() => {
    if (data?.cashMoney !== undefined) {
      setCashMoneyStable(data.cashMoney);
    }
  }, [
    data,
    setCashMoneyStable,
  ]);

  const formattedData = {
    teamName: data?.name,
    totalMoney: data?.totalMoney.toLocaleString(),
    cashMoney: cashMoney.toLocaleString(),
    valueMoney: ((data?.valueMoney ?? 0) + totalBuy - totalSell).toLocaleString(),
    valueProfit: data?.valueProfit,
    profitNum: data?.profitNum,
    totalBuy: totalBuy.toLocaleString(),
    totalSell: totalSell.toLocaleString(),
    buyableAmount: buyableAmount.toLocaleString(),
  };
  const fixedProfitNum = Number(data?.profitNum.replace("%", "")).toFixed(3);
  const formattedProfitNum = fixedProfitNum.includes("-") ? `${fixedProfitNum}%` : `+${fixedProfitNum}%`;
  if (isLoading || !data) return null;

  // biome-ignore lint/correctness/useHookAtTopLevel: <임시>
  const sameValue: boolean = useUnchangedValue(data?.totalMoney.toLocaleString(), data?.baseMoney.toLocaleString());

  const IsOpen = () => {
    setIsOpen(true);
  };

  const handleDeleteTransaction = (deletedId: number) => {
    const deletedTrade = tradeData.find(tradeItem => {
      return tradeItem.itemId === deletedId;
    });

    if (!deletedTrade) return;

    if (deletedTrade?.orderType === "BUY") {
      setCashMoney(cashMoney + deletedTrade?.totalMoney);
    } else {
      setCashMoney(cashMoney - deletedTrade?.totalMoney);
    }

    setTradeData(
      tradeData.filter(tradeItem => {
        return tradeItem.itemId !== deletedId;
      }),
    );
  };

  return (
    <>
      <InvestCompleteModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <SidebarContainer>
        <UpperContainer>
          <TotalAssetContainer>
            <TotalAssetLeft>
              <Title>총 평가 자산</Title>
              <TotalAssetPrice
                color={sameValue ? color.green[600] : data.valueProfit > 0 ? color.red[500] : color.blue[500]}>
                {formattedData.totalMoney}원
              </TotalAssetPrice>
              {formattedData.valueProfit !== 0 ? (
                <ProfitContainer profit={formattedData.valueProfit ?? 0}>
                  {(formattedData?.valueProfit ?? 0).toLocaleString().includes("-") ? "" : "+"}
                  {(formattedData?.valueProfit ?? 0).toLocaleString()}원 (
                  {roundToFixed(parseFloat(formattedProfitNum), 2)}%)
                </ProfitContainer>
              ) : null}
            </TotalAssetLeft>

            <TeamContainer>
              <TeamContent>{data.name}</TeamContent>
            </TeamContainer>
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
          <SectionTitle>거래내역</SectionTitle>
        </UpperContainer>
        <TransactionHistoryContents>
          {[
            ...tradeData,
          ]
            .reverse()
            .map(data => (
              <TransactionContent
                key={data.itemId}
                id={data.itemId}
                onDelete={handleDeleteTransaction}
                keyword={data.orderType}
                name={data.itemName}
                totalPrice={data.totalMoney}
                stockPrice={data.itemMoney}
              />
            ))}
        </TransactionHistoryContents>
        <TotalPriceContainer>
          <PriceTitleContainer>
            <PriceTitle>총 매수금액</PriceTitle>
            <UpDownDiv isBuy={true}>{formattedData.totalBuy}원</UpDownDiv>
          </PriceTitleContainer>
          <PriceTitleContainer>
            <PriceTitle>총 매도금액</PriceTitle>
            <UpDownDiv isBuy={false}>{formattedData.totalSell}원</UpDownDiv>
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

// 반응형 디자인을 위한 미디어 쿼리 helper
const media = {
  tablet: "@media (max-width: 1024px)",
  desktop: "@media (min-width: 1025px)",
  largeDesktop: "@media (min-width: 1440px)",
  xlDesktop: "@media (min-width: 1920px)",
};

const CancleBtn = styled.button`
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  font-weight: 500;
  font-size: clamp(0.875rem, 1.4vw, 1rem);
  line-height: 1.2;
  color: ${color.zinc[800]};
  cursor: pointer;
  white-space: nowrap;
  
  :hover {
    background-color: ${color.zinc[100]};
  }
`;

const UpperContainer = styled.div`
  padding: clamp(1rem, 3vw, 1.5rem);
  width: 100%;
  display: flex;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  flex-direction: column;
`;

const SectionTitle = styled.p`
  font: ${font.b1};
  color: ${color.zinc[600]};
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.125rem);
`;

const Btn = styled.button`
  width: 100%;
  max-width: 20rem;
  height: clamp(2.75rem, 5vw, 3.25rem);
  border-radius: 0.5rem;
  border: none;
  outline: none;
  font: ${font.b1};
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  color: ${color.white};
  background-color: ${color.orange[500]};
  cursor: pointer;
  
  :hover {
    transition: 0.35s ease-in-out;
    background-color: ${color.orange[600]};
  }
`;

const SidebarContainer = styled.div`
  position: fixed;
  right: 0;
  width: clamp(20rem, 25vw, 22.5rem);
  min-width: 29rem;
  height: calc(100vh - 4rem);
  background-color: ${color.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid ${color.zinc[200]};
  box-shadow: -2px 0 4px rgba(93, 93, 93, 0.1);
  
  ${media.tablet} {
    width: clamp(18rem, 30vw, 24rem);
  }
  
  ${media.xlDesktop} {
    width: clamp(22.5rem, 20vw, 25rem);
  }
`;

const FooterContainer = styled.div`
  border-top: 1px solid ${color.zinc[200]};
  width: 100%;
  padding: clamp(0.75rem, 2vw, 1rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-top: auto;
`;

const PriceTitle = styled.div`
  font: ${font.l1};
  color: ${color.zinc[600]};
  font-size: clamp(0.875rem, 1.4vw, 1rem);
`;

const PriceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const TotalPriceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  padding: clamp(1rem, 2.5vw, 1.5rem);
`;

const TransactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.875rem, 2vw, 1.125rem);
  width: 100%;
  min-height: 3.5rem;
  gap: 0.75rem;
`;

const TransactionContentContainer = styled.div`
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1.125rem);
  align-items: center;
  flex-wrap: wrap;
`;

const UpDownDiv = styled.div<Pick<ITransactionContentType, "isBuy">>`
  font: ${font.b1};
  font-size: clamp(0.875rem, 1.4vw, 1rem);
  color: ${({ isBuy }) => (isBuy ? color.red[500] : color.blue[500])};
  white-space: nowrap;
`;

const TotalAssetPrice = styled.div<{
  color?: string;
}>`
  font: ${font.h3};
  font-size: clamp(1.5rem, 2.8vw, 1.75rem);
  color: ${({ color }) => color};
  word-break: break-all;
`;

const ProfitContainer = styled.div<{
  profit: number;
}>`
  color: ${({ profit }) => (profit > 0 ? color.red[500] : color.blue[500])};
  font-weight: 500;
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  word-break: break-all;
`;

const TransactionName = styled.div`
  font: ${font.b1};
  font-size: clamp(0.875rem, 1.4vw, 1rem);
  color: ${color.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 7rem;
`;

const StockPrice = styled.div`
  font: ${font.l2};
  font-size: clamp(0.8125rem, 1.3vw, 0.9375rem);
  color: ${color.zinc[600]};
  white-space: nowrap;
`;

const TransactionPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 0.25rem;
`;

const TotalAssetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TotalAssetLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(0.5rem, 1vw, 0.75rem);
`;

const TeamContainer = styled.div``;

const TeamContent = styled.div`
  padding: clamp(0.5rem, 1.2vw, 0.625rem) clamp(0.875rem, 1.8vw, 1.125rem);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${color.black};
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 0.5rem;
  font: ${font.t3};
  font-size: clamp(0.875rem, 1.4vw, 1rem);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Title = styled.div`
  font: ${font.b1};
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  color: ${color.zinc[600]};
`;

const HoldContainer = styled.div`
  width: 100%;
  min-height: 4.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  padding: clamp(0.75rem, 1.5vw, 1rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
`;

const HoldContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const HoldTitle = styled.div`
  font: ${font.l1};
  font-size: clamp(0.875rem, 1.4vw, 1rem);
  color: ${color.zinc[600]};
`;

const HoldPrice = styled.div`
  font: ${font.b1};
  font-size: clamp(0.875rem, 1.4vw, 1rem);
  color: ${color.black};
  white-space: nowrap;
`;

const TransactionHistoryContents = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  flex: 1;
  border-top: 1px solid ${color.zinc[200]};
  border-bottom: 1px solid ${color.zinc[200]};
  
  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 0.375rem;
  }
  
  ::-webkit-scrollbar-track {
    background: ${color.zinc[50]};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${color.zinc[300]};
    border-radius: 0.1875rem;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${color.zinc[400]};
  }
`;
