interface ICheckType {
  color?: string;
  size?: number;
}

export const Check = ({ size = 16, color = 'white' }: ICheckType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3327 4L5.99935 11.3333L2.66602 8"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
