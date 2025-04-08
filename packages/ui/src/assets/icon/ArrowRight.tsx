interface IArrowRightType {
  size?: number;
  color?: string;
}

export const ArrowRight = ({ size = 24, color = 'black' }: IArrowRightType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 12H19.5M19.5 12L12.5 5M19.5 12L12.5 19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
