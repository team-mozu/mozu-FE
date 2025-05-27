interface IDelType {
  size?: number;
  color?: string;
}

export const Del = ({ size, color }: IDelType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 5.00002H17.5M15.8333 5.00002V16.6667C15.8333 17.5 15 18.3334 14.1667 18.3334H5.83333C5 18.3334 4.16667 17.5 4.16667 16.6667V5.00002M6.66667 5.00002V3.33335C6.66667 2.50002 7.5 1.66669 8.33333 1.66669H11.6667C12.5 1.66669 13.3333 2.50002 13.3333 3.33335V5.00002M8.33333 9.16669V14.1667M11.6667 9.16669V14.1667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 5.00002H17.5M15.8333 5.00002V16.6667C15.8333 17.5 15 18.3334 14.1667 18.3334H5.83333C5 18.3334 4.16667 17.5 4.16667 16.6667V5.00002M6.66667 5.00002V3.33335C6.66667 2.50002 7.5 1.66669 8.33333 1.66669H11.6667C12.5 1.66669 13.3333 2.50002 13.3333 3.33335V5.00002M8.33333 9.16669V14.1667M11.6667 9.16669V14.1667"
        stroke={color}
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 5.00002H17.5M15.8333 5.00002V16.6667C15.8333 17.5 15 18.3334 14.1667 18.3334H5.83333C5 18.3334 4.16667 17.5 4.16667 16.6667V5.00002M6.66667 5.00002V3.33335C6.66667 2.50002 7.5 1.66669 8.33333 1.66669H11.6667C12.5 1.66669 13.3333 2.50002 13.3333 3.33335V5.00002M8.33333 9.16669V14.1667M11.6667 9.16669V14.1667"
        stroke={color}
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
