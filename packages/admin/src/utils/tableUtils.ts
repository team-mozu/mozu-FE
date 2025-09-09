import type { TeamInfo } from "@/store";

export interface TableCellData {
  type: 'empty' | 'progress' | 'completed';
  data?: {
    totalMoney: number;
    valMoney: number;
    profitNum: string;
    isNegative: boolean;
  };
}

export interface TeamTableRow {
  teamId: number;
  teamName: string;
  schoolName: string;
  isCompleted: boolean;
  cells: TableCellData[];
  totalAssets: TableCellData;
}

export const createTableHeaders = (maxInvDeg: number): string[] => {
  const headers = ["팀명"];
  for (let i = 1; i <= maxInvDeg; i++) {
    headers.push(`${i}차 투자`);
  }
  headers.push("총자산");
  return headers;
};

export const transformTeamDataToTableRows = (
  teamInfo: TeamInfo[],
  currentInvDeg: number,
  maxInvDeg: number
): TeamTableRow[] => {
  return teamInfo.map(team => {
    const cells: TableCellData[] = [];
    
    // 각 투자 차수별 셀 데이터 생성
    for (let degIndex = 0; degIndex < maxInvDeg; degIndex++) {
      const degree = degIndex + 1;
      
      if (degree > currentInvDeg) {
        // 아직 진행되지 않은 차수
        cells.push({ type: 'empty' });
      } else {
        const tradeData = team.trade?.[degIndex];
        
        if (!tradeData) {
          // 진행 중인 차수
          cells.push({ type: 'progress' });
        } else {
          // 완료된 차수
          const isNegative = tradeData.profitNum.includes("-");
          cells.push({
            type: 'completed',
            data: {
              totalMoney: tradeData.totalMoney,
              valMoney: tradeData.valMoney,
              profitNum: tradeData.profitNum,
              isNegative,
            }
          });
        }
      }
    }
    
    // 총자산 셀 데이터
    const lastTrade = team.trade?.at(-1);
    const totalAssets: TableCellData = lastTrade
      ? {
          type: 'completed',
          data: {
            totalMoney: lastTrade.totalMoney,
            valMoney: lastTrade.valMoney,
            profitNum: lastTrade.profitNum,
            isNegative: lastTrade.profitNum.includes("-"),
          }
        }
      : { type: 'progress' };
    
    return {
      teamId: team.teamId,
      teamName: team.teamName,
      schoolName: team.schoolName,
      isCompleted: Boolean(team.trade?.length && team.trade.length >= currentInvDeg),
      cells,
      totalAssets,
    };
  });
};

export const roundToFixed = (num: number, decimals: number): string => {
  return Number(num.toFixed(decimals)).toString();
};