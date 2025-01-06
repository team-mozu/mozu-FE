import { React } from 'react';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Del, Edit, Plus, Save, Start } from './assets';

type ButtonType = {
  children?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  iconSize?: number;
  iconColor?: string;
  type?: 'startImg' | 'delImg' | 'editImg' | 'plusImg' | 'saveImg';
  isIcon?: boolean;
};

export const Button = ({
  children,
  backgroundColor,
  color,
  borderColor,
  iconSize,
  iconColor,
  type = 'startImg',
  isIcon = false,
}: ButtonType) => {
  const buttonIconType = {
    startImg: <Start size={iconSize} color={iconColor} />,
    delImg: <Del size={iconSize} color={iconColor} />,
    editImg: <Edit size={iconSize} color={iconColor} />,
    plusImg: <Plus size={iconSize} color={iconColor} />,
    saveImg: <Save size={iconSize} color={iconColor} />,
  };

  return (
    <ButtonContainer
      backgroundColor={backgroundColor}
      color={color}
      borderColor={borderColor}
    >
      {children}
      {isIcon && buttonIconType[type]}
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
  gap: 6px;
  font: ${font.b1};
`;
