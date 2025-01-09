import { color } from '@mozu/design-token';

interface ISaveType {
  size?: number;
  color?: string;
}

export const ChevronDown = ({ size, color }: ISaveType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        transform="rotate(180, 12, 12)"
      />
    </svg>
  );
};
