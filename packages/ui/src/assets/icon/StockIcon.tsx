interface IStockType {
  size?: number;
  color?: string;
}

export const StockIcon = ({ size = 20, color = "#52525B" }: IStockType) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.50065 18.3332V14.9998H12.5007V18.3332M6.66732 4.99984H6.67565M13.334 4.99984H13.3423M10.0007 4.99984H10.009M10.0007 8.33317H10.009M10.0007 11.6665H10.009M13.334 8.33317H13.3423M13.334 11.6665H13.3423M6.66732 8.33317H6.67565M6.66732 11.6665H6.67565M5.00065 1.6665H15.0007C15.9211 1.6665 16.6673 2.4127 16.6673 3.33317V16.6665C16.6673 17.587 15.9211 18.3332 15.0007 18.3332H5.00065C4.08018 18.3332 3.33398 17.587 3.33398 16.6665V3.33317C3.33398 2.4127 4.08018 1.6665 5.00065 1.6665Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
