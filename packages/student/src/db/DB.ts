import Dexie from 'dexie';
import { Team, TradeHistory, Item } from './type';

class StudentDB extends Dexie {
  team!: Dexie.Table<Team, number>;
  tradeHistory!: Dexie.Table<TradeHistory, number>;
  items!: Dexie.Table<Item, number>;
  constructor() {
    super('student');
    this.version(2).stores({
      team: '++id, cashMoney',
      tradeHistory:
        '++id, itemId, itemName, itemMoney, orderCount, totalMoney, orderType, invDeg, timestamp',
      items:
        '++id, itemId, itemName, buyMoney, itemCnt, totalMoney, nowMoney, valMoney, valProfit, profitNum, tradeCount', // 추가된 필드
    });

    this.version(1).upgrade((tx) => {
      return tx
        .table('items')
        .toCollection()
        .modify((item) => {
          item.tradeCount = 0; // 기존 데이터에 기본값 설정
        });
    });
  }
}

export const fetchTradeHistory = async () => {
  return await db.tradeHistory.reverse().toArray();
};

export const db = new StudentDB();
