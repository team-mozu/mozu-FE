import type { FC } from "react";

interface SvgIconProps {
  name:
  | "arrow-left"
  | "arrow-right"
  | "article-icon"
  | "cancel"
  | "check"
  | "chevron-down"
  | "class-icon"
  | "del"
  | "dot"
  | "edit"
  | "eye-off"
  | "eye"
  | "fill-star"
  | "hand-coins"
  | "img-logo"
  | "info"
  | "log-out"
  | "logo-with-text"
  | "manager-logo"
  | "no-img-icon"
  | "no-news-img"
  | "play"
  | "plus"
  | "save"
  | "search"
  | "star"
  | "start"
  | "stock-icon"
  | "stock-no-logo"
  | "trophy"
  | "users"
  | "warning";
  prefix?: string;
  color?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const SvgIcon: FC<SvgIconProps> = ({
  name = "arrow-left",
  prefix = "icon",
  color = "currentColor",
  size = 24,
  width,
  height,
  className = "",
  ...props
}) => {
  const symbolId = `#${prefix}-${name}`;
  return (
    <svg
      {...props}
      aria-hidden="true"
      width={width ? width : size}
      height={height ? height : size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={{
        color,
        fill: color,
        ...(props.style || {}),
      }}>
      <use href={symbolId} fill={color} />
    </svg>
  );
};
