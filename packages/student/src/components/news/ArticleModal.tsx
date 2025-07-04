import { NewsDetail } from "./NewsDetail";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface ArticleModalProps {
  article: any;
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ArticleModal({ article, total, current, onPrev, onNext, onClose, isFirst, isLast }: ArticleModalProps) {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <NewsDetail
          img={article.image || ""}
          title={article.title || ""}
          main={article.description || ""}
        />
        <StepperWrapper>
          {Array.from({ length: total }).map((_, idx) => (
            <StepCircle key={idx} active={idx === current} />
          ))}
        </StepperWrapper>
        <ModalButtonRow>
          <ModalButton onClick={onPrev} disabled={isFirst}>
            이전
          </ModalButton>
          {!isLast ? (
            <ModalButton onClick={onNext}>다음</ModalButton>
          ) : (
            <ModalButton onClick={onClose}>마침</ModalButton>
          )}
        </ModalButtonRow>
      </ModalContainer>
    </ModalBackdrop>
  );
}

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: ${color.white};
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 40px 32px 32px 32px;
  min-width: 600px;
  min-height: 480px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
`;

const ModalButton = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  font: ${font.b1};
  background: ${color.zinc[100]};
  color: ${color.zinc[800]};
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: ${color.zinc[200]};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StepperWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
`;

const StepCircle = styled.div<{ active: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ active }) => (active ? color.blue[500] : color.zinc[200])};
  border: 2px solid ${({ active }) => (active ? color.blue[500] : color.zinc[200])};
  transition: background 0.2s, border 0.2s;
`; 