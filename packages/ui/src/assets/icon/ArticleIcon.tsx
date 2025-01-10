interface IArticleType {
  size?: number;
  color?: string;
}

export const ArticleIcon = ({ size = 20, color = '#52525B' }: IArticleType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1495_548)">
        <path
          d="M3.33268 18.3332H16.666C17.108 18.3332 17.532 18.1576 17.8445 17.845C18.1571 17.5325 18.3327 17.1085 18.3327 16.6665V3.33317C18.3327 2.89114 18.1571 2.46722 17.8445 2.15466C17.532 1.8421 17.108 1.6665 16.666 1.6665H6.66602C6.22399 1.6665 5.80007 1.8421 5.4875 2.15466C5.17494 2.46722 4.99935 2.89114 4.99935 3.33317V16.6665C4.99935 17.1085 4.82375 17.5325 4.51119 17.845C4.19863 18.1576 3.77471 18.3332 3.33268 18.3332ZM3.33268 18.3332C2.89065 18.3332 2.46673 18.1576 2.15417 17.845C1.84161 17.5325 1.66602 17.1085 1.66602 16.6665V9.1665C1.66602 8.24984 2.41602 7.49984 3.33268 7.49984H4.99935M14.9993 11.6665H8.33268M12.4993 14.9998H8.33268M8.33268 4.99984H14.9993V8.33317H8.33268V4.99984Z"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1495_548">
          <rect width={size} height={size} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
