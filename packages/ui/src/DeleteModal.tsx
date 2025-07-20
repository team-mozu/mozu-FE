import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Del } from "./assets";

interface IDeleteModal {
  titleComment: string;
  subComment: string;
  onCancel: () => void;
  onDelete: () => void;
  isPending: boolean;
  message?: string;
}

/**
 * DeleteModal 컴포넌트
 * @param titleComment 제목
 * @param subComment 설명
 * @param onCancel 취소 버튼 클릭 이벤트
 * @param onDelete 삭제 버튼 클릭 이벤트
 * @param message 버튼 텍스트 (기본값: "삭제하기")
 */
export const DeleteModal = ({
  titleComment,
  subComment,
  onCancel,
  onDelete,
  isPending,
  message = "삭제하기",
}: IDeleteModal) => {
  return (
    <Backdrop onClick={e => e.stopPropagation()}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <UpperContainer>
          <HeaderSection>
            <IconDiv>
              <Del
                size={24}
                color={color.red[400]}
              />
            </IconDiv>
            <TextDiv>
              <TitleText>{titleComment}</TitleText>
              <SubtitleText>{subComment}</SubtitleText>
            </TextDiv>
          </HeaderSection>
        </UpperContainer>

        <UnderContainer>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <DeleteButton
            onClick={onDelete}
            disabled={isPending}>
            {message}
          </DeleteButton>
        </UnderContainer>
      </ModalContainer>
    </Backdrop>
  );
};

const Backdrop = styled.div`
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
  padding: 20px;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 520px;
  min-height: 258px;
  border: 1px solid ${color.zinc[200]};
  background: ${color.white};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  position: relative;
  animation: modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${color.white}, transparent);
  }
  
  @keyframes modalSlideIn {
    from { 
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const UpperContainer = styled.div`
  padding: 32px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid ${color.zinc[100]};
  background: linear-gradient(135deg, ${color.white} 0%, ${color.zinc[25]} 100%);
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 16px;
`;

const UnderContainer = styled.div`
  padding: 20px 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: ${color.zinc[25]};
`;

const IconDiv = styled.div`
  width: 48px;
  height: 48px;
  border: 2px solid ${color.red[200]};
  background: linear-gradient(135deg, ${color.red[50]} 0%, ${color.red[50]} 100%);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg, ${color.red[200]}, ${color.red[100]});
    border-radius: 12px;
    z-index: -1;
  }
`;

const TextDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const TitleText = styled.h3`
  font: ${font.h4};
  color: ${color.zinc[900]};
  margin: 0;
  line-height: 1.4;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const SubtitleText = styled.p`
  font: ${font.b1};
  color: ${color.zinc[600]};
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
`;

const BaseButton = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.01em;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: translateY(1px);
  }
  
  &:hover {
    transform: scale(1.02);
  }
`;

const CancelButton = styled(BaseButton)`
  background: ${color.white};
  color: ${color.zinc[700]};
  border: 1px solid ${color.zinc[200]};
  
  &:hover {
    background: ${color.zinc[50]};
    border-color: ${color.zinc[300]};
    color: ${color.zinc[900]};
  }
`;

const DeleteButton = styled(BaseButton)`
  background: linear-gradient(135deg, ${color.red[500]} 0%, ${color.red[600]} 100%);
  color: ${color.white};
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
  }
  
  &:hover {
    background: linear-gradient(135deg, ${color.red[600]} 0%, ${color.red[700]} 100%);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
