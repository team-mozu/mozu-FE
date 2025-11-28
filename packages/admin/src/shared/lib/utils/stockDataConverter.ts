import type { ExcelStockData } from "./excelParser";

// StockTables 컴포넌트에서 사용하는 StockData 타입
interface StockData {
  itemId: number;
  itemCode: number;
  itemName: string;
  money: (number | null)[]; // [1차가격, 2차가격, 3차가격, 4차가격, 5차가격, 종료가] - 0번 인덱스부터 시작
  stockChecked?: boolean;
}

/**
 * 엑셀 데이터를 StockData 형식으로 변환하는 함수
 * 차수 불일치 처리 포함
 */
export const convertExcelToStockData = (
  excelData: ExcelStockData[],
  selectedRound: number,
): StockData[] => {
  console.log("🔍 [DEBUG] 엑셀 데이터 변환 시작:", {
    excelDataLength: excelData.length,
    selectedRound,
    firstItem: excelData[0],
  });

  return excelData.map((item, index) => {
    // StockData의 money 배열: [1차, 2차, 3차, 4차, 5차, 종료가] (인덱스 0~5)
    const money = new Array(6).fill(null);

    // 엑셀 데이터의 차수 확인 (종료가 제외)
    const excelDegree = Math.max(0, item.prices.length - 1);

    console.log(`🔍 [DEBUG] 아이템 ${index + 1} 변환:`, {
      itemCode: item.itemCode,
      itemName: item.itemName,
      excelPricesLength: item.prices.length,
      excelDegree,
      selectedRound,
      rawPrices: item.prices,
    });

    // 1차~N차 가격 매핑 (둘 중 작은 값까지만 처리)
    const maxDegreeToProcess = Math.min(selectedRound, excelDegree);

    for (let i = 0; i < maxDegreeToProcess; i++) {
      money[i] = item.prices[i] > 0 ? item.prices[i] : null;
      console.log(`  - ${i + 1}차 가격: ${item.prices[i]} -> ${money[i]}`);
    }

    // 부족한 차수는 null로 유지 (이미 초기화됨)
    for (let i = maxDegreeToProcess; i < selectedRound; i++) {
      console.log(`  - ${i + 1}차 가격: 데이터 부족으로 null 유지`);
    }

    // 종료가 처리 (항상 배열의 마지막 요소, money[5]에 위치)
    const endPriceIndex = item.prices.length - 1;
    if (endPriceIndex >= 0 && item.prices[endPriceIndex] > 0) {
      money[5] = item.prices[endPriceIndex];
      console.log(`  - 종료가: ${item.prices[endPriceIndex]} -> ${money[5]}`);
    } else {
      console.log(`  - 종료가: 데이터 없음 또는 0 -> null 유지`);
    }

    const stockData = {
      itemId: Date.now() + index, // 임시 고유 ID 생성
      itemCode: parseInt(item.itemCode, 10) || 0, // 종목코드를 숫자로 변환
      itemName: item.itemName,
      money,
      stockChecked: false,
    };

    console.log(`🔍 [DEBUG] ${index + 1}번째 아이템 최종 변환:`, {
      원본: item,
      변환결과: stockData,
      차수비교: `엑셀:${excelDegree} vs 테이블:${selectedRound}`,
    });

    return stockData;
  });
};