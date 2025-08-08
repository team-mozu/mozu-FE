import styled from "@emotion/styled";
import { font } from "@mozu/design-token";
import type { MouseEventHandler, ReactNode } from "react";
import { ArticleIcon, Cancel, ClassIcon, Del, Edit, LogOut, Plus, Save, Start } from "../assets";

interface IButtonType {
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
  type?:
    | "startImg"
    | "delImg"
    | "editImg"
    | "plusImg"
    | "saveImg"
    | "cancelImg"
    | "logOutImg"
    | "articleImg"
    | "classImg";
  isIcon?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  event?: MouseEventHandler<HTMLButtonElement>;
  onChange?: () => void;
  disabled?: boolean;
  width?: number;
}

export const Button = ({
  width = undefined,
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
  type = "startImg",
  onClick,
  onChange,
  isIcon = false,
  disabled = false,
  event,
}: IButtonType) => {
  const buttonIconType = {
    startImg: (
      <Start
        size={iconSize}
        color={iconColor}
      />
    ),
    delImg: (
      <Del
        size={iconSize}
        color={iconColor}
      />
    ),
    editImg: (
      <Edit
        size={iconSize}
        color={iconColor}
      />
    ),
    plusImg: (
      <Plus
        size={iconSize}
        color={iconColor}
      />
    ),
    saveImg: (
      <Save
        size={iconSize}
        color={iconColor}
      />
    ),
    cancelImg: (
      <Cancel
        size={iconSize}
        color={iconColor}
      />
    ),
    logOutImg: (
      <LogOut
        size={iconSize}
        color={iconColor}
      />
    ),
    articleImg: (
      <ArticleIcon
        size={iconSize}
        color={iconColor}
      />
    ),
    classImg: (
      <ClassIcon
        size={iconSize}
        color={iconColor}
      />
    ),
  };

  return (
    <ButtonContainer
      onChange={onChange}
      backgroundColor={backgroundColor}
      color={color}
      borderColor={borderColor}
      hoverBorderColor={hoverBorderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      hoverColor={hoverColor}
      activeBorderColor={activeBorderColor}
      activeBackgroundColor={activeBackgroundColor}
      activeColor={activeColor}
      onClick={event || onClick}
      disabled={disabled}
      width={width}>
      {children}
      {isIcon && buttonIconType[type]}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<IButtonType>`
  width: ${({ width }) => width}px;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  border: 1px solid ${props => props.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font: ${font.b1};

  &:hover {
    transition: 0.35s ease-in-out;
    background-color: ${props => props.hoverBackgroundColor || props.backgroundColor};
    color: ${props => props.hoverColor || props.color};
    border: 1px solid ${props => props.hoverBorderColor || props.borderColor};
  }

  &:active {
    background-color: ${props => props.activeBackgroundColor || props.backgroundColor};
    color: ${props => props.activeColor || props.color};
    border: 1px solid ${props => props.activeBorderColor || props.borderColor};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
