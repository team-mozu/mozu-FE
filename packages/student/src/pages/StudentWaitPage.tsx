import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { color, font } from "@mozu/design-token";
import { Header, Users, Info, Toast } from "@mozu/ui";
import { useSSE } from "@/hook";
import { useNavigate } from "react-router-dom";
import { removeCookiesAsync } from "@configs/util";

export const StudentWaitPage = () => {
  const navigate = useNavigate();

  useSSE(
    `${import.meta.env.VITE_SERVER_URL}/team/sse`,
    (data) => {
      console.log(data);
      Toast('모의투자 시작을 기다리는중..', { type: "info" });
    },
    (error) => {
      console.log(error);
      Toast(`SSE 에러 발생: ${error.message}`, { type: "error" });
    },
    {
      CLASS_NEXT_INV_START: (data) => {
        localStorage.removeItem("trade");
        Toast("투자가 시작되었습니다", { type: "info" });
        navigate(`/${data.classId}`);
      },
      CLASS_CANCEL: async () => {
        Toast("수업이 취소되었습니다.", { type: "error" });

        const domain = import.meta.env.VITE_STUDENT_COOKIE_DOMAIN;
        await removeCookiesAsync(["accessToken", "authority"], {
          path: "/",
          secure: true,
          sameSite: "none",
          domain,
        });
        navigate("/signin");
      },
    }
  );

  return (
    <AppContainer>
      <Header isAdmin={false} />
      <Container>
        <MainSection>
          <IconDiv>
            <Users size={32} color="white" />
          </IconDiv>

          <ContentArea>
            <TextDiv>
              <p>모의투자 시작을 기다리는중...</p>
              <span>2024년도 모의투자</span>
            </TextDiv>

            <LoadingSection>
              <LoadingBar>
                <LoadingFill />
              </LoadingBar>
              <LoadingText>시스템 준비 중</LoadingText>
            </LoadingSection>
          </ContentArea>

          <InfoBox>
            <Info size={18} color={color.orange[600]} />
            모의투자가 시작되면 자동으로 투자 페이지로 넘어가요.
          </InfoBox>
        </MainSection>

        <DecorativeElements>
          <CircleElement top="10%" right="15%" size="120px" opacity="0.05" />
          <CircleElement top="70%" left="10%" size="80px" opacity="0.08" />
          <CircleElement bottom="20%" right="25%" size="100px" opacity="0.06" />
        </DecorativeElements>
      </Container>
    </AppContainer>
  );
};

// 애니메이션
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gentle_pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

const loading_fill = keyframes`
  0% {
    width: 0%;
  }
  50% {
    width: 70%;
  }
  100% {
    width: 100%;
  }
`;

const float_gentle = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// 스타일 컴포넌트
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fb923c 100%);
  position: relative;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 64px);
  position: relative;
  padding: 40px 20px;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  background: white;
  padding: 64px 48px;
  border-radius: 32px;
  box-shadow: 
    0 32px 64px rgba(251, 146, 60, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.8);
  max-width: 560px;
  width: 100%;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 6px;
    background: linear-gradient(90deg, ${color.orange[400]}, ${color.orange[600]});
    border-radius: 0 0 8px 8px;
  }
`;

const IconDiv = styled.div`
  width: 96px;
  height: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, ${color.orange[500]}, ${color.orange[600]});
  border-radius: 24px;
  box-shadow: 
    0 20px 40px rgba(251, 146, 60, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: ${gentle_pulse} 3s ease-in-out infinite;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    background: linear-gradient(135deg, ${color.orange[100]}, transparent);
    border-radius: 32px;
    z-index: -1;
    opacity: 0.5;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const TextDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  
  > p {
    font: ${font.h1};
    color: ${color.zinc[900]};
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.025em;
  }
  
  > span {
    font: ${font.h4};
    color: ${color.zinc[600]};
    margin: 0;
    font-weight: 400;
  }
`;

const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 300px;
`;

const LoadingBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${color.orange[100]};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const LoadingFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${color.orange[400]}, ${color.orange[500]});
  border-radius: 12px;
  animation: ${loading_fill} 4s ease-in-out infinite;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
    animation: ${float_gentle} 2s ease-in-out infinite;
  }
`;

const LoadingText = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
  font-weight: 500;
`;

const InfoBox = styled.p`
  font: ${font.b1};
  color: ${color.zinc[700]};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 20px 24px;
  background: ${color.orange[50]};
  border: 1px solid ${color.orange[200]};
  border-radius: 16px;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const DecorativeElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const CircleElement = styled.div<{ size: string; opacity: string; top?: string; bottom?: string; left?: string; right?: string; }>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  background: radial-gradient(circle, ${color.orange[400]} 0%, transparent 70%);
  border-radius: 50%;
  opacity: ${props => props.opacity};
  animation: ${float_gentle} 6s ease-in-out infinite;
  
  ${props => props.top && `top: ${props.top};`}
  ${props => props.bottom && `bottom: ${props.bottom};`}
  ${props => props.left && `left: ${props.left};`}
  ${props => props.right && `right: ${props.right};`}
`;

// 반응형 디자인
const MediaQuery = `
  @media (max-width: 768px) {
    ${MainSection} {
      padding: 48px 32px;
      gap: 40px;
      margin: 0 16px;
    }
    
    ${IconDiv} {
      width: 80px;
      height: 80px;
    }
    
    ${TextDiv} > p {
      font-size: 28px;
    }
    
    ${InfoBox} {
      font-size: 14px;
      padding: 16px 20px;
    }
  }
  
  @media (max-width: 480px) {
    ${MainSection} {
      padding: 40px 24px;
    }
    
    ${Container} {
      padding: 20px 16px;
    }
  }
`;