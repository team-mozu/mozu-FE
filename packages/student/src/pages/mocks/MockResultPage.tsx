import styled from "@emotion/styled";
import { font } from "@mozu/design-token";
import { useState } from "react";
import { RankModal } from "@/features/ranking-view";
import { ResultContainer } from "@/shared/ui";

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  position: string;
}

// 커스텀 확인 모달 컴포넌트
const CustomConfirmModal = ({ isOpen, onConfirm, onCancel, message, position }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer position={position}>
        <ModalContent>
          <Message>{message}</Message>
          <ButtonContainer>
            <CancelButton onClick={onCancel}>취소</CancelButton>
            <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export const MockResultPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);

  // Mock 데이터
  const mockEndRound = 5; // 예시 종료 회차

  const confirmSteps = [
    {
      message: "[MOCK] 정말 나가시겠습니까?\n\n나가시면 재접속 불가합니다",
      position: "center",
    },
    {
      message: "[MOCK] 한 번 더 확인합니다.\n\n정말로 나가시겠습니까?",
      position: "top-left",
    },
    {
      message: "[MOCK] 마지막 확인입니다.\n\n나가시면 결과를 다시 볼 수 없습니다!",
      position: "top-right",
    },
    {
      message: "[MOCK] 정말 마지막입니다.\n\n진짜로 나가시겠습니까?",
      position: "bottom-left",
    },
    {
      message: "[MOCK] 최종 확인!\n\n이제 정말 나가시겠습니까?",
      position: "bottom-right",
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirmStep = () => {
    if (confirmStep < confirmSteps.length - 1) {
      setConfirmStep(confirmStep + 1);
    } else {
      setIsConfirming(false);
      alert("[MOCK] 모의 결과 페이지를 나갑니다."); // 실제 navigate 대신 alert
      setConfirmStep(0);
    }
  };

  const handleCancelStep = () => {
    setIsConfirming(false);
    setConfirmStep(0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <ResultContainer
        onRankClick={handleOpenModal}
        endRound={mockEndRound}
      />
      {isModalOpen && (
        <RankModal
          onCancle={handleCloseModal}
          endRound={mockEndRound}
        />
      )}

      <CustomConfirmModal
        isOpen={isConfirming}
        onConfirm={handleConfirmStep}
        onCancel={handleCancelStep}
        message={confirmSteps[confirmStep]?.message}
        position={confirmSteps[confirmStep]?.position}
      />
    </Container>
  );
};

// 스타일 컴포넌트들 (ResultPage.tsx에서 복사)
const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  z-index: 9999;
`;

const ModalContainer = styled.div<{
  position: string;
}>`
  position: absolute;

  ${({ position }) => {
    switch (position) {
      case "top-left":
        return `
          top: 50px;
          left: 50px;
        `;
      case "top-right":
        return `
          top: 50px;
          right: 50px;
        `;
      case "bottom-left":
        return `
          bottom: 50px;
          left: 50px;
        `;
      case "bottom-right":
        return `
          bottom: 50px;
          right: 50px;
        `;
      case "center":
      default:
        return `
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `;
    }
  }}
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
`;

const Message = styled.div`
  margin-bottom: 20px;
  font: ${font.b1};
  white-space: pre-line;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font: ${font.b2};
  transition: background-color 0.2s;
`;

const CancelButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #ff4444;
  color: white;

  &:hover {
    background-color: #cc3333;
  }
`;
