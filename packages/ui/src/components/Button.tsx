import { forwardRef, memo } from "react";
import type { ButtonProps, ButtonType } from "@/components/types";
import { ArticleIcon, Cancel, ClassIcon, Del, Edit, LogOut, Plus, Save, Start, Trophy } from "../assets";
import { buttonStyles } from "./styles";

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      backgroundColor,
      id,
      color,
      borderColor = "",
      hoverBorderColor,
      hoverBackgroundColor,
      hoverBoxShadow,
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
    ref,
  ) => {
    const buttonIconType: Record<ButtonType, JSX.Element> = {
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
      rankingImg: (
        <Trophy
          size={iconSize}
          color={iconColor}
        />
      )
    };

    const styleProps = {
      width,
      backgroundColor,
      color,
      borderColor,
      hoverBorderColor,
      hoverBackgroundColor,
      hoverColor,
      activeBorderColor,
      activeBackgroundColor,
      activeColor,
      hoverBoxShadow
    };

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        css={buttonStyles(styleProps)}
        onClick={event || onClick}
        onChange={onChange}
        disabled={disabled}>
        {children}
        {isIcon && buttonIconType[type]}
      </button>
    );
  },
));

Button.displayName = "Button";
