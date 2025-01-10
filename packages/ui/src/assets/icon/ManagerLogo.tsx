interface IManagerLogoType {
  size?: number;
  color?: string;
}

export const ManagerLogo = ({
  size = 20,
  color = '#52525B',
}: IManagerLogoType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 18.3332H17.5M5 14.9998V9.1665M8.33333 14.9998V9.1665M11.6667 14.9998V9.1665M15 14.9998V9.1665M10 1.6665L16.6667 5.83317H3.33333L10 1.6665Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
