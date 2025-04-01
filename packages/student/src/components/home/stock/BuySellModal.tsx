import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useEffect, useState } from 'react';
import { Button, Input, Toast } from '@mozu/ui';
import { TradeHistory } from '@/db/type';
import { db } from '@/db';

interface IPropsType {
  modalType: string;
  nowMoney: number;
  cashMoney: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (order: TradeHistory) => void;
  itemId: number;
  itemName: string;
  invDeg: number;
}

export const BuySellModal = ({
  modalType,
  onClose,
  nowMoney,
  cashMoney,
  isOpen,
  itemId,
  itemName,
  onConfirm,
  invDeg,
}: IPropsType) => {
  const handleConfirm = async () => {
    try {
      const tradeData: TradeHistory = {
        itemId,
        itemName,
        itemMoney: nowMoney,
        orderCount: numericQuantity,
        totalMoney: numericQuantity * nowMoney,
        orderType: modalType === '매수' ? 'BUY' : 'SELL',
        invDeg: invDeg,
        timestamp: new Date(),
      };

      const savedId = await db.tradeHistory.add(tradeData);
      if (savedId) {
        onConfirm({
          ...tradeData,
          id: savedId,
        });
        onClose();
      }
    } catch (error) {
      console.error('거래 실패:', error);
      Toast('거래 처리 중 오류가 발생했습니다', { type: 'error' });
    }
  };

  const maxQuantity = nowMoney > 0 ? Math.floor(cashMoney / nowMoney) : 0;

  // 상태 관리
  const [quantity, setQuantity] = useState<string>('0');
  const numericQuantity = Number(quantity.replace(/[^0-9]/g, '')) || 0;

  // 총 주문 금액 계산
  const totalAmount =
    (numericQuantity * nowMoney).toLocaleString('ko-KR') + '원';

  // 데이터 초기화
  useEffect(() => {
    const newQuantity = maxQuantity > 0 ? '1' : '0';
    setQuantity(newQuantity);
  }, [nowMoney, cashMoney]);

  // 입력 변경 핸들러
  const priceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue.replace(/[^0-9]/g, ''), 10) || 0;

    if (numericValue <= maxQuantity && numericValue >= 0) {
      setQuantity(numericValue.toString());
    }
  };

  // UI 데이터
  const footerData = [
    { text: `${modalType}가능 수량`, value: `${maxQuantity}주` },
    { text: '주문가격', value: `${nowMoney.toLocaleString()}원` },
    { text: '총 주문금액', value: totalAmount },
  ];

  if (!isOpen) return null;

  return (
    <BackgroundContainer onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
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
              disabled={maxQuantity === 0} // 수량 입력 비활성화
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
              onClick={onClose}
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
              disabled={numericQuantity === 0}
              onClick={handleConfirm}
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
