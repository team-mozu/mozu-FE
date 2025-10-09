import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { memo, useCallback, useEffect, useState } from "react";
import { useGetTeamDetail } from "@/apis";
import type { TeamEndProps } from "@/apis/team/type";
import { InvestCompleteModal } from "@/components";
import { useLocalStorage, useUnchangedValue } from "@/hook";
import { roundToFixed } from "@/utils";

interface ITransactionContentType {
  id: string;
  keyword: "BUY" | "SELL";
  name: string;
  totalPrice: number;
  stockPrice: number;
  onDelete: (id: string) => void;
  isBuy?: boolean;
}

interface ITeamEndProps {
  itemId: number;
  itemName: string;
  orderType: "BUY" | "SELL";
  totalMoney: number;
  itemPrice: number;
}

const TransactionContent = memo(({ keyword, name, totalPrice, stockPrice, id, onDelete }: ITransactionContentType) => {
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
            {(totalPrice ?? 0).toLocaleString()}원 (
            {stockPrice && stockPrice > 0 ? Math.floor((totalPrice ?? 0) / stockPrice).toLocaleString() : "0"}주)
          </UpDownDiv>
          <StockPrice>{stockPrice && stockPrice > 0 ? stockPrice.toLocaleString() : "가격 정보 없음"}원</StockPrice>
        </TransactionPriceContainer>
        <CancleBtn onClick={handleDelete}>취소</CancleBtn>
      </TransactionContentContainer>
    </TransactionContainer>
  );
});

// Mock Data
const mockTeamData = {
  name: "모의팀",
  totalMoney: 12345678,
  profitNum: "+12.34%",
  valueProfit: 1234567,
  baseMoney: 10000000,
  cashMoney: 5000000,
  valueMoney: 7345678,
};

const mockTradeData: ITeamEndProps[] = [
  {
    itemId: 101,
    itemName: "모의주식A",
    orderType: "BUY",
    totalMoney: 500000,
    itemPrice: 70000,

  },
  {
    itemId: 102,
    itemName: "모의주식B",
    orderType: "SELL",
    totalMoney: 200000,
    itemPrice: 50000,
  },
  {
    itemId: 103,
    itemName: "모의주식C",
    orderType: "BUY",
    totalMoney: 300000,
    itemPrice: 80000,
  },
];

