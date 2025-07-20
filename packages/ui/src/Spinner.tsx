import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const Spinner = ({ size }: { size: number }) => {
  return <_Spinner size={size} />;
};

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const _Spinner = styled.div<{
  size: number;
}>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f97316;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
