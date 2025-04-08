interface IStockType {
  size?: number;
  color?: string;
}

export const StockNoLogo = ({ size = 40, color = '#D4D4D8' }: IStockType) => {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2322_2778)">
        <path d="M6.66699 6.6665H16.667L28.3337 33.3332H18.3337L6.66699 6.6665Z" fill="#D4D4D8"/>
        <path d="M25 0H35L40 11.6667H30L25 0Z" fill={color}/>
        <path d="M6.66667 6.6665H16.6667L10 39.9998H0L6.66667 6.6665Z" fill="#D4D4D8"/>
        <path d="M24.9997 0L34.9997 0L28.333 33.3333H18.333L24.9997 0Z" fill="#D4D4D8"/>
      </g>
      <defs>
        <clipPath id="clip0_2322_2778">
        <rect width={size}  height={size}  fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
};
