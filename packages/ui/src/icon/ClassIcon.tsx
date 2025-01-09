import { color } from '@mozu/design-token';

type ClassType = {
  size?: number;
  color?: string;
};

export const ClassIcon = ({ size = 20, color = '#52525B' }: ClassType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 4.16667V7.5M7.5 12.5V14.1667M14.1667 2.5V4.16667M14.1667 10.8333V13.3333M2.5 2.5V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H17.5M6.66667 7.5H8.33333C8.79357 7.5 9.16667 7.8731 9.16667 8.33333V11.6667C9.16667 12.1269 8.79357 12.5 8.33333 12.5H6.66667C6.20643 12.5 5.83333 12.1269 5.83333 11.6667V8.33333C5.83333 7.8731 6.20643 7.5 6.66667 7.5ZM13.3333 4.16667H15C15.4602 4.16667 15.8333 4.53976 15.8333 5V10C15.8333 10.4602 15.4602 10.8333 15 10.8333H13.3333C12.8731 10.8333 12.5 10.4602 12.5 10V5C12.5 4.53976 12.8731 4.16667 13.3333 4.16667Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
