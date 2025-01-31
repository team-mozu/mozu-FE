import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Input } from './Input';
import { useState } from 'react';
import { Button } from './Button';

interface IPropsType {
  modalType: string; // ex) 매도, 매수
}

export const BuySellModal = ({ modalType }: IPropsType) => {
  const footerData = [
    { text: `${modalType}가능 수량`, value: '8주' },
    { text: '주문가격', value: '53,700원' },
    { text: '총 주문금액', value: '53,700원' },
  ];

  const orderPrice = Number(footerData[1].value.replace(/[^0-9]/g, '')); // 주문 가격 (주식 가격)
  const maxQuantity = Number(footerData[0].value.replace(/[^0-9]/g, '')); // 최대 입력 값 설정

  const [quantity, setQuantity] = useState<string>('1'); // 사용자가 구매하려는 값
  const [totalAmount, setTotalAmount] = useState<string>(footerData[2].value); // 총 주문금액

  const priceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 사용자의 입력값에 따라 총 주문금액을 바꾸는 함수
    const inputValue = e.target.value;
    const numericValue = Number(inputValue.replace(/,/g, ''));

    if (
      // 사용자의 입력이 숫자가 아니거나, 비어 있거나, 매수 가능 수량보다 높다면 작동하지 않음
      isNaN(numericValue) ||
      inputValue === '' ||
      numericValue > maxQuantity
    ) {
      setQuantity(''); // 입력값을 초기화
      setTotalAmount(footerData[2].value); // 총 주문금액도 기본 상태로 돌려놓음
    } else {
      setQuantity(numericValue.toString());
      const newTotalAmount =
        (orderPrice * numericValue).toLocaleString('ko-KR') + '원'; // 주문 가격에 입력값을 곱하고 ,를 붙임 11111 => 11,111 로
      setTotalAmount(newTotalAmount);
    }
  };

  return (
    <BackgroundContainer>
      <Modal>
        <Wrapper>
          <Header
            color={modalType === '매도' ? color.blue[500] : color.red[500]}
          >
            삼성전자
            <span>{modalType} 주문</span>
          </Header>
          <InputBox>
            <Input
              placeholder=""
              label="수량"
              width="290px"
              value={quantity}
              onChange={priceChangeHandler}
            />
            <span>주</span>
          </InputBox>
          <Footer>
            {footerData.map((data, index) => {
              const value = index === 2 ? totalAmount : data.value;
              return (
                <FooterData key={index}>
                  {data.text}
                  <span>{value}</span>
                </FooterData>
              );
            })}
          </Footer>
        </Wrapper>
        <BtnDiv>
          <BtnBox>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
            >
              취소
            </Button>
            <Button
              backgroundColor={
                modalType === '매도' ? color.blue[500] : color.red[500]
              }
              borderColor={
                modalType === '매도' ? color.blue[500] : color.red[500]
              }
              color="white"
            >
              {modalType}하기
            </Button>
          </BtnBox>
        </BtnDiv>
      </Modal>
    </BackgroundContainer>
  );
};

const Wrapper = styled.div`
  margin: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: right;
  gap: 10px;
`;

const BtnDiv = styled.div`
  padding: 12px 12px 12px 0px;
  border-top: 1px solid ${color.zinc[200]};
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FooterData = styled.div`
  display: flex;
  justify-content: space-between;
  font: ${font.l1};
  color: ${color.zinc[600]};
  > span {
    font: ${font.b1};
    color: ${color.black};
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  > span {
    font: ${font.t4};
    margin: 14px 0px;
  }
`;

const Header = styled.div<{ color: string }>`
  font: ${font.t1};
  display: flex;
  flex-direction: column;
  width: 75px;
  justify-content: center;
  > span {
    font: ${font.t2};
    color: ${(color) => color.color};
  }
`;

const Modal = styled.div`
  background-color: ${color.white};
  border-radius: 16px;
  width: 360px;
  height: 356px;
`;

const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
