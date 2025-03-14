import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button } from '@mozu/ui';

export const StockStatusBar = ({
  openModal,
}: {
  openModal: (type: '매수' | '매도') => void;
}) => {
  const rate = '-1200원 (-1.12%)';
  return (
    <Wrapper>
      <Stock>
        <Logo src="https://logo-resources.thevc.kr/organizations/200x200/bd4dd5dd2e42ebb15490840c66957e4c42bb2348448ed636ebe08528f22773d2_1646618385259179.jpg" />
        <StockInfo>
          <StockName>
            삼성전자
            <span>005930</span>
          </StockName>
          <StockPrice
            color={rate.includes('+') ? color.red[500] : color.blue[500]}
          >
            53,700원
            <span>{rate}</span>
          </StockPrice>
        </StockInfo>
      </Stock>
      <Btn>
        <Button
          borderColor={color.red[500]}
          backgroundColor={color.red[500]}
          color="white"
          width={80}
          onClick={() => openModal('매수' /*currentStock*/)}
          hoverBackgroundColor={color.red[600]}
          hoverBorderColor={color.red[600]}
        >
          매수
        </Button>
        <Button
          borderColor={color.blue[500]}
          backgroundColor={color.blue[500]}
          color="white"
          width={80}
          onClick={() => openModal('매도' /*currentStock*/)}
          hoverBackgroundColor={color.blue[600]}
          hoverBorderColor={color.blue[600]}
        >
          매도
        </Button>
      </Btn>
    </Wrapper>
  );
};

const Btn = styled.div`
  display: flex;
  gap: 12px;
  height: 48px;
`;

const Logo = styled.img`
  border: 1px solid ${color.zinc[200]};
  border-radius: 12px;
  width: 64px;
  height: 64px;
  object-fit: cover;
`;

const Stock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StockPrice = styled.div<{ color?: string }>`
  font: ${font.h3};
  display: flex;
  align-items: center;
  gap: 12px;
  > span {
    font: ${font.t3};
    color: ${({ color }) => color};
  }
`;

const StockName = styled.div`
  font: ${font.t3};
  display: flex;
  align-items: center;
  gap: 6px;
  > span {
    font: ${font.b2};
    color: ${color.zinc[600]};
  }
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 1px 0px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-end;
`;
