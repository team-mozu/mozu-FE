import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button } from '@mozu/ui';
export const StockStatusBar = ({ openModal, }) => {
    const rate = '-1200원 (-1.12%)';
    return (_jsxs(Wrapper, { children: [_jsxs(Stock, { children: [_jsx(Logo, { src: "https://logo-resources.thevc.kr/organizations/200x200/bd4dd5dd2e42ebb15490840c66957e4c42bb2348448ed636ebe08528f22773d2_1646618385259179.jpg" }), _jsxs(StockInfo, { children: [_jsxs(StockName, { children: ["\uC0BC\uC131\uC804\uC790", _jsx("span", { children: "005930" })] }), _jsxs(StockPrice, { color: rate.includes('+') ? color.red[500] : color.blue[500], children: ["53,700\uC6D0", _jsx("span", { children: rate })] })] })] }), _jsxs(Btn, { children: [_jsx(Button, { borderColor: color.red[500], backgroundColor: color.red[500], color: "white", width: 80, onClick: () => openModal('매수' /*currentStock*/), hoverBackgroundColor: color.red[600], hoverBorderColor: color.red[600], children: "\uB9E4\uC218" }), _jsx(Button, { borderColor: color.blue[500], backgroundColor: color.blue[500], color: "white", width: 80, onClick: () => openModal('매도' /*currentStock*/), hoverBackgroundColor: color.blue[600], hoverBorderColor: color.blue[600], children: "\uB9E4\uB3C4" })] })] }));
};
const Btn = styled.div `
  display: flex;
  gap: 12px;
  height: 48px;
`;
const Logo = styled.img `
  border: 1px solid ${color.zinc[200]};
  border-radius: 12px;
  width: 64px;
  height: 64px;
  object-fit: cover;
`;
const Stock = styled.div `
  display: flex;
  align-items: center;
  gap: 12px;
`;
const StockPrice = styled.div `
  font: ${font.h3};
  display: flex;
  align-items: center;
  gap: 12px;
  > span {
    font: ${font.t3};
    color: ${({ color }) => color};
  }
`;
const StockName = styled.div `
  font: ${font.t3};
  display: flex;
  align-items: center;
  gap: 6px;
  > span {
    font: ${font.b2};
    color: ${color.zinc[600]};
  }
`;
const StockInfo = styled.div `
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 1px 0px;
`;
const Wrapper = styled.div `
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-end;
`;
