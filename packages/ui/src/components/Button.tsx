import { forwardRef } from "react";
import {
  ArticleIcon,
  Cancel,
  ClassIcon,
  Del,
  Edit,
  LogOut,
  Plus,
  Save,
  Start,
} from "../assets";
import { ButtonContainer } from "./styles";
import type { ButtonProps, ButtonType } from "./types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
      width,
    },
    ref
  ) => {
    const buttonIconType: Record<ButtonType, JSX.Element> = {
      startImg: <Start size={iconSize} color={iconColor} />,
      delImg: <Del size={iconSize} color={iconColor} />,
      editImg: <Edit size={iconSize} color={iconColor} />,
      plusImg: <Plus size={iconSize} color={iconColor} />,
      saveImg: <Save size={iconSize} color={iconColor} />,
      cancelImg: <Cancel size={iconSize} color={iconColor} />,
      logOutImg: <LogOut size={iconSize} color={iconColor} />,
      articleImg: <ArticleIcon size={iconSize} color={iconColor} />,
      classImg: <ClassIcon size={iconSize} color={iconColor} />,
    };

    return (
      <ButtonContainer
        ref={ref}
        width={width}
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
        onChange={onChange}
        disabled={disabled}
      >
        {children}
        {isIcon && buttonIconType[type]}
      </ButtonContainer>
    );
  }
);

Button.displayName = "Button";
