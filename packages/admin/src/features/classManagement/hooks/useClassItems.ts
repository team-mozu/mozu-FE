import { useCallback, useMemo, useState } from "react";
import { useGetStockList } from "@/entities/stock";

export interface ClassItem {
  itemId: number;
  itemName: string;
  money: (number | null)[];
}

export interface StockTableItem {
  itemId: number;
  itemCode: number;
  itemName: string;
  money: (number | null)[];
  stockChecked?: boolean;
}

/**
 * 수업 생성 시 투자 종목 관리를 담당하는 커스텀 훅
 */
export const useClassItems = (lessonRound: number) => {
  const { data: stockListData } = useGetStockList();
  const [classItems, setClassItems] = useState<ClassItem[]>([]);

  /**
   * money 배열의 길이를 lessonRound에 맞게 조정하는 유틸리티 함수
   */
  const adjustMoneyArrayLength = useCallback(
    (money: (number | null)[] = []) => {
      const requiredLength = lessonRound + 1; // 0~N-1: 1차~N차가격, N: 종료가
      const adjustedMoney = [
        ...money,
      ];

      while (adjustedMoney.length < requiredLength) {
        adjustedMoney.push(null);
      }

      return adjustedMoney.slice(0, requiredLength);
    },
    [
      lessonRound,
    ],
  );

  /**
   * 새로운 투자 종목들을 추가하는 함수
   */
  const addItems = useCallback(
    (
      newItems: Array<{
        itemId: number;
        money?: (number | null)[];
      }>,
    ) => {
      const processedItems: ClassItem[] = newItems.map(item => {
        const stockItem = stockListData?.find(stock => stock.itemId === item.itemId);
        const itemName = stockItem?.itemName || `Item ${item.itemId}`;
        const adjustedMoney = adjustMoneyArrayLength(item.money);

        return {
          itemId: item.itemId,
          itemName,
          money: adjustedMoney,
        };
      });

      setClassItems(prev => [
        ...prev,
        ...processedItems,
      ]);
    },
    [
      stockListData,
      adjustMoneyArrayLength,
    ],
  );

  /**
   * 투자 종목들을 삭제하는 함수
   */
  const removeItems = useCallback((itemIds: number[]) => {
    setClassItems(prev => prev.filter(item => !itemIds.includes(item.itemId)));
  }, []);

  /**
   * 특정 종목의 특정 차수 가격을 업데이트하는 함수
   */
  const updateItemPrice = useCallback((itemId: number, levelIndex: number, value: number | null) => {
    setClassItems(prev =>
      prev.map(item => {
        if (item.itemId !== itemId) return item;

        const updatedMoney = [
          ...item.money,
        ];
        updatedMoney[levelIndex] = value;

        return {
          ...item,
          money: updatedMoney,
        };
      }),
    );
  }, []);

  /**
   * lessonRound가 변경될 때 모든 아이템의 money 배열 길이 조정
   */
  const adjustAllItemsForNewRound = useCallback(() => {
    setClassItems(prev =>
      prev.map(item => ({
        ...item,
        money: adjustMoneyArrayLength(item.money),
      })),
    );
  }, [
    adjustMoneyArrayLength,
  ]);

  /**
   * 테이블 표시용 데이터로 변환
   */
  const stockTableData: StockTableItem[] = useMemo(() => {
    return classItems.map(item => ({
      itemId: item.itemId,
      itemCode: item.itemId,
      itemName: item.itemName,
      money: item.money,
      stockChecked: false,
    }));
  }, [
    classItems,
  ]);

  /**
   * API 요청용 데이터로 변환
   */
  const getApiRequestData = useCallback(() => {
    return classItems.map(item => {
      const processedMoney = item.money.map(price => price ?? 0);

      return {
        itemId: item.itemId,
        money: processedMoney,
      };
    });
  }, [
    classItems,
  ]);

  /**
   * 아이템 목록 초기화
   */
  const resetItems = useCallback(() => {
    setClassItems([]);
  }, []);

  /**
   * 아이템 검증
   */
  const validateItems = useCallback(() => {
    const errors: string[] = [];

    if (classItems.length === 0) {
      errors.push("최소 하나 이상의 투자 종목을 추가해주세요.");
    }

    // 각 아이템의 가격 데이터 검증 - 모든 인덱스(1차~N차가격 + 종료가) null이 아니고 0보다 큰 값인지 확인
    const invalidItems = classItems.filter(item => 
      item.money.some((price, index) => price === null || price === undefined || price <= 0)
    );

    if (invalidItems.length > 0) {
      errors.push("모든 투자 종목의 가격을 입력해주세요.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [
    classItems,
  ]);

  return {
    classItems,
    stockTableData,
    addItems,
    removeItems,
    updateItemPrice,
    adjustAllItemsForNewRound,
    getApiRequestData,
    resetItems,
    validateItems,
  };
};
