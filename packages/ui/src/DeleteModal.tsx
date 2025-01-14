import styled from '@emotion/styled';
import { Del } from './assets';
import { color, font } from '@mozu/design-token';
import { Button } from './Button';

interface IDeleteModal {
  titleComment: string;
  subComment: string;
  onCancel: () => void;
  onDelete: () => void;
}

export const DeleteModal = ({
  titleComment,
  subComment,
  onCancel,
  onDelete,
}: IDeleteModal) => {
  return (
    <ModalBackdrop onClick={onCancel}>
      <DeleteModalContainer onClick={(e) => e.stopPropagation()}>
        <UpperContainer>
          <IconDiv>
            <Del size={24} color={color.red[500]} />
          </IconDiv>
          <TextDiv>
            <TitleText>{titleComment}</TitleText>
            <SubtitleText>{subComment}</SubtitleText>
          </TextDiv>
        </UpperContainer>
        <UnderContainer>
          <div onClick={onCancel}>
            <Button
              backgroundColor={color.zinc[50]}
              color={color.zinc[800]}
              borderColor={color.zinc[200]}
            >
              취소
            </Button>
          </div>
          <div onClick={onDelete}>
            <Button backgroundColor={color.red[500]} color={color.white}>
              삭제하기
            </Button>
          </div>
        </UnderContainer>
      </DeleteModalContainer>
    </ModalBackdrop>
  );
};

const ModalBackdrop = styled.div`
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

const DeleteModalContainer = styled.div`
  width: 480px;
  height: 258px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
  border-radius: 1rem;
`;

const UpperContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid ${color.zinc[200]};
`;

const UnderContainer = styled.div`
  padding: 12px;
  display: flex;
  justify-content: end;
  gap: 10px;
`;

const IconDiv = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid ${color.red[200]};s
  background-color: ${color.red[50]};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleText = styled.p`
  font: ${font.h4};
  color: ${color.black};
  width: 60%;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: keep-all;
`;

const SubtitleText = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;
