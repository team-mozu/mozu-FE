import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Check, Toast } from "@mozu/ui";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeamEnd } from "@/entities/user";

interface IInvestCompleteType {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

// 메모이제이션된 아이콘 컴포넌트
const CheckIcon = memo(() => (
  <CheckIconContainer>
    <Check
      color={color.orange[500]}
      size={28}
    />
  </CheckIconContainer>
));

// 메모이제이션된 로딩 스피너
const LoadingSpinner = memo(() => <Spinner />);

export const InvestCompleteModal = memo(({ isOpen, setIsOpen }: IInvestCompleteType) => {
  const navigate = useNavigate();
  const outSideRef = useRef<HTMLDivElement | null>(null);
  const { classId } = useParams();

  const { mutate: teamEnd, isPending: isTeamEndPending } = useTeamEnd({
    onSuccess: () => {
      localStorage.removeItem("trade");

      Toast("투자 완료에 성공하였습니다", {
        type: "success",
      });
      setIsOpen?.(false);
      navigate(`/${classId}/result`);
    },
    onError: () => {
      Toast("투자 완료에 실패하였습니다", {
        type: "error",
      });
    },
  });

  // 메모이제이션된 클릭 핸들러들
  const handleClose = useCallback(() => {
    setIsOpen?.(false);
  }, [
    setIsOpen,
  ]);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (outSideRef.current && outSideRef.current === e.target) {
        handleClose();
      }
    },
    [
      handleClose,
    ],
  );

  const handleInvestComplete = useCallback(() => {
    try {
      const tradeData = localStorage.getItem("trade");
      if (!tradeData) {
        Toast("거래 내역이 없습니다. 최소 한 번 거래한 뒤 시도해주세요.", {
          type: "error",
        });
        handleClose();
        return;
      }

      const parsedHistory = JSON.parse(tradeData);
      const isValidData =
        Array.isArray(parsedHistory) &&
        parsedHistory.every(
          item =>
            item.itemId &&
            item.itemName &&
            item.itemPrice &&
            item.orderCount !== undefined &&
            item.orderType &&
            item.totalMoney,
        );

      if (!isValidData) {
        Toast("저장된 거래 데이터가 유효하지 않습니다. 거래를 다시 진행해 주세요.", {
          type: "error",
        });
        handleClose();
        return;
      }

      teamEnd(parsedHistory);
    } catch (e) {
      console.error("localStorage 파싱 오류:", e);
      Toast("알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.", {
        type: "error",
      });
      handleClose();
    }
  }, [
    teamEnd,
    handleClose,
  ]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
      // 모달 열릴 때 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.body.style.overflow = "unset";
    };
  }, [
    isOpen,
    handleOutsideClick,
  ]);

  // 최적화된 애니메이션 설정
  const backdropVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <MotionBackdrop
          ref={outSideRef}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            duration: 0.2,
          }}>
          <MotionModalContainer
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}>
            <CloseButton
              onClick={handleClose}
              disabled={isTeamEndPending}>
              <CloseIcon>✕</CloseIcon>
            </CloseButton>

            <ContentContainer>
              <IconSection>
                <IconWrapper>
                  <IconBackground />
                  <CheckIcon />
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
                    모든 거래 내역이 확정되며
                    <br />
                    결과 페이지로 이동합니다
                  </InfoText>
                </InfoCard>
              </TextSection>
            </ContentContainer>

            <ActionSection>
              <CancelButton
                onClick={handleClose}
                disabled={isTeamEndPending}>
                <ButtonIcon>❌</ButtonIcon>
                취소
              </CancelButton>
              <ConfirmButton
                onClick={handleInvestComplete}
                disabled={isTeamEndPending}>
                {isTeamEndPending ? (
                  <>
                    <LoadingSpinner />
                    처리 중...
                  </>
                ) : (
                  <>
                    <ButtonIcon>🚀</ButtonIcon>
                    투자 완료하기
                  </>
                )}
              </ConfirmButton>
            </ActionSection>
          </MotionModalContainer>
        </MotionBackdrop>
      )}
    </AnimatePresence>
  );
});

// 최적화된 애니메이션 - GPU 가속 사용
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// 스타일 컴포넌트들 - will-change 속성 추가로 GPU 가속 최적화
const MotionBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  will-change: opacity;
`;

const MotionModalContainer = styled(motion.div)`
  background: linear-gradient(145deg, ${color.white} 0%, ${color.zinc[50]} 100%);
  border-radius: 20px;
  width: 480px;
  max-width: 90vw;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  border: 1px solid ${color.zinc[200]};
  will-change: transform, opacity;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
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
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CloseIcon = styled.span`
  font-size: 14px;
  color: ${color.zinc[600]};
  font-weight: bold;
`;

const ContentContainer = styled.div`
  padding: 40px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconSection = styled.div`
  margin-bottom: 24px;
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const IconBackground = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${color.orange[100]} 0%, ${color.orange[200]} 100%);
  border-radius: 50%;
  border: 2px solid ${color.orange[300]};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const CheckIconContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const MainTitle = styled.h2`
  font: ${font.h3};
  font-weight: 700;
  color: ${color.zinc[900]};
  margin: 0;
`;

const SubTitle = styled.div`
  font: ${font.l1};
  color: ${color.orange[600]};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const WarningIcon = styled.span`
  font-size: 16px;
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, ${color.zinc[50]} 0%, ${color.white} 100%);
  border: 1px solid ${color.zinc[200]};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font: ${font.l2};
  color: ${color.zinc[600]};
  line-height: 1.4;
  text-align: left;
`;

const ActionSection = styled.div`
  padding: 20px 32px 32px;
  display: flex;
  gap: 12px;
  background: ${color.zinc[50]};
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: 2px solid ${color.zinc[200]};
  background: ${color.white};
  color: ${color.zinc[700]};
  border-radius: 12px;
  font: ${font.b1};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    background: ${color.zinc[50]};
    border-color: ${color.zinc[300]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ConfirmButton = styled.button`
  flex: 2;
  padding: 12px 20px;
  border: none;
  background: linear-gradient(135deg, ${color.orange[500]} 0%, ${color.orange[600]} 100%);
  color: ${color.white};
  border-radius: 12px;
  font: ${font.b1};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${color.orange[600]} 0%, ${color.orange[700]} 100%);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: ${color.zinc[400]};
  }
`;

const ButtonIcon = styled.span`
  font-size: 14px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid ${color.white};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  flex-shrink: 0;
`;
