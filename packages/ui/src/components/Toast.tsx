import { color } from "@mozu/design-token";
import { Flip, type ToastOptions, type TypeOptions, toast } from "react-toastify";
import { SvgIcon } from "./SvgIcon";

export interface IToastProps extends ToastOptions {
  type: Exclude<TypeOptions, "default">;
}

export const Toast = (message: string, { type }: IToastProps) => {
  toast(message, {
    type,
    style: {
      ...ToastType[type].style,
      color: color.white,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    transition: Flip,
    icon: ToastType[type].icon,
  });
};

const ToastType = {
  success: {
    style: {
      backgroundColor: color.green[500],
    },
    icon: <SvgIcon name="check" size={24} />,
  },
  error: {
    style: {
      backgroundColor: color.red[500],
    },
    icon: (
      <SvgIcon
        name="warning"
        size={24}
        color={color.white}
      />
    ),
  },
  info: {
    style: {
      backgroundColor: color.black,
    },
    icon: (
      <SvgIcon
        name="info"
        color={color.white}
        size={24}
      />
    ),
  },
  warning: {
    style: {
      backgroundColor: color.orange[500],
    },
    icon: (
      <SvgIcon
        name="warning"
        color={color.white}
        size={24}
      />
    ),
  },
};
