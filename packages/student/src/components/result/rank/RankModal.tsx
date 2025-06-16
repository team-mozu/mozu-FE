import { useTeamRank, useTeamResult } from '@/apis';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, RankingDiv, Trophy } from '@mozu/ui';

interface IRankModal {
  onCancle: () => void;
  endRound?: number;
}

export const RankModal = ({ onCancle, endRound }: IRankModal) => {
  const { data: rankData } = useTeamRank();
  const { data: teamResult } = useTeamResult();

  return (
    <ModalBackdrop onClick={onCancle}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <IconDiv>
            <Trophy size={24} color={color.orange[500]} />
          </IconDiv>
          <TitleSection>
            {teamResult?.invDeg ?? 0 === endRound ? <Title>최종 모둠 랭킹</Title> : <Title>현재 모둠 랭킹</Title>}
            <Subtitle>실시간 모둠별 순위를 확인해보세요</Subtitle>
          </TitleSection>
        </Header>

        <RankingContainer>
          {rankData?.map((data, index) => (
            <RankingDiv key={index} rank={index + 1} teamName={data.name} schoolName={data.schoolName} price={data.totalMoney} />
          )) || (
              <LoadingWrapper>
                <LoadingSpinner />
                <LoadingText>랭킹 데이터를 불러오는 중...</LoadingText>
              </LoadingWrapper>
            )}
        </RankingContainer>

        <ButtonDiv>
          <Button
            onClick={onCancle}
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
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Container = styled.div`
  background: linear-gradient(135deg, ${color.white} 0%, ${color.zinc[50]} 100%);
  border: 1px solid ${color.zinc[200]};
  border-radius: 20px;
  width: 640px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: slideUp 0.3s ease-out;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font: ${font.h3};
  color: ${color.zinc[900]};
  margin: 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font: ${font.body2};
  color: ${color.zinc[600]};
  margin: 0;
`;

const RankingContainer = styled.div`
  height: 420px;
  border: 1px solid ${color.zinc[200]};
  background: ${color.white};
  border-radius: 16px;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${color.zinc[100]};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${color.zinc[300]};
    border-radius: 3px;
    
    &:hover {
      background: ${color.zinc[400]};
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${color.zinc[200]}, transparent);
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${color.zinc[200]};
  border-top: 3px solid ${color.orange[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font: ${font.body2};
  color: ${color.zinc[600]};
  margin: 0;
`;

const IconDiv = styled.div`
  width: 56px;
  height: 56px;
  border: 2px solid ${color.orange[300]};
  background: linear-gradient(135deg, ${color.orange[100]} 0%, ${color.orange[50]} 100%);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(251, 146, 60, 0.15);
  flex-shrink: 0;
  
  svg {
    color: ${color.orange[600]};
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;