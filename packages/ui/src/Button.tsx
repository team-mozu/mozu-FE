import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Del, Edit, Plus, Save, Start } from '.';
import { ReactNode } from 'react';

type ButtonType = {
  children?: ReactNode;
  backgroundColor?: string;
  color?: string;
  hoverBorderColor?: string;
  hoverBackgroundColor?: string;
  hoverColor?: string;
  activeBorderColor?: string;
  activeBackgroundColor?: string;
  activeColor?: string;
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
  hoverBorderColor,
  hoverBackgroundColor,
  hoverColor,
  activeBorderColor,
  activeBackgroundColor,
  activeColor,
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
      hoverBorderColor={hoverBorderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      hoverColor={hoverColor}
      activeBorderColor={activeBorderColor}
      activeBackgroundColor={activeBackgroundColor}
      activeColor={activeColor}
    >
      {children}
      {isIcon && buttonIconType[type]}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<ButtonType>`
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
  &:hover {
    background-color: ${(props) =>
    props.hoverBackgroundColor || props.backgroundColor};
    color: ${(props) => props.hoverColor || props.color};
    border: 1px solid ${(props) => props.hoverBorderColor || props.borderColor};
  }
  &:active {
    background-color: ${(props) =>
    props.activeBackgroundColor || props.backgroundColor};
    color: ${(props) => props.activeColor || props.color};
    border: 1px solid ${(props) => props.activeBorderColor || props.borderColor};
  }
`;
