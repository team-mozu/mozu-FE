import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button } from '@mozu/ui';
import { useNavigate } from 'react-router';

export const ClassMonitoringPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Header>
        <TitleContainer>
          <Title>모의투자 현황</Title>
          <SubTitle>2024년도 모의투자 | 10일 전 사용</SubTitle>
        </TitleContainer>
        <ButtonContainer>
          <Button
            type={'logOutImg'}
            isIcon={true}
            iconColor={color.zinc[800]}
            iconSize={24}
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            color={color.zinc[800]}
            onClick={() => navigate(-1)}
          >
            모의투자 취소
          </Button>
          <Button
            type={'startImg'}
            isIcon={true}
            iconColor={color.white}
            iconSize={24}
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
          >
            다음 투자 진행
          </Button>
        </ButtonContainer>
      </Header>
      <MainContainer>
        <p>
          <span>3차 투자</span>
          진행중
        </p>
        <InfoContainer>
          <ClassInfo>
            <p>
              투자 차수 <span>5차</span>
            </p>
            <span>|</span>
            <p>
              기초자산 <span>1,000,000</span>
            </p>
          </ClassInfo>
          <InfoBtn>
            <Button
              type={'articleImg'}
              isIcon={true}
              color={color.zinc[800]}
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              iconColor={color.zinc[800]}
              iconSize={24}
            >
              기사정보
            </Button>
            <Button
              type={'classImg'}
              isIcon={true}
              color={color.zinc[800]}
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              iconColor={color.zinc[800]}
              iconSize={24}
            >
              투자정보
            </Button>
          </InfoBtn>
        </InfoContainer>
        <TableContainer></TableContainer>
      </MainContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.p`
  font: ${font.h2};
  color: ${color.black};
`;

const SubTitle = styled.p`
  font: ${font.b1};
  color: ${color.zinc[500]};
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  > p {
    font: ${font.h4};
    color: ${color.zinc[600]};
    display: flex;
    gap: 12px;
    align-items: center;
  }
  > p > span {
    font: ${font.h3};
    color: ${color.orange[500]};
  }
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ClassInfo = styled.div`
  display: flex;
  gap: 1rem;
  padding: 12px 24px;
  background-color: ${color.zinc[100]};
  border: none;
  border-radius: 8px;
  > p {
    font: ${font.b1};
    color: ${color.zinc[600]};
  }
  > p > span {
    font: ${font.b1};
    color: ${color.black};
  }
`;

const InfoBtn = styled.div`
  display: flex;
  gap: 12px;
`;

const TableContainer = styled.div``;
