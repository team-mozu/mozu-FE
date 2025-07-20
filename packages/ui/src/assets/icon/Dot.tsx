interface IDotType {
  size?: number;
  color?: string;
}

export const Dot = ({ size = 8, color = '#F97316' }: IDotType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} rx="4" fill={color} />
    </svg>
  );
};
