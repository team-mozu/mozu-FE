import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { color, font } from "@mozu/design-token";
import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "@mozu/ui";
import { useParams, useNavigate } from "react-router-dom";
import { useGetHoldItems, useGetStockDetail, useGetTeamDetail } from "@/apis";
import { useLocalStorage } from "@/hook/useLocalStorage";
import { TeamEndData, TeamEndProps } from "@/apis/team/type";
import { AnimatePresence, motion } from "framer-motion";

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
  const outSideRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { classId } = useParams();

  useEffect(() => {
    if (isOpen) {
      // Focus the input after the modal's entry animation (300ms)
      const timerId = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timerId);
    }
  }, [isOpen]);

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
      navigate(`/${classId}`);
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
    const newQuantity = maxQuantity > 0 ? "0" : "0";
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

  // 최대수량 설정 핸들러
  const handleMaxQuantity = () => {
    setQuantity(maxQuantity.toString());
  };

  // UI 데이터
  const footerData = [
    { text: `${modalType}가능 수량`, value: `${maxQuantity}주` },
    { text: "주문가격", value: `${stockData.nowMoney.toLocaleString()}원` },
    { text: "총 주문금액", value: totalAmount },
  ];

  const isBuyMode = modalType === "매수";
  const themeColor = isBuyMode ? color.red[500] : color.blue[500];
  const themeLightColor = isBuyMode ? color.red[50] : color.blue[50];
  const themeGradient = isBuyMode
    ? 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)'
    : 'linear-gradient(135deg, #3742fa 0%, #2f3542 100%)';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <MotionBackdrop
        ref={outSideRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <MotionModalContainer
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <CloseButton onClick={onClose}>
            <CloseIcon>✕</CloseIcon>
          </CloseButton>

          <HeaderSection themeColor={themeColor} themeLightColor={themeLightColor}>
            <HeaderGradient themeGradient={themeGradient} />
            <HeaderContent>
              <StockName>{stockData.itemName}</StockName>
              <TradeTypeWrapper>
                <TradeTypeIcon isBuy={isBuyMode}>
                  {isBuyMode ? '📈' : '📉'}
                </TradeTypeIcon>
                <TradeTypeText themeColor={themeColor}>
                  {modalType} 주문
                </TradeTypeText>
              </TradeTypeWrapper>
            </HeaderContent>
          </HeaderSection>

          <ContentSection>
            <QuantitySection>
              <SectionLabel>주문 수량</SectionLabel>
              <QuantityInputWrapper>
                <StyledInput
                  ref={inputRef}
                  placeholder="0"
                  value={quantity}
                  onChange={priceChangeHandler}
                  disabled={maxQuantity === 0}
                  themeColor={themeColor}
                />
                <QuantityUnit>주</QuantityUnit>
                <MaxButton
                  onClick={handleMaxQuantity}
                  disabled={maxQuantity === 0}
                  themeColor={themeColor}
                >
                  최대
                </MaxButton>
              </QuantityInputWrapper>
            </QuantitySection>

            <InfoSection>
              {footerData.map((data, index) => (
                <InfoRow key={index} isTotal={index === 2}>
                  <InfoLabel>{data.text}</InfoLabel>
                  <InfoValue isTotal={index === 2} themeColor={themeColor}>
                    {index === 2 ? totalAmount : data.value}
                  </InfoValue>
                </InfoRow>
              ))}
            </InfoSection>
          </ContentSection>

          <ActionSection>
            <CancelButton onClick={onClose}>
              취소
            </CancelButton>
            <ConfirmButton
              disabled={numericQuantity === 0}
              onClick={handleConfirm}
              themeGradient={themeGradient}
              isBuy={isBuyMode}
            >
              <ButtonIcon>{isBuyMode ? '💰' : '📊'}</ButtonIcon>
              {modalType}하기
            </ConfirmButton>
          </ActionSection>
        </MotionModalContainer>
      </MotionBackdrop>
    </AnimatePresence>
  );
};

// 애니메이션 키프레임
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
`;

const slideUp = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// 스타일 컴포넌트들
const MotionBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const MotionModalContainer = styled(motion.div)`
  background: ${color.white};
  border-radius: 24px;
  width: 480px;
  max-width: 90vw;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 10px 20px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
