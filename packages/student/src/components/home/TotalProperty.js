import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
export const TotalProperty = ({ money, rate, basicMoney, cash, stock, }) => {
    return (_jsxs(Wrapper, { children: [_jsxs(TitleBox, { children: [_jsx(Title, { children: "\uCD1D \uD3C9\uAC00 \uC790\uC0B0" }), _jsxs(Money, { color: rate.indexOf('+') !== -1 ? color.red[500] : color.blue[500], children: [money, " \uC6D0"] }), _jsx(MoneyRate, { color: rate.indexOf('+') !== -1 ? color.red[500] : color.blue[500], children: rate })] }), _jsx(DetailBox, { children: _jsxs(Details, { children: [_jsxs(BasicMoney, { children: ["\uAE30\uCD08\uC790\uC0B0", _jsxs("span", { children: [basicMoney, " \uC6D0"] })] }), _jsxs(Cash, { children: ["\uBCF4\uC720\uD604\uAE08", _jsxs("span", { children: [cash, " \uC6D0"] })] }), _jsxs(Stock, { children: ["\uBCF4\uC720\uC8FC\uC2DD", _jsxs("span", { children: [stock, " \uC6D0"] })] })] }) })] }));
};
const Stock = styled.div `
  color: ${color.zinc[500]};
  display: flex;
  gap: 8px;
  align-items: center;
  font: ${font.l1};
  > span {
    font: ${font.b1};
    color: ${color.black};
  }
`;
const BasicMoney = styled(Stock) `
  border-right: solid 1px ${color.zinc[200]};
  padding-right: 16px;
`;
const Cash = styled(BasicMoney) ``;
const Details = styled.div `
  display: flex;
  gap: 16px;
`;
const DetailBox = styled.div `
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  padding: 12px 16px;
  border-radius: 8px;
`;
const MoneyRate = styled.div `
  font: ${font.t2};
  color: ${({ color }) => color};
`;
const Money = styled.div `
  font: ${font.h1};
  color: ${({ color }) => color};
`;
const Title = styled.div `
  font: ${font.t3};
`;
const TitleBox = styled.div `
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div `
  width: 100%;
  height: 256px;
  padding: 40px 0;
  border: 1px solid ${color.zinc[200]};
  background-color: white;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;
