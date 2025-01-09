import { color } from '@mozu/design-token';

interface EditType {
  size?: number;
  color?: string;
}

export const Edit = ({ size, color }: EditType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1431_193)">
        <path
          d="M12.4998 4.16664L15.8331 7.49997M17.6448 5.67664C18.0854 5.23616 18.3329 4.63869 18.333 4.01568C18.3331 3.39267 18.0857 2.79515 17.6452 2.35456C17.2047 1.91396 16.6073 1.6664 15.9842 1.66632C15.3612 1.66624 14.7637 1.91366 14.3231 2.35414L3.20145 13.4783C3.00797 13.6712 2.86488 13.9087 2.78478 14.17L1.68395 17.7966C1.66241 17.8687 1.66079 17.9453 1.67924 18.0182C1.6977 18.0911 1.73555 18.1577 1.78878 18.2108C1.84201 18.264 1.90863 18.3017 1.98158 18.32C2.05453 18.3384 2.13108 18.3366 2.20312 18.315L5.83062 17.215C6.09159 17.1356 6.32909 16.9934 6.52228 16.8008L17.6448 5.67664Z"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1431_193">
          <rect width={size} height={size} fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};
