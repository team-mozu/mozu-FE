import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, HandCoins, Trophy } from '@mozu/ui';
import { NthDeal, AssetChange } from '@/components';

interface ValueStyleProps {
  isPositive: boolean;
}

export const ResultContainer = () => {
  return (
    <Container>
      <Title>
        <Logo>
          <HandCoins size={24} color={color.orange[500]} />
        </Logo>
        <p>3차 투자 종료</p>
      </Title>
      <Main>
        <Transaction>
          <label>거래내역</label>
          <NthDeal />
        </Transaction>
        <RightContainer>
          <Result>
            <label>결과 요약</label>
            <AssetChange />
            <Sub>
              <Proceeds isPositive={true}>
                <label>수익금</label>
                <p>+850,000원</p>
              </Proceeds>
              <Return isPositive={true}>
                <label>수익률</label>
                <p>+85%</p>
              </Return>
              <TotalDeal>
                <label>총 거래 횟수</label>
                <p>3회</p>
              </TotalDeal>
            </Sub>
          </Result>
          <ButtonDiv>
            <Button
              borderColor={color.orange[200]}
              backgroundColor={color.orange[50]}
              color={color.orange[500]}
              width={205}
            >
              현재 랭킹 보기
              <Trophy size={24} color={color.orange[500]} />
            </Button>
            <Button
              backgroundColor={color.orange[500]}
              color={color.white}
              width={205}
              isIcon={true}
              iconColor={color.white}
              iconSize={24}
            >
              계속하기
            </Button>
          </ButtonDiv>
        </RightContainer>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  width: 848px;
  height: 780px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 24px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  > p {
    font: ${font.h3};
    color: ${color.black};
  }
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${color.orange[50]};
  border: 1px solid ${color.orange[200]};
  border-radius: 8px;
`;

const Main = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  gap: 8px;
`;

const Transaction = styled.div`
  width: 100%;
  background-color: ${color.white};
  border-radius: 24px;
  border: 1px solid ${color.zinc[200]};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  > label {
    font: ${font.t2};
    color: ${color.black};
  }
`;

const RightContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Result = styled.div`
  height: 100%;
  background-color: ${color.white};
  border-radius: 24px;
  padding: 32px;
  border: 1px solid ${color.zinc[200]};
  display: flex;
  flex-direction: column;
  gap: 32px;
  > label {
    font: ${font.t2};
    color: ${color.black};
  }
`;

const ButtonDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;

const Sub = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Proceeds = styled.div<ValueStyleProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font: ${font.b2};
  color: ${color.zinc[600]};
  > p {
    font: ${font.t3};
    color: ${({ isPositive }) =>
      isPositive ? color.red[500] : color.blue[500]}; // 🔥 조건부 색상
  }
`;

const Return = styled.div<ValueStyleProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font: ${font.b2};
  color: ${color.zinc[600]};
  > p {
    font: ${font.t3};
    color: ${({ isPositive }) =>
      isPositive ? color.red[500] : color.blue[500]}; // 🔥 조건부 색상
  }
`;

const TotalDeal = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font: ${font.b2};
  color: ${color.zinc[600]};
  > p {
    font: ${font.t3};
    color: ${color.black};
  }
`;
