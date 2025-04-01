//! 현재는 사용하지 않는 함수입니다.
// import { db } from './DB';
// import { Item, TradeHistory } from './type';

// export const processData = {
//   getTeam: async () => await db.team.toArray(),
//   updataTeamCash: async (amount: number) => {
//     const team = await db.team.get(1);
//     if (team) {
//       return db.team.update(1, { cashMoney: amount });
//     }
//   },

//   addTrade: async (trade: Omit<TradeHistory, 'id' | 'timestamp'>) => {
//     return db.tradeHistory.add({
//       ...trade,
//       timestamp: new Date(),
//     });
//   },
//   getTradesByItemId: async (itemId: string) => {
//     return db.tradeHistory.where('itemId').equals(itemId).toArray();
//   },
//   addItem: async (item: Omit<Item, 'id'>) => db.items.add(item),
//   updateItemQuantity: async (itemId: string, newQuantity: number) => {
//     const item = await db.items.get({ itemId });
//     if (item) {
//       return db.items.update(item.id!, { itemCnt: newQuantity });
//     }
//   },
//   getAllItems: async () => await db.items.toArray(),
// };
