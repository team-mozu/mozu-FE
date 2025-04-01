import Dexie from 'dexie';
import { Team, TradeHistory, Item } from './type';

class StudentDB extends Dexie {
  team!: Dexie.Table<Team, number>;
  tradeHistory!: Dexie.Table<TradeHistory, number>;
  items!: Dexie.Table<Item, number>;
  constructor() {
    super('student');
    this.version(1).stores({
      team: '++id, cashMoney',
      tradeHistory:
        '++id, itemId, itemName, itemMoney, orderCount, totalMoney, orderType, invDeg, timestamp',
      items:
        '++id, itemId, itemName, buyMoney, itemCnt, totalMoney, nowMoney, valMoney, valProfit, profitNum',
    });
  }
}

export const db = new StudentDB();
