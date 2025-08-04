import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface IStockType {
  number: number;
  name: string;
  onClick: () => void;
  selected: boolean;
}

export const StockDiv = ({ number, name, onClick, selected }: IStockType) => {
  return (
    <StockDivContainer
      onClick={onClick}
      selected={selected}>
      <NumberText selected={selected}>{number}</NumberText>
      <Stock selected={selected}>{name}</Stock>
    </StockDivContainer>
  );
};

const StockDivContainer = styled.div<{
  selected: boolean;
}>`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e4e7;
  gap: 14px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? color.orange[50] : "transparent")};

  ${({ selected }) =>
    !selected &&
    `
  &:hover {
    background-color: ${color.zinc[100]};
  }
  `}
`;

const Stock = styled.p<{
  selected: boolean;
}>`
  max-width: 184px;
  font: ${({ selected }) => (selected ? font.b1 : font.b2)};
  color: ${({ selected }) => (selected ? color.orange[600] : color.black)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NumberText = styled.p<{
  selected: boolean;
}>`
  font: ${font.l2};
  color: ${({ selected }) => (selected ? color.orange[600] : color.zinc[600])};
`;
