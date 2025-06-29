import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useRef, useCallback, useEffect } from "react";
import { HoldStockTable } from "@/components";
import { useGetTeamHoldItems } from "@/apis";
// import { useMyHoldings } from "@/apis";

export const TeamCurrentModal = ({
  isOpen,
  setIsOpen,
  id,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id: number;
}) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (backgroundRef.current === e.target) {
        setIsOpen(false);
      }
    },
    [setIsOpen]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);


  const { data: holdItems } = useGetTeamHoldItems(id);

  const totalValuation = holdItems?.reduce((sum, item) => sum + item.valMoney, 0) ?? 0;

  return (
    isOpen && (
      <BackgroundContainer ref={backgroundRef} onClick={handleBackgroundClick}>
        <ModalContainer>
          <ContentContainer>
            <TitleContainer>
              <TitleSection>
                <Title>보유 주식 현황</Title>
                <Subtitle>현재 보유 중인 주식 내역</Subtitle>
              </TitleSection>
              <CloseButton onClick={handleClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </CloseButton>
            </TitleContainer>

            <TableContainer>
              <HoldStockTable holdItems={holdItems || []} />
            </TableContainer>

            <FooterContainer>
              <FooterStats>
                <StatItem>
                  <StatLabel>총 보유 종목</StatLabel>
                  <StatValue>{holdItems?.length || 0} 종목</StatValue>
                </StatItem>
                <StatDivider />
                <StatItem>
                  <StatLabel>총 평가 금액</StatLabel>
                  <StatValue>{totalValuation.toLocaleString()} 원</StatValue>
                </StatItem>
              </FooterStats>

              <FooterActions>
                <ActionButton variant="secondary" onClick={handleClose}>
                  닫기
                </ActionButton>
              </FooterActions>
            </FooterContainer>
          </ContentContainer>
        </ModalContainer>
      </BackgroundContainer>
    )
  );
};

const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 1080px;
  max-height: 90vh;
  border-radius: 24px;
  background: ${color.white};
  box-shadow: 
    0 32px 64px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  animation: modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  }
  
  @keyframes modalSlideIn {
    from { 
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    to { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  padding: 32px 32px 24px;
  border-bottom: 1px solid ${color.zinc[100]};
  background: linear-gradient(135deg, ${color.white} 0%, ${color.zinc[25]} 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font: ${font.t2};
  color: ${color.zinc[900]};
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  font: ${font.b2};
  color: ${color.zinc[500]};
  margin: 0;
  font-weight: 400;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${color.zinc[600]};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.95);
    color: ${color.zinc[900]};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 24px 28px;
  background: ${color.zinc[25]};
  position: relative;
  
  > div {
    max-height: 100%;
    overflow-y: auto;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${color.zinc[100]};
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${color.zinc[300]};
      border-radius: 4px;
      
      &:hover {
        background: ${color.zinc[400]};
      }
    }
  }
`;

const FooterContainer = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${color.zinc[100]};
  background: ${color.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

const FooterStats = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  font: ${font.b2};
  color: ${color.zinc[500]};
  font-weight: 500;
`;

const StatValue = styled.span`
  font: ${font.b2};
  color: ${color.zinc[900]};
  font-weight: 600;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${color.zinc[200]};
`;

const FooterActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.01em;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
  
  ${({ variant }) => variant === 'secondary' && `
    background: ${color.zinc[50]};
    color: ${color.zinc[700]};
    border: 1px solid ${color.zinc[200]};
    
    &:hover {
      background: ${color.zinc[100]};
      border-color: ${color.zinc[300]};
      color: ${color.zinc[900]};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;