import { React } from 'react';
import styled from '@emotion/styled';
import { color } from '@mozu/design-token';

type ButtonType = {
  children?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
};

export const Button = ({
  children,
  backgroundColor,
  color,
  borderColor,
}: ButtonType) => {
  return (
    <ButtonContainer
      backgroundColor={backgroundColor}
      color={color}
      borderColor={borderColor}
    >
      {children}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<Omit<ButtonType, 'children'>>`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
