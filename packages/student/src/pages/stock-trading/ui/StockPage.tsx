import styled from "@emotion/styled";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BuySellModal, StockStatusBar } from "@/features/stock-trading";
import { NavBar } from "@/shared/ui";

export const StockPage = () => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "매수" | "매도";
  }>({
    isOpen: false,
    type: "매수",
  });

  const openModal = (type: "매수" | "매도") => {
    setModalState({
      isOpen: true,
      type,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <div>
      <Container>
        <StockStatusBar openModal={openModal} />
        <MainWrapper>
          <NavBar />
          <Outlet />
        </MainWrapper>
      </Container>
      {modalState.isOpen && (
        <BuySellModal
          modalType={modalState.type}
          onClose={closeModal}
          isOpen={modalState.isOpen}
        />
      )}
    </div>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MainWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  width: 100%;
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
