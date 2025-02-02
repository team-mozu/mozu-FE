import styled from '@emotion/styled';

interface IStarType {
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
}

export const Star = ({
  size = 20,
  strokeColor,
  fillColor,
  onClick,
}: IStarType) => {
  return (
    <SvgContainer>
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
      >
        <path
          d="M9.60502 1.91274C9.64153 1.83895 9.69795 1.77685 9.76789 1.73342C9.83784 1.69 9.91852 1.66699 10.0008 1.66699C10.0832 1.66699 10.1639 1.69 10.2338 1.73342C10.3037 1.77685 10.3602 1.83895 10.3967 1.91274L12.3217 5.8119C12.4485 6.06854 12.6357 6.29058 12.8672 6.45895C13.0987 6.62732 13.3676 6.737 13.6508 6.77857L17.9558 7.40857C18.0374 7.42039 18.1141 7.4548 18.1771 7.5079C18.2401 7.56101 18.287 7.63069 18.3125 7.70908C18.338 7.78746 18.3411 7.87141 18.3213 7.95143C18.3016 8.03146 18.2599 8.10436 18.2009 8.1619L15.0875 11.1936C14.8822 11.3937 14.7286 11.6406 14.6399 11.9133C14.5512 12.1859 14.5301 12.476 14.5783 12.7586L15.3134 17.0419C15.3277 17.1234 15.3189 17.2074 15.2879 17.2841C15.2569 17.3609 15.205 17.4274 15.138 17.4761C15.071 17.5247 14.9917 17.5536 14.9091 17.5593C14.8265 17.5651 14.7439 17.5475 14.6708 17.5086L10.8225 15.4852C10.5689 15.3521 10.2868 15.2825 10.0004 15.2825C9.71403 15.2825 9.43192 15.3521 9.17835 15.4852L5.33085 17.5086C5.25779 17.5472 5.17535 17.5646 5.09289 17.5588C5.01044 17.5529 4.93128 17.524 4.86443 17.4754C4.79758 17.4268 4.74571 17.3604 4.71473 17.2838C4.68375 17.2071 4.6749 17.1233 4.68918 17.0419L5.42335 12.7594C5.47185 12.4767 5.45084 12.1864 5.36213 11.9136C5.27343 11.6408 5.11969 11.3937 4.91418 11.1936L1.80085 8.16274C1.74134 8.10526 1.69918 8.03223 1.67915 7.95197C1.65913 7.8717 1.66205 7.78742 1.68758 7.70873C1.71312 7.63004 1.76024 7.5601 1.82358 7.50689C1.88692 7.45367 1.96393 7.41932 2.04585 7.40774L6.35002 6.77857C6.63356 6.73732 6.90284 6.62778 7.13467 6.45939C7.3665 6.291 7.55394 6.0688 7.68085 5.8119L9.60502 1.91274Z"
          stroke={strokeColor}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </SvgContainer>
  );
};

const SvgContainer = styled.div<Pick<IStarType, 'size'>>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  cursor: pointer;
`;
