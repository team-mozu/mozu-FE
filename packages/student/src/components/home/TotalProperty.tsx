import { useUnchangedValue } from '@/hook';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IPropsType {
  totalMoney: string;
  profitNum: string;
  valueProfit: number;
  basicMoney: string;
  cashMoney: string;
  valueMoney: string;
}

export const TotalProperty = ({
  totalMoney,
  profitNum,
  valueProfit,
  basicMoney,
  cashMoney,
  valueMoney,
}: IPropsType) => {
  const sameValue: boolean = useUnchangedValue(totalMoney, basicMoney);
  return (
    <Wrapper>
      <TitleBox>
        <Title>총 평가 자산</Title>
        <Money
          color={
            sameValue
              ? color.green[600]
              : profitNum.indexOf('+') !== -1
                ? color.red[500]
                : color.blue[500]
          }
        >
          {totalMoney}원
        </Money>
        {!valueProfit ? null : (
          <MoneyRate
            color={
              sameValue
                ? color.green[600]
                : profitNum.indexOf('+') !== -1
                  ? color.red[500]
                  : color.blue[500]
            }
          >
            {valueProfit.toLocaleString()}원 (
            {Number(profitNum.replace('%', '')).toFixed(2)}%)
          </MoneyRate>
        )}
      </TitleBox>
      <DetailBox>
        <Details>
          <BasicMoney>
            기초자산
            <span>{basicMoney}원</span>
          </BasicMoney>
          <Cash>
            보유현금
            <span>{cashMoney}원</span>
          </Cash>
          <Stock>
            보유주식
            <span>{valueMoney}원</span>
          </Stock>
        </Details>
      </DetailBox>
    </Wrapper>
  );
};

const Stock = styled.div`
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

const BasicMoney = styled(Stock)`
  border-right: solid 1px ${color.zinc[200]};
  padding-right: 16px;
`;

const Cash = styled(BasicMoney)``;

const Details = styled.div`
  display: flex;
  gap: 16px;
`;

const DetailBox = styled.div`
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  padding: 12px 16px;
  border-radius: 8px;
`;

const MoneyRate = styled.div<{ color?: string }>`
  font: ${font.t2};
  color: ${({ color }) => color};
`;

const Money = styled.div<{ color?: string }>`
  font: ${font.h1};
  color: ${({ color }) => color};
`;

const Title = styled.div`
  font: ${font.t3};
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
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
