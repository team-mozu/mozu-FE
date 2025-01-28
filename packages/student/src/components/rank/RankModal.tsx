import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, RankingDiv, Trophy } from '@mozu/ui';

interface IRankModal {
  onCancle: () => void;
}

export const RankModal = ({ onCancle }: IRankModal) => {
  return (
    <ModalBackdrop onClick={onCancel}>
      <Container onClick={(e) => e.stopPropagation()}>
        <IconDiv>
          <Trophy size={24} color={color.orange[500]} />
        </IconDiv>
        <p>현재 모둠 랭킹</p>
        <RankingContainer>
          <RankingDiv
            rank={1}
            teamName="동욱쌤 제자들"
            schoolName="대덕소프트웨어마이스터고등학교"
            price={1400000}
          />
          <RankingDiv
            rank={2}
            teamName="동욱쌤 제자들"
            schoolName="대덕소프트웨어마이스터고등학교"
            price={1400000}
          />
          <RankingDiv
            rank={3}
            teamName="동욱쌤 제자들"
            schoolName="대덕소프트웨어마이스터고등학교"
            price={1400000}
          />
          <RankingDiv
            rank={4}
            teamName="동욱쌤 제자들"
            schoolName="대덕소프트웨어마이스터고등학교"
            price={1400000}
          />
        </RankingContainer>
        <ButtonDiv onClick={onCancle}>
          <Button
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
          >
            닫기
          </Button>
        </ButtonDiv>
      </Container>
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

const Container = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  width: 580px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 12px;
  > p {
    font: ${font.t2};
    color: ${color.black};
  }
`;

const RankingContainer = styled.div`
  margin: 8px;
  padding: 8px;
  height: 400px;
  border: 1px solid ${color.zinc[100]};
  background-color: ${color.zinc[50]};
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  gap: 8px;
`;

const IconDiv = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid ${color.orange[200]};
  background-color: ${color.orange[50]};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  padding-right: 12px;
`;
