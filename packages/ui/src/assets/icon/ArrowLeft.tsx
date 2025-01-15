interface IArrowType {
  size?: number;
  color?: string;
}

export const ArrowLeft = ({ size = 24, color = 'black' }: IArrowType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 19L5 12M5 12L12 5M5 12H19"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