export const HistorySidebar = ({ isMock = false }: { isMock?: boolean }) => {
  const { data: realTeamData, isLoading } = useGetTeamDetail({
    queryKey: [
      "getTeam",
    ],
    enabled: !isMock,
  });

  // isMock 값에 따라 실제 데이터 또는 목 데이터를 사용
  const teamData = realTeamData;

  const [isOpen, setIsOpen] = useState(false);
  const [realTradeData, setRealTradeData] = useLocalStorage<TeamEndProps>("trade", []);
  const [realCashMoney, setRealCashMoney] = useLocalStorage<number>("cashMoney", 0);
  const [lastSyncedInvRound, setLastSyncedInvRound] = useState<number | null>(null);

  // isMock 값에 따라 실제 데이터 또는 목 데이터를 사용
  const allTradeData = realTradeData;
  // 현재 투자 라운드에 해당하는 거래만 필터링
  const currentInvRound = realTeamData?.curInvRound ?? 1;
  const tradeData = isMock
    ? mockTradeData
    : allTradeData.filter(trade => trade.invCount === currentInvRound);
  const cashMoney = isMock ? mockTeamData.cashMoney : realCashMoney;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  const setCashMoneyStable = useCallback((value: number) => {
    setRealCashMoney(value);
  }, []);

  const totalBuy = tradeData
    .filter(tradeItem => tradeItem.orderType === "BUY")
    .reduce((acc, item) => acc + (item.totalMoney ?? 0), 0);
  const totalSell = tradeData
    .filter(tradeItem => tradeItem.orderType === "SELL")
    .reduce((acc, item) => acc + (item.totalMoney ?? 0), 0);
  const buyableAmount = cashMoney;

  // 서버 데이터와 동기화: 초기 로딩 시 또는 투자 라운드가 변경되었을 때
  useEffect(() => {
    if (!isMock && realTeamData?.cashMoney !== undefined && realTeamData?.curInvRound !== undefined) {
      const currentInvRound = realTeamData.curInvRound;

      // 초기 로딩이거나 투자 라운드가 변경된 경우 서버 데이터로 동기화
      if (lastSyncedInvRound === null || lastSyncedInvRound !== currentInvRound) {
        setCashMoneyStable(realTeamData.cashMoney);
        setLastSyncedInvRound(currentInvRound);
        console.log(`[HistorySidebar] cashMoney 동기화: ${realTeamData.cashMoney}원 (투자라운드: ${currentInvRound})`);

        // 투자 라운드가 변경된 경우 로그만 출력 (거래 내역은 누적 보관)
        if (lastSyncedInvRound !== null && lastSyncedInvRound !== currentInvRound) {
          console.log(`[HistorySidebar] 투자 라운드 변경 - 현재 라운드 거래만 표시 (${lastSyncedInvRound} → ${currentInvRound})`);
        }
      }
    }
  }, [
    realTeamData?.cashMoney,
    realTeamData?.curInvRound,
    setCashMoneyStable,
    isMock,
    lastSyncedInvRound,
  ]);

  const formattedData = {
    teamName: teamData?.teamName,
    totalMoney: (teamData?.totalMoney ?? 0).toLocaleString(),
    cashMoney: (cashMoney ?? 0).toLocaleString(),
    valueMoney: ((teamData?.valuationMoney ?? 0) + totalBuy - totalSell).toLocaleString(),
    valueProfit: teamData?.valProfit ?? 0,
    profitNum: teamData?.profitNum,
    totalBuy: totalBuy.toLocaleString(),
    totalSell: totalSell.toLocaleString(),
    buyableAmount: (buyableAmount ?? 0).toLocaleString(),
  };
  const fixedProfitNum = Number((teamData?.profitNum ?? "0%").replace("%", "")).toFixed(3);
  const formattedProfitNum = fixedProfitNum.includes("-") ? `${fixedProfitNum}%` : `+${fixedProfitNum}%`;

  // Mock 페이지에서는 로딩 상태를 표시하지 않음
  if (!isMock && (isLoading || !teamData)) return null;

  // biome-ignore lint/correctness/useHookAtTopLevel: <임시>
  const sameValue: boolean = useUnchangedValue(
    (teamData?.totalMoney ?? 0).toLocaleString(),
    (teamData?.baseMoney ?? 0).toLocaleString(),
  );

  const IsOpen = () => {
    setIsOpen(true);
  };

  const handleDeleteTransaction = (deletedId: string) => {
    // Mock 모드에서는 실제 로컬 스토리지 업데이트 대신 목 데이터만 변경
    if (isMock) {
      console.log("Mock transaction deleted:", deletedId);
      return;
    }

    const deletedTrade = allTradeData.find(tradeItem => {
      return tradeItem.id === deletedId;
    });

    if (!deletedTrade) return;

    if (deletedTrade?.orderType === "BUY") {
      setRealCashMoney(realCashMoney + deletedTrade?.totalMoney);
    } else {
      setRealCashMoney(realCashMoney - deletedTrade?.totalMoney);
    }

    setRealTradeData(
      realTradeData.filter(tradeItem => {
        return tradeItem.id !== deletedId;
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
                color={
                  sameValue ? color.green[600] : (teamData?.valProfit ?? 0) > 0 ? color.red[500] : color.blue[500]
                }>
                {formattedData.totalMoney}원
              </TotalAssetPrice>
              {(teamData?.valProfit ?? 0) !== 0 ? (
                <ProfitContainer profit={teamData?.valProfit ?? 0}>
                  {formattedData.valueProfit.toLocaleString().includes("-") ? "" : "+"}
                  {formattedData.valueProfit.toLocaleString()}원 ({roundToFixed(parseFloat(formattedProfitNum), 2)}%)
                </ProfitContainer>
              ) : null}
            </TotalAssetLeft>

            <TeamContainer>
              <TeamContent>{teamData?.teamName}</TeamContent>
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
            ...(tradeData as TeamEndProps),
          ]
            .reverse()
            .map(data => (
              <TransactionContent
                key={data.id || `${data.itemId}-${data.invCount}`}
                id={data.id || `${data.itemId}-${data.invCount}`}
                onDelete={handleDeleteTransaction}
                keyword={data.orderType}
                name={data.itemName ?? ""}
                totalPrice={data.totalMoney ?? 0}
                stockPrice={data.itemPrice ?? 0}
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
  gap: clamp(0.75rem, 1.5vw, 1.125rem);;
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
