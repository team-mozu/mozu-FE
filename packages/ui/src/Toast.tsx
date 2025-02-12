import { Flip, toast, ToastOptions, TypeOptions } from 'react-toastify';
import { color } from '@mozu/design-token';
import { Check, Info, Warning } from './assets';

export interface IToastProps extends ToastOptions {
  type: Exclude<TypeOptions, 'default'>;
}

export const Toast = (message: string, { type }: IToastProps) => {
  toast(message, {
    type,
    style: {
      ...ToastType[type].style,
      color: color.white,
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
    icon: <Check size={24} />,
  },
  error: {
    style: {
      backgroundColor: color.red[500],
    },
    icon: <Warning width={24} height={24} />,
  },
  info: {
    style: {
      backgroundColor: color.black,
    },
    icon: <Info color={color.white} size={24} />,
  },
  warning: {
    style: {
      backgroundColor: color.orange[500],
    },
    icon: <Warning width={24} height={24} />,
  },
};
