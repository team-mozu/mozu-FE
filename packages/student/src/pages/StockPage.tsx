import styled from '@emotion/styled';
import {
  NavBar,
  News,
  StockGraph,
  StockInfo,
  StockStatusBar,
} from '@/components';
import { color } from '@mozu/design-token';
import { useLocation } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { BuySellModal } from '@mozu/ui';

export const StockPage = () => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: '매수' | '매도';
    // stock: StockData | null;
  }>({
    isOpen: false,
    type: '매수',
    // stock: null,
  });

  const openModal = (type: '매수' | '매도' /* stock: StockData*/) => {
    setModalState({ isOpen: true, type /* stock */ });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };
  const location = useLocation();
  const componentRoute = (currentPath: string): ReactNode => {
    if (currentPath.includes('/price-info')) return <StockGraph />;
    if (currentPath.includes('/stock-info')) return <StockInfo />;
    if (currentPath.includes('/news')) return <News />;
    return <p>404</p>;
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container>
        <StockStatusBar openModal={openModal} />
        <MainWrapper>
          <NavBar />
          <MainContainer>{componentRoute(location.pathname)}</MainContainer>
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
  min-height: calc(100vh - 64px);
  padding: 40px 0;
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
  width: 100%;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  padding: 32px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 24px;
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
