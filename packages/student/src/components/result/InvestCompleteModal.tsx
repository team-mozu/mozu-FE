import { useTeamEnd } from "@/apis";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { color, font } from "@mozu/design-token";
import { Check, Button, Toast } from "@mozu/ui";
import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAsyncButton } from "@/hook";

interface IInvestCompleteType {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InvestCompleteModal = ({ isOpen, setIsOpen }: IInvestCompleteType) => {
  const navigate = useNavigate();
  const outSideRef = useRef<HTMLDivElement | null>(null);
  const { classId } = useParams();
  const { mutate: teamEnd } = useTeamEnd({
    onSuccess: () => {
      Toast("투자 완료에 성공하였습니다", { type: "success" });
      setIsOpen(false);
      navigate(`/${classId}/result`);
    },
    onError: () => {
      Toast("투자 완료에 실패하였습니다", { type: "error" });
    },
  });

  useEffect(() => {
    const outSideClick = (e: MouseEvent) => {
      if (outSideRef.current && outSideRef.current === e.target) {
        setIsOpen?.(false);
      }
    };
    if (isOpen) {
      document.addEventListener("click", outSideClick);
    }
    return () => {
      document.removeEventListener("click", outSideClick);
    };
  }, [isOpen, setIsOpen]);

  const invDeg = () => {
    try {
      const tradeData = localStorage.getItem("trade");
      if (!tradeData) {
        Toast("거래 내역이 없습니다. 최소 한 번 거래한 뒤 시도해주세요.", { type: "error" });
        setIsOpen(false);
        return;
      }

      const parsedHistory = JSON.parse(tradeData);

      const isValidData = Array.isArray(parsedHistory) && parsedHistory.every(
        (item) => item.itemId && item.itemName && item.itemMoney &&
          item.orderCount !== undefined && item.totalMoney && item.orderType
      );

      if (!isValidData) {
        Toast("저장된 거래 데이터가 유효하지 않습니다. 거래를 다시 진행해 주세요.", { type: "error" });
        setIsOpen(false);
        return;
      }

      teamEnd(parsedHistory);
    } catch (e) {
      console.error("localStorage 파싱 오류:", e);
      Toast("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.", { type: "error" });
      setIsOpen?.(false);
    }
  };

  const { onClick, isLoading, disabled } = useAsyncButton(invDeg, 5000);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionBackdrop
          ref={outSideRef}
          onClick={() => setIsOpen?.(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <MotionModalContainer
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <CloseButton onClick={() => setIsOpen?.(false)}>
              <CloseIcon>✕</CloseIcon>
            </CloseButton>

            <ContentContainer>
              <IconSection>
                <IconWrapper>
                  <IconBackground />
                  <CheckIconContainer>
                    <Check color={color.orange[500]} size={28} />
                  </CheckIconContainer>
                  <IconGlow />
                </IconWrapper>
              </IconSection>

              <TextSection>
                <MainTitle>투자를 완료하실 건가요?</MainTitle>
                <SubTitle>
                  <WarningIcon>⚠️</WarningIcon>
                  투자를 완료하면 주문을 변경할 수 없어요.
                </SubTitle>
                <InfoCard>
                  <InfoIcon>📊</InfoIcon>
                  <InfoText>
                    모든 거래 내역이 확정되며<br />
                    결과 페이지로 이동합니다
                  </InfoText>
                </InfoCard>
              </TextSection>
            </ContentContainer>

            <ActionSection>
              <CancelButton onClick={() => setIsOpen?.(false)}>
                <ButtonIcon>❌</ButtonIcon>
                취소
              </CancelButton>
              <ConfirmButton onClick={onClick} disabled={disabled}>
                {isLoading ? "로딩 중..." : (
                  <>
                    <ButtonIcon>🚀</ButtonIcon>
                    투자 완료하기
                    <ButtonShine />
                  </>
                )}
              </ConfirmButton>
            </ActionSection>
          </MotionModalContainer>
        </MotionBackdrop>
      )}
    </AnimatePresence>
  );
};

// 애니메이션 키프레임
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const shine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const slideInUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
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
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const MotionModalContainer = styled(motion.div)`
  background: linear-gradient(145deg, ${color.white} 0%, ${color.zinc[50]} 100%);
  border-radius: 24px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 
    0 32px 64px -12px rgba(0, 0, 0, 0.25),
    0 16px 32px -8px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CloseIcon = styled.span`
  font-size: 16px;
  color: ${color.zinc[600]};
  font-weight: bold;
`;

const ContentContainer = styled.div`
  padding: 50px 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconSection = styled.div`
  margin-bottom: 32px;
  position: relative;
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;
`;

const IconBackground = styled.div`
  position: absolute;
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, ${color.orange[50]} 0%, ${color.orange[100]} 100%);
  border-radius: 50%;
  border: 2px solid ${color.orange[200]};
`;

const CheckIconContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const IconGlow = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, ${color.orange[300]}40 0%, transparent 70%);
  border-radius: 50%;
  animation: ${glow} 2s ease-in-out infinite;
  z-index: 1;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const MainTitle = styled.div`
  font: ${font.h3};
  font-weight: 700;
  color: ${color.zinc[900]};
  animation: ${slideInUp} 0.6s ease-out;
`;

const SubTitle = styled.div`
  font: ${font.l1};
  color: ${color.orange[600]};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${slideInUp} 0.6s ease-out 0.1s both;
`;

const WarningIcon = styled.span`
  font-size: 18px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, ${color.zinc[50]} 0%, ${color.white} 100%);
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${slideInUp} 0.6s ease-out 0.2s both;
`;

const InfoIcon = styled.span`
  font-size: 24px;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font: ${font.l2};
  color: ${color.zinc[600]};
  line-height: 1.5;
  text-align: left;
`;

const ActionSection = styled.div`
  padding: 24px 40px 40px;
  display: flex;
  gap: 16px;
  background: linear-gradient(to bottom, transparent 0%, ${color.zinc[25]} 100%);
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: 2px solid ${color.zinc[200]};
  background: ${color.white};
  color: ${color.zinc[700]};
  border-radius: 16px;
  font: ${font.b1};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${color.zinc[50]};
    border-color: ${color.zinc[300]};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ConfirmButton = styled.button`
  flex: 2;
  padding: 16px 24px;
  border: none;
  background: linear-gradient(135deg, ${color.orange[500]} 0%, ${color.orange[600]} 100%);
  color: ${color.white};
  border-radius: 16px;
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
  box-shadow: 0 8px 25px rgba(255, 153, 51, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 153, 51, 0.4);
    background: linear-gradient(135deg, ${color.orange[600]} 0%, ${color.orange[700]} 100%);
  }
  
  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const ButtonIcon = styled.span`
  font-size: 16px;
`;

const ButtonShine = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: ${shine} 2s ease-in-out infinite;
`;