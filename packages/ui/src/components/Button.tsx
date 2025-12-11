import { forwardRef, memo } from "react";
import type { ButtonProps, ButtonType } from "@/components/types";
import { SvgIcon } from "./SvgIcon";
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
        <SvgIcon
          name="start"
          size={iconSize}
          color={iconColor}
        />
      ),
      delImg: (
        <SvgIcon
          name="del"
          size={iconSize}
          color={iconColor}
        />
      ),
      editImg: (
        <SvgIcon
          name="edit"
          size={iconSize}
          color={iconColor}
        />
      ),
      plusImg: (
        <SvgIcon
          name="plus"
          size={iconSize}
          color={iconColor}
        />
      ),
      saveImg: (
        <SvgIcon
          name="save"
          size={iconSize}
          color={iconColor}
        />
      ),
      cancelImg: (
        <SvgIcon
          name="cancel"
          size={iconSize}
          color={iconColor}
        />
      ),
      logOutImg: (
        <SvgIcon
          name="log-out"
          size={iconSize}
          color={iconColor}
        />
      ),
      articleImg: (
        <SvgIcon
          name="article-icon"
          size={iconSize}
          color={iconColor}
        />
      ),
      classImg: (
        <SvgIcon
          name="class-icon"
          size={iconSize}
          color={iconColor}
        />
      ),
      rankingImg: (
        <SvgIcon
          name="trophy"
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
