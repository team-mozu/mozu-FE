import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useEffect, useState } from 'react';
import { Button, Input, Toast } from '@mozu/ui';
import { TradeHistory } from '@/db/type';
import { db } from '@/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useGetHoldItems } from '@/apis';
import { ItemType } from '@/apis/team/type'
import { useQueryClient } from '@tanstack/react-query';

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
  isOpen,
  itemId,
  itemName,
  onConfirm,
  invDeg,
}: IPropsType) => {
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    const numericQuantity = Number(quantity.replace(/[^0-9]/g, '')) || 0;

    if (modalType === '매도') {
      const heldQuantity = localHoldItem?.itemCnt ?? 0;
      if (numericQuantity > heldQuantity) {
        Toast('보유 수량보다 많이 매도할 수 없습니다.', { type: 'warning' });
        return;
      }
    }

    try {
      if (numericQuantity <= 0) {
        Toast('주문 수량은 0보다 커야 합니다.', { type: 'warning' });
        return;
      }

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

      const savedId = await db.tradeHistory.add({
        ...tradeData,
        originalBuyMoney: nowMoney,
        originalValMoney: nowMoney,
        originalValProfit: 0
      });

      if (savedId) {
        try {
          const currentTeamData = await db.team.get(1);
          if (currentTeamData && typeof currentTeamData.cashMoney === 'number') {
            let newCashMoney: number;
            if (tradeData.orderType === 'BUY') {
              newCashMoney = currentTeamData.cashMoney - tradeData.totalMoney;
            } else {
              newCashMoney = currentTeamData.cashMoney + tradeData.totalMoney;
            }

            await db.team.update(1, { cashMoney: newCashMoney });
            console.log(`IndexedDB cashMoney updated to: ${newCashMoney}`);

            if (tradeData.orderType === 'SELL') {
              // React Query 캐시 업데이트 (기존 코드)
              queryClient.setQueryData<ItemType[]>(['holdItems'], (oldData) => {
                if (!oldData) return oldData;
                return oldData
                  .map(item => {
                    if (item.itemId === tradeData.itemId) {
                      return {
                        ...item,
                        itemCnt: item.itemCnt - tradeData.orderCount,
                      };
                    }
                    return item;
                  })
                  .filter(item => item.itemCnt > 0);
              });

              // IndexedDB의 holdItems 업데이트 추가
              try {
                // holdItems 테이블에서 해당 아이템 조회
                const existingItem = await db.items.get({ itemId: tradeData.itemId });

                if (existingItem) {
                  const newCount = existingItem.itemCnt - tradeData.orderCount;

                  if (newCount > 0) {
                    // 수량 업데이트
                    await db.items.update(existingItem.id, {
                      itemCnt: newCount
                    });
                  } else {
                    // 수량이 0 이하면 아이템 삭제
                    await db.items.delete(existingItem.id);
                  }

                  console.log(`IndexedDB items updated for item ${tradeData.itemId}`);
                }
              } catch (dbError) {
                console.error('Failed to update items in IndexedDB:', dbError);
                Toast('보유 종목 업데이트 실패', { type: 'error' });
              }
            }


          } else {
            Toast('로컬 잔액 업데이트 실패', { type: 'error' });
          }
        } catch (dbError) {
          console.error('Failed to update cashMoney in IndexedDB:', dbError);
          Toast('로컬 잔액 업데이트 실패', { type: 'error' });
        }

        onConfirm({
          ...tradeData,
          id: savedId,
        });
        onClose();
      }
    } catch (error) {
      Toast('거래 처리 중 오류가 발생했습니다', { type: 'error' });
      console.error('Error adding trade history:', error);
    }
  };

  const localTeamData = useLiveQuery(
    () => db.team.get(1),
    []
  );
  const localCashMoney = localTeamData?.cashMoney ?? 0;

  const localHoldItem = useLiveQuery(
    () => (modalType === '매도' ? db.items.get({ itemId: itemId }) : undefined),
    [itemId, modalType],
  );

  const maxQuantity = (() => {
    if (modalType === '매수') {
      return nowMoney > 0 ? Math.floor(localCashMoney / nowMoney) : 0;
    } else { // 매도
      // Use item count from IndexedDB live query
      return localHoldItem?.itemCnt ?? 0;
    }
  })();

  const [quantity, setQuantity] = useState<string>('0');
  const numericQuantity = Number(quantity.replace(/[^0-9]/g, '')) || 0;

  const totalAmount =
    (numericQuantity * nowMoney).toLocaleString('ko-KR') + '원';

  useEffect(() => {
    const newQuantity = maxQuantity > 0 ? '1' : '0';
    setQuantity(newQuantity);
  }, [nowMoney, maxQuantity, modalType, localHoldItem]);

  const priceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseInt(inputValue.replace(/[^0-9]/g, ''), 10) || 0;

    if (numericValue <= maxQuantity && numericValue >= 0) {
      setQuantity(numericValue.toString());
    }
  };

  const footerData = [
    { text: `${modalType}가능 수량`, value: `${maxQuantity}주` },
    { text: '주문가격', value: `${nowMoney.toLocaleString()}원` },
    { text: '총 주문금액', value: totalAmount },
  ];

  const confirmButtonDisabled = (() => {
    if (numericQuantity <= 0) return true;
    if (modalType === '매수') {
      return numericQuantity * nowMoney > localCashMoney;
    } else {
      return numericQuantity > maxQuantity;
    }
  })();

  if (!isOpen) return null;

  return (
    <BackgroundContainer onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Wrapper>
          <Header
            color={modalType === '매도' ? color.blue[500] : color.red[500]}
          >
            {itemName}
            <span>{modalType} 주문</span>
          </Header>
          <InputBox>
            <Input
              placeholder=""
              label="수량"
              width="290px"
              value={quantity}
              onChange={priceChangeHandler}
              disabled={maxQuantity === 0}
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
              disabled={confirmButtonDisabled}
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