`;

const CloseIcon = styled.span`
  font-size: 14px;
  color: ${color.zinc[600]};
  font-weight: bold;
`;

const HeaderSection = styled.div<{ themeColor: string; themeLightColor: string }>`
  position: relative;
  padding: 40px 40px 30px;
  background: ${props => props.themeLightColor};
  overflow: hidden;
`;

const HeaderGradient = styled.div<{ themeGradient: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${props => props.themeGradient};
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
`;

const StockName = styled.div`
  font: ${font.t1};
  color: ${color.zinc[900]};
  font-weight: 700;
  margin-bottom: 12px;
  animation: ${slideUp} 0.6s ease-out;
`;

const TradeTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${slideUp} 0.6s ease-out 0.1s both;
`;

const TradeTypeIcon = styled.div<{ isBuy: boolean }>`
  font-size: 20px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const TradeTypeText = styled.div<{ themeColor: string }>`
  font: ${font.t3};
  color: ${props => props.themeColor};
  font-weight: 600;
`;

const ContentSection = styled.div`
  padding: 30px 40px;
`;

const QuantitySection = styled.div`
  margin-bottom: 32px;
`;

const SectionLabel = styled.div`
  font: ${font.b1};
  color: ${color.zinc[700]};
  margin-bottom: 12px;
  font-weight: 600;
`;

const QuantityInputWrapper = styled.div`
  display: flex;
  align-items: stretch;
  gap: 12px;
  position: relative;
`;

const StyledInput = styled.input<{ themeColor: string }>`
  flex: 1;
  padding: 16px 20px;
  border: 2px solid ${color.zinc[200]};
  border-radius: 12px;
  font: ${font.t3};
  font-weight: 600;
  text-align: right;
  background: ${color.zinc[50]};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.themeColor};
    background: ${color.white};
    box-shadow: 0 0 0 3px ${props => props.themeColor}20;
  }
  
  &:disabled {
    background: ${color.zinc[100]};
    color: ${color.zinc[400]};
    cursor: not-allowed;
  }
`;

const QuantityUnit = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  font: ${font.t4};
  font-weight: 600;
  color: ${color.zinc[600]};
  background: ${color.zinc[100]};
  border-radius: 12px;
  border: 2px solid ${color.zinc[200]};
`;

const MaxButton = styled.button<{ themeColor: string }>`
  padding: 16px 20px;
  border: 2px solid ${props => props.themeColor};
  background: ${color.white};
  color: ${props => props.themeColor};
  border-radius: 12px;
  font: ${font.b1};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.themeColor};
    color: ${color.white};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoSection = styled.div`
  background: ${color.zinc[50]};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${color.zinc[100]};
`;

const InfoRow = styled.div<{ isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.isTotal ? '16px 0 0' : '8px 0'};
  
  ${props => props.isTotal && `
    border-top: 1px solid ${color.zinc[200]};
    margin-top: 16px;
  `}
  
  &:first-of-type {
    padding-top: 0;
  }
`;

const InfoLabel = styled.div`
  font: ${font.l1};
  color: ${color.zinc[600]};
`;

const InfoValue = styled.div<{ isTotal?: boolean; themeColor?: string }>`
  font: ${props => props.isTotal ? font.t3 : font.b1};
  color: ${props => props.isTotal ? props.themeColor : color.zinc[900]};
  font-weight: ${props => props.isTotal ? '700' : '600'};
`;

const ActionSection = styled.div`
  padding: 24px 40px 40px;
  display: flex;
  gap: 16px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: 2px solid ${color.zinc[200]};
  background: ${color.white};
  color: ${color.zinc[700]};
  border-radius: 12px;
  font: ${font.b1};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${color.zinc[50]};
    border-color: ${color.zinc[300]};
    transform: translateY(-1px);
  }
`;

const ConfirmButton = styled.button<{ themeGradient: string; isBuy: boolean }>`
  flex: 2;
  padding: 16px 24px;
  border: none;
  background: ${props => props.themeGradient};
  color: ${color.white};
  border-radius: 12px;
  font: ${font.b1};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    &:before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonIcon = styled.span`
  font-size: 16px;
`;