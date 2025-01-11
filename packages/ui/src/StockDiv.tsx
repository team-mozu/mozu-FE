import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useLocation } from 'react-router-dom';

export const StockDiv = () => {
  const location = useLocation();

  return (
    <StockDivContiner>
      <Number>005930</Number>
      <Stock>삼성전자</Stock>
    </StockDivContiner>
  );
};

const StockDivContiner = styled.div`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  ${location.pathname === '/f' &&
  `
    background-color: ${color.orange[50]};
  `}
  &:hover {
    background-color: ${color.zinc[100]};
  }
`;

const Stock = styled.p`
  max-width: 184px;
  font: ${font.b2};
  color: ${color.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${location.pathname === '/f' &&
  `
    font: ${font.b1};
    color: ${color.orange[600]};
  `}
`;

const Number = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
  ${location.pathname === '/f' &&
  `
    color: ${color.orange[600]};
  `}
`;
