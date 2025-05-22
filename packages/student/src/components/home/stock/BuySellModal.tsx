// TODO: 매수 or 매도 불가 메시지 띄우기 || 버튼 Disable 처리 because 사용자 경험 향상

import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Toast } from "@mozu/ui";
import { useParams } from "react-router-dom";
import { useGetHoldItems, useGetStockDetail, useGetTeamDetail } from "@/apis";
import { useLocalStorage } from "@/hook/useLocalStorage";
import { TeamEndData, TeamEndProps } from "@/apis/team/type";

interface IPropsType {
  modalType: string;
  isOpen: boolean;
  onClose: () => void;
}

export const BuySellModal = ({ modalType, onClose, isOpen }: IPropsType) => {
  const { stockId } = useParams();
  const ItemId = stockId ? parseInt(stockId) : null;

  const { data: teamData } = useGetTeamDetail();
  const { data: stockData } = useGetStockDetail(ItemId);
  const { data: holdItemData } = useGetHoldItems();
  const [tradeData, setTradeData] = useLocalStorage<TeamEndProps>("trade", []);
  const [cashMoney, setCashMoney] = useLocalStorage<number>("cashMoney", 0);

  const handleConfirm = async () => {
    const itemIdNum = Number(stockId);
    const existingOppositeOrder = tradeData.find(
      (tradeItem) =>
        tradeItem.itemId === itemIdNum &&
        tradeItem.orderType !== (modalType === "매수" ? "BUY" : "SELL")
    );

    if (existingOppositeOrder) {
      Toast("같은 차수에서는 매수와 매도를 동시에 할 수 없습니다", {
        type: "error",
      });
      return;
    }

    if (
      modalType === "매수" &&
      numericQuantity * stockData.nowMoney > cashMoney
    ) {
      Toast("보유하고 있는 현금보다 많이 매수할 수 없습니다", {
        type: "error",
      });
      return;
    }

    if (modalType === "매도") {
      const holding = holdItemData.find((item) => item.itemId === itemIdNum);
      const holdingCount = holding?.itemCnt || 0;

      if (numericQuantity > holdingCount) {
        Toast("보유하고 있는 종목의 수량보다 많이 매도할 수 없습니다", {
          type: "error",
        });
        return;
      }
    }

    const newTradeItem: TeamEndData = {
      itemId: stockData.itemId,
      itemName: stockData.itemName,
      itemMoney: stockData.nowMoney,
      orderCount: numericQuantity,
      totalMoney: numericQuantity * stockData.nowMoney,
      orderType: modalType === "매수" ? "BUY" : "SELL",
    };

    try {
      const existingIndex = tradeData.findIndex(
        (tradeItem) =>
          tradeItem.itemId === itemIdNum &&
          tradeItem.orderType === newTradeItem.orderType
      );

      let updatedTradeData: TeamEndData[];

      if (existingIndex !== -1) {
        const mergedItem = {
          ...tradeData[existingIndex],
          orderCount:
            tradeData[existingIndex].orderCount + newTradeItem.orderCount,
          totalMoney:
            tradeData[existingIndex].totalMoney + newTradeItem.totalMoney,
        };

        updatedTradeData = [...tradeData];
        updatedTradeData[existingIndex] = mergedItem;
      } else {
        updatedTradeData = [...tradeData, newTradeItem];
      }

      const totalTradeMoney = numericQuantity * stockData.nowMoney;
      const updatedCashMoney =
        modalType === "매수"
          ? cashMoney - totalTradeMoney
          : cashMoney + totalTradeMoney;

      setCashMoney(updatedCashMoney);

      setTradeData(updatedTradeData);
      Toast(`거래가 성공적으로 완료되었습니다.`, { type: "success" });

      onClose();
    } catch (error) {
      console.error("거래 저장 중 오류 발생:", error);
      Toast("거래 중 오류가 발생했습니다. 다시 시도해주세요.", {
        type: "error",
      });
    }
  };

  const maxQuantity = useMemo(() => {
    if (!stockData || !stockData.nowMoney || !holdItemData) return 0;

    if (modalType === "매수") {
      return stockData.nowMoney > 0
        ? Math.floor(cashMoney / stockData.nowMoney)
        : 0;
    } else if (modalType === "매도") {
      const holding = holdItemData.find((item) => item.itemId === stockData.itemId);
      return holding?.itemCnt || 0;
    }
    return 0;
  }, [cashMoney, stockData.nowMoney, modalType, holdItemData, stockData.itemId]);

  // 상태 관리
  const [quantity, setQuantity] = useState<string>("0");
  const numericQuantity = Number(quantity.replace(/[^0-9]/g, "")) || 0;

  // 총 주문 금액 계산
  const totalAmount =
    (numericQuantity * stockData.nowMoney).toLocaleString("ko-KR") + "원";

  // 데이터 초기화
  useEffect(() => {
    const newQuantity = maxQuantity > 0 ? "1" : "0";
    setQuantity(newQuantity);
  }, [stockData.nowMoney, teamData.cashMoney]);

  // 입력 변경 핸들러
  const priceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue.replace(/[^0-9]/g, ""), 10) || 0;

    if (numericValue <= maxQuantity && numericValue >= 0) {
      setQuantity(numericValue.toString());
    }
  };

  // UI 데이터
  const footerData = [
    { text: `${modalType}가능 수량`, value: `${maxQuantity}주` },
    { text: "주문가격", value: `${stockData.nowMoney.toLocaleString()}원` },
    { text: "총 주문금액", value: totalAmount },
  ];

  if (!isOpen) return null;

  return (
    <BackgroundContainer onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Wrapper>
          <Header
            color={modalType === "매도" ? color.blue[500] : color.red[500]}
          >
            {stockData.itemName}
            <BuySellKeyword
              color={modalType === "매도" ? color.blue[500] : color.red[500]}
            >
              {modalType} 주문
            </BuySellKeyword>
          </Header>
          <InputBox>
            <Input
              placeholder=""
              label="수량"
              width="100%"
              value={quantity}
              onChange={priceChangeHandler}
              disabled={maxQuantity === 0} // 수량 입력 비활성화
            />
            <span>주</span>
          </InputBox>
          <Footer>
            {footerData.map((data, index) => {
              const value = index === 2 ? totalAmount : data.value;
              return (
                <FooterData key={index}>
                  {data.text}
                  <span>{value}</span>
                </FooterData>
              );
            })}
          </Footer>
        </Wrapper>
        <BtnDiv>
          <BtnBox>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              backgroundColor={
                modalType === "매도" ? color.blue[500] : color.red[500]
              }
              borderColor={
                modalType === "매도" ? color.blue[500] : color.red[500]
              }
              color="white"
              disabled={numericQuantity === 0}
              onClick={handleConfirm}
            >
              {modalType}하기
            </Button>
          </BtnBox>
        </BtnDiv>
      </Modal>
    </BackgroundContainer>
  );
};

const BuySellKeyword = styled.div<{ color: string }>`
  font: ${font.t3};
  color: ${(color) => color.color};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: right;
  gap: 10px;
`;

const BtnDiv = styled.div`
  padding: 12px 12px 12px 0px;
  border-top: 1px solid ${color.zinc[200]};
  width: 100%;
  margin-top: 20px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterData = styled.div`
  display: flex;
  justify-content: space-between;
  font: ${font.l1};
  color: ${color.zinc[600]};
  > span {
    font: ${font.b1};
    color: ${color.black};
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  gap: 8px;
  > span {
    font: ${font.t4};
    margin: 14px 0px;
  }
`;

const Header = styled.div`
  font: ${font.t1};
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  justify-content: center;
`;

const Modal = styled.div`
  background-color: ${color.white};
  border-radius: 16px;
  width: 480px;
  height: fit-content;
  padding: 40px;
`;

const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;
