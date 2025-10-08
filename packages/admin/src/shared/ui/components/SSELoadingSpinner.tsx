import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface SSELoadingSpinnerProps {
  isVisible: boolean;
}

export const SSELoadingSpinner = ({ isVisible }: SSELoadingSpinnerProps) => {
  if (!isVisible) return null;

  return (
    <LoadingOverlay>
      <LoadingContent>
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
        <LoadingText>서버 연결 중...</LoadingText>
        <SubText>실시간 모니터링 연결을 설정하고 있습니다.</SubText>
      </LoadingContent>
    </LoadingOverlay>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${color.zinc[200]};
  border-top: 3px solid ${color.orange[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.h2`
  font: ${font.h3};
  color: ${color.zinc[800]};
  margin: 0;
`;

const SubText = styled.p`
  font: ${font.l1};
  color: ${color.zinc[600]};
  margin: 0;
  max-width: 300px;
`;