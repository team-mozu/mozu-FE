import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useState } from "react";
import { useUnchangedValue } from "@/hook";
import { useGetTeamDetail } from "@/apis";
import { InvestCompleteModal } from "@/components";
import { useLocalStorage } from "@/hook/useLocalStorage";
import { TeamEndProps } from "@/apis/team/type";

interface ITransactionContentType {
  id: number;
  keyword: "BUY" | "SELL";
  name: string;
  totalPrice: number;
  stockPrice: number;
  onDelete: (id: number) => void;
  isBuy?: boolean;
}

const TransactionContent = ({
  keyword,
  name,
  totalPrice,
  stockPrice,
  id,
  onDelete,
}: ITransactionContentType) => {
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
          <UpDownDiv isBuy={isBuy}>{totalPrice}원</UpDownDiv>
          <StockPrice>{stockPrice}</StockPrice>
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

  if (isLoading) return;

  const totalBuy = tradeData
    .filter((tradeItem) => tradeItem.orderType === "BUY")
    .reduce((acc, item) => acc + item.totalMoney, 0);
  const totalSell = tradeData
    .filter((tradeItem) => tradeItem.orderType === "SELL")
    .reduce((acc, item) => acc + item.totalMoney, 0);
  const buyableAmount = data.cashMoney - totalBuy + totalSell;

  const formattedData = {
    teamName: data.name,
    totalMoney: data.totalMoney.toLocaleString(),
    cashMoney: data.cashMoney.toLocaleString(),
    valueMoney: data.valueMoney.toLocaleString(),
    valueProfit: data.valueProfit,
    profitNum: data.profitNum,
    totalBuy: totalBuy.toLocaleString(),
    totalSell: totalSell.toLocaleString(),
    buyableAmount: buyableAmount.toLocaleString(),
  };

  const fixedProfitNum = Number(data.profitNum.replace("%", "")).toFixed(2);
  const formattedProfitNum = `${fixedProfitNum}%`;

  const sameValue: boolean = useUnchangedValue(
    data.totalMoney.toLocaleString(),
    data.baseMoney.toLocaleString()
  );

  const IsOpen = () => {
    setIsOpen(true);
  };

  const handleDeleteTransaction = (deletedId: number) => {
    setTradeData(
      tradeData.filter((tradeItem) => {
        return tradeItem.itemId !== deletedId;
      })
    );
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
                  : data.valueProfit > 0
                  ? color.red[500]
                  : color.blue[500]
              }
            >
              {formattedData.totalMoney}원
            </TotalAssetPrice>
            {formattedData.valueProfit !== 0 ? (
              <UpDownDiv>
                {formattedData.valueProfit.toLocaleString()}원 (
                {formattedProfitNum})
              </UpDownDiv>
            ) : null}
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
          {tradeData.map((data) => (
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
    transition: 0.35s ease-in-out;
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
  box-shadow: -2px 0 4px rgba(93, 93, 93, 0.1);
  z-index: 1;
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

const UpDownDiv = styled.div<Pick<ITransactionContentType, "isBuy">>`
  font: ${font.b1};
  color: ${({ isBuy }) => (isBuy ? color.red[500] : color.blue[500])};
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
