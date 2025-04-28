import styled from "@emotion/styled";
import {
  NavBar,
  StockGraph,
  StockInfo,
  StockStatusBar,
  BuySellModal,
} from "@/components";
import { useLocation, useParams } from "react-router-dom";
import { ReactNode, useState } from "react";
import { useGetStockDetail, useGetTeamDetail } from "@/apis";
import { TradeHistory } from "@/db/type";
import { Toast } from "@mozu/ui";

export const StockPage = () => {
  const { stockId } = useParams();
  const ItemId = stockId ? parseInt(stockId) : null;

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "매수" | "매도";
    // stock: StockData | null;
  }>({
    isOpen: false,
    type: "매수",
    // stock: null,
  });

  const openModal = (type: "매수" | "매도" /* stock: StockData*/) => {
    setModalState({ isOpen: true, type /* stock */ });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleTradeConfirm = (trade: TradeHistory) => {
    if (trade.id) {
      // ID가 있으면 성공
      Toast(
        `성공적으로 ${trade.orderType === "BUY" ? "매수" : "매도"}되었습니다`,
        {
          type: "success",
        }
      );
    } else {
      Toast("거래 처리에 실패했습니다", { type: "error" });
    }
  };

  const { data: stockData } = useGetStockDetail(ItemId);
  const { data: teamData } = useGetTeamDetail();

  const location = useLocation();
  const componentRoute = (currentPath: string): ReactNode => {
    if (currentPath.includes("/price-info")) return <StockGraph />;
    if (currentPath.includes("/stock-info")) return <StockInfo />;
    return <p>404</p>;
  };

  return (
    <div>
      <Container>
        <StockStatusBar openModal={openModal} />
        <MainWrapper>
          <NavBar />
          <div>{componentRoute(location.pathname)}</div>
        </MainWrapper>
      </Container>
      {modalState.isOpen && (
        <BuySellModal
          invDeg={teamData.invDeg}
          itemId={stockData.itemId}
          itemName={stockData.itemName}
          onConfirm={handleTradeConfirm}
          nowMoney={stockData.moneyList[1]}
          modalType={modalState.type}
          onClose={closeModal}
          isOpen={modalState.isOpen}
          cashMoney={teamData.cashMoney}
        />
      )}
    </div>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 64px);
  width: 100%;
  padding: 40px;
  display: flex; 
  flex-direction: column;
  gap: 24px;
`;

const MainWrapper = styled.div`
  flex-grow: 1; /* 남은 공간을 차지하도록 설정 */
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  /* width: 100%; */
  > div:last-child {
    width: 100%;
  }
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.08); // 배경 흐림 효과
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
