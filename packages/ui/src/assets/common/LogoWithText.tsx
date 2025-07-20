interface ILogoType {
  width: number;
  height: number;
}

export const LogoWithText = ({ width, height }: ILogoType) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 74 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1400_1262)">
        <path
          d="M4.66602 4.6665H11.666L19.8327 23.3332H12.8327L4.66602 4.6665Z"
          fill="#EA580C"
        />
        <path d="M17.5 0H24.5L28 8.16667H21L17.5 0Z" fill="#EA580C" />
        <path
          d="M4.66667 4.6665H11.6667L7 27.9998H0L4.66667 4.6665Z"
          fill="#FDBA74"
        />
        <path
          d="M17.5007 0L24.5007 0L19.834 23.3333H12.834L17.5007 0Z"
          fill="#FB923C"
        />
      </g>
      <path
        d="M52.2969 19.9062V22.9531H32.4922V19.9062H40.5078V16.0156H34.4375V5.11719H50.2578V16.0156H44.2344V19.9062H52.2969ZM38.1641 8.11719V13.1094H46.5312V8.11719H38.1641ZM73.0156 15.3594V18.3359H64.9062V25.3438H61.1797V18.3359H53.2344V15.3594H73.0156ZM71.3047 4.67188V7.55469H65.4453C65.832 9.21875 67.5898 11.0352 72.2188 11.5391L70.8594 14.4688C66.9102 14.0117 64.4141 12.5352 63.125 10.5312C61.8477 12.5352 59.375 14.0117 55.4375 14.4688L54.0781 11.5391C58.6484 11.0352 60.4062 9.21875 60.8516 7.55469H54.9688V4.67188H71.3047Z"
        fill="#F97316"
      />
      <defs>
        <clipPath id="clip0_1400_1262">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
