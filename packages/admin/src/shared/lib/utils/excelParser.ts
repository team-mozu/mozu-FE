import * as XLSX from "xlsx";

export interface ExcelStockData {
  itemCode: string;
  itemName: string;
  prices: number[];
}

export interface ParsedExcelData {
  stocks: ExcelStockData[];
  errors: string[];
}

/**
 * 엑셀 파일을 파싱하여 주식 데이터를 추출합니다
 * 예상 형식:
 * | 종목코드 | 종목명 | 1차가격 | 2차가격 | 3차가격 | 4차가격 | 5차가격 |
 */
export const parseExcelFile = async (file: File, maxDegree: number = 5): Promise<ParsedExcelData> => {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, {
          type: "array",
        });

        // 첫 번째 시트를 사용
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 시트를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as unknown[][];

        const result = parseSheetData(jsonData, maxDegree);
        resolve(result);
      } catch (error) {
        console.error("엑셀 파일 파싱 에러:", error);
        resolve({
          stocks: [],
          errors: [
            "엑셀 파일을 읽는 중 오류가 발생했습니다.",
          ],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        stocks: [],
        errors: [
          "파일을 읽을 수 없습니다.",
        ],
      });
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * 시트 데이터를 파싱하여 주식 정보를 추출합니다
 */
const parseSheetData = (data: unknown[][], maxDegree: number): ParsedExcelData => {
  const stocks: ExcelStockData[] = [];
  const errors: string[] = [];

  if (data.length < 2) {
    errors.push("데이터가 충분하지 않습니다. 헤더와 최소 1개의 데이터 행이 필요합니다.");
    return {
      stocks,
      errors,
    };
  }

  // 헤더 행 확인
  const headers = data[0] as string[];

  // 실제 헤더 구조 분석
  console.log("🔍 [DEBUG] 헤더 분석:");
  console.log("  - 원본 헤더:", headers);
  headers.forEach((header, index) => {
    console.log(`  - ${index}: "${header}" (타입: ${typeof header})`);
  });

  // 헤더에서 종목설명 컬럼이 있는지 확인 (실제로는 없을 것으로 예상)
  const hasDescription = false; // 실제 데이터에는 종목설명이 없음

  // 데이터 행 처리
  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex] as unknown[];

    if (!row || row.length < 3) {
      console.log(`🔍 [DEBUG] ${rowIndex + 1}행 건너뛰기: 데이터 부족 (길이: ${row?.length})`);
      continue; // 빈 행 건너뛰기 (최소 종목코드, 종목명, 1차가격 필요)
    }

    const itemCode = String(row[0] || "").trim();
    const itemName = String(row[1] || "").trim();

    console.log(`🔍 [DEBUG] ${rowIndex + 1}행 파싱:`);
    console.log(`  - 원시 종목코드: "${row[0]}" (타입: ${typeof row[0]})`);
    console.log(`  - 원시 종목이름: "${row[1]}" (타입: ${typeof row[1]})`);
    console.log(`  - 파싱된 종목코드: "${itemCode}"`);
    console.log(`  - 파싱된 종목이름: "${itemName}"`);
    console.log(`  - 행 길이: ${row.length}`);
    console.log(`  - 전체 행:`, row);

    if (!itemCode || !itemName) {
      errors.push(`${rowIndex + 1}행: 종목코드 또는 종목명이 없습니다. (코드: "${itemCode}", 이름: "${itemName}")`);
      continue;
    }

    // 종목설명이 있는지 확인
    let itemDesc = "";
    let priceStartIndex = 2; // 기본적으로 3번째 컬럼부터 가격

    if (hasDescription) {
      itemDesc = String(row[2] || "").trim();
      priceStartIndex = 3; // 종목설명이 있으면 4번째 컬럼부터 가격
    }

    // 엑셀에서 실제 가격 컬럼 수 계산
    const availableColumns = row.length - priceStartIndex;
    const actualDataDegree = Math.max(0, availableColumns - 1); // 종료가 제외한 차수

    console.log(`  - 사용 가능한 가격 컬럼 수: ${availableColumns}`);
    console.log(`  - 실제 데이터 차수: ${actualDataDegree}`);
    console.log(`  - 요청된 차수: ${maxDegree}`);

    // 차수 불일치 경고
    if (actualDataDegree !== maxDegree) {
      const warningMsg = actualDataDegree < maxDegree
        ? `${rowIndex + 1}행: 엑셀 데이터 차수(${actualDataDegree})가 설정된 차수(${maxDegree})보다 낮습니다. 부족한 차수는 0으로 채워집니다.`
        : `${rowIndex + 1}행: 엑셀 데이터 차수(${actualDataDegree})가 설정된 차수(${maxDegree})보다 높습니다. 초과 데이터는 무시됩니다.`;

      console.log(`  ⚠️ ${warningMsg}`);
      errors.push(warningMsg);
    }

    // 가격 데이터 추출 (종료가 포함)
    const prices: number[] = [];
    const totalColumns = maxDegree + 1; // 1차~N차 + 종료가

    for (let priceIndex = 0; priceIndex < totalColumns; priceIndex++) {
      const cellValue = row[priceStartIndex + priceIndex];
      const columnName = priceIndex < maxDegree ? `${priceIndex + 1}차가격` : "종료가";

      console.log(`  - ${columnName}: 원시값 "${cellValue}" (타입: ${typeof cellValue})`);

      // 엑셀에 데이터가 없는 경우 (차수 부족)
      if (priceIndex >= availableColumns) {
        prices.push(0);
        console.log(`  - ${columnName}: 데이터 없음 -> 0으로 설정`);
        continue;
      }

      if (cellValue === undefined || cellValue === null || cellValue === "") {
        prices.push(0); // 빈 값은 0으로 처리
        continue;
      }

      // 쉼표 제거 후 숫자 변환 (67,800 -> 67800)
      const cleanValue = String(cellValue).replace(/,/g, "");
      const price = parseFloat(cleanValue);

      console.log(`  - ${columnName}: 정제값 "${cleanValue}" -> 숫자 ${price}`);

      if (Number.isNaN(price)) {
        errors.push(`${rowIndex + 1}행 ${columnName}: 유효하지 않은 숫자입니다. (${cellValue})`);
        prices.push(0);
      } else if (price < 0) {
        errors.push(`${rowIndex + 1}행 ${columnName}: 음수는 허용되지 않습니다.`);
        prices.push(0);
      } else {
        prices.push(Math.round(price)); // 정수로 변환
      }
    }

    console.log(`🔍 [DEBUG] ${rowIndex + 1}행 최종 결과:`);
    console.log(`  - 종목코드: "${itemCode}"`);
    console.log(`  - 종목이름: "${itemName}"`);
    console.log(`  - 가격 배열:`, prices);
    console.log(`  - 가격 시작 인덱스: ${priceStartIndex}`);
    console.log(`  - 총 컬럼 수: ${totalColumns}`);

    stocks.push({
      itemCode,
      itemName,
      prices,
    });
  }

  if (stocks.length === 0) {
    errors.push("유효한 주식 데이터를 찾을 수 없습니다.");
  }

  return {
    stocks,
    errors,
  };
};

/**
 * 엑셀 파일 유효성 검사
 */
export const validateExcelFile = (file: File): string | null => {
  const validExtensions = [
    ".xlsx",
    ".xls",
  ];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));

  if (!validExtensions.includes(fileExtension)) {
    return "엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.";
  }

  // 파일 크기 제한 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return "파일 크기는 10MB를 초과할 수 없습니다.";
  }

  return null;
};

/**
 * 엑셀 템플릿 다운로드용 데이터 생성
 */
export const generateExcelTemplate = (maxDegree: number = 5) => {
  const headers = [
    "종목코드",
    "종목명",
  ];

  // 1차~maxDegree차 가격 헤더 추가
  for (let i = 1; i <= maxDegree; i++) {
    headers.push(`${i}차가격`);
  }

  // 종료가 헤더 추가
  headers.push("종료가");

  const exampleData = [
    [
      "005930",
      "삼성전자",
      70000,
      72000,
      74000,
      76000,
      78000,
      80000, // 종료가
    ],
    [
      "035420",
      "NAVER",
      150000,
      155000,
      160000,
      165000,
      170000,
      175000, // 종료가
    ],
    [
      "035720",
      "카카오",
      45000,
      47000,
      49000,
      51000,
      53000,
      55000, // 종료가
    ],
  ];

  // 데이터 행에서 maxDegree + 종료가 + 종목코드&이름 = maxDegree + 3개 컬럼만 사용
  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...exampleData.map(row => row.slice(0, maxDegree + 3)), // 종목코드, 종목명, N차가격들, 종료가
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "주식데이터");

  return workbook;
};

/**
 * 실제 주식 데이터로 엑셀 파일 생성
 */
export const generateExcelFromStockData = (stockData: any[], maxDegree: number = 5) => {
  const headers = [
    "종목코드",
    "종목명",
  ];

  // 1차~maxDegree차 가격 헤더 추가
  for (let i = 1; i <= maxDegree; i++) {
    headers.push(`${i}차가격`);
  }

  // 종료가 헤더 추가
  headers.push("종료가");

  // 실제 데이터 변환
  const excelData = stockData.map(stock => {
    const row = [
      stock.itemCode,
      stock.itemName,
    ];

    // 1차~maxDegree차 가격 추가
    for (let i = 0; i < maxDegree; i++) {
      row.push(stock.money[i] || 0);
    }

    // 종료가 추가 (money[5])
    row.push(stock.money[5] || 0);

    return row;
  });

  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...excelData,
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "주식데이터");

  return workbook;
};

/**
 * 실제 주식 데이터로 엑셀 파일 다운로드
 */
export const downloadExcelWithStockData = (stockData: any[], maxDegree: number = 5, filename?: string) => {
  const workbook = generateExcelFromStockData(stockData, maxDegree);
  const defaultFilename = `주식데이터_${new Date().toISOString().slice(0, 10)}_${maxDegree}차.xlsx`;
  XLSX.writeFile(workbook, filename || defaultFilename);
};

/**
 * 주식 데이터가 엑셀 내보내기에 적합한지 검증
 */
export const validateStockDataForExport = (stockData: any[], maxDegree: number = 5): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 1. 테이블이 비어있는지 확인
  if (!stockData || stockData.length === 0) {
    errors.push("테이블에 데이터가 없습니다.");
    return { isValid: false, errors };
  }

  // 2. 각 종목의 필수 데이터 확인
  for (let i = 0; i < stockData.length; i++) {
    const stock = stockData[i];
    const rowNumber = i + 1;

    // 종목코드 확인
    if (!stock.itemCode || stock.itemCode === 0) {
      errors.push(`${rowNumber}행: 종목코드가 없습니다.`);
    }

    // 종목명 확인
    if (!stock.itemName || stock.itemName.trim() === "") {
      errors.push(`${rowNumber}행: 종목명이 없습니다.`);
    }

    // money 배열 확인
    if (!Array.isArray(stock.money) || stock.money.length < 6) {
      errors.push(`${rowNumber}행: 가격 데이터 구조가 잘못되었습니다.`);
      continue;
    }

    // 1차~maxDegree차 가격 확인 (null이 아니고 0보다 큰 값)
    for (let degree = 0; degree < maxDegree; degree++) {
      if (stock.money[degree] === null || stock.money[degree] === undefined || stock.money[degree] <= 0) {
        errors.push(`${rowNumber}행: ${degree + 1}차 가격이 설정되지 않았습니다.`);
      }
    }

    // 종료가 확인 (money[5])
    if (stock.money[5] === null || stock.money[5] === undefined || stock.money[5] <= 0) {
      errors.push(`${rowNumber}행: 종료가가 설정되지 않았습니다.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 엑셀 템플릿 파일 다운로드
 */
export const downloadExcelTemplate = (maxDegree: number = 5) => {
  const workbook = generateExcelTemplate(maxDegree);
  XLSX.writeFile(workbook, `주식데이터_템플릿_${maxDegree}차.xlsx`);
};
