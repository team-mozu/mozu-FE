import { db } from './DB';

export const initializeDB = async () => {
  try {
    if ((await db.team.count()) === 0) {
      await db.team.add({
        cashMoney: 1000000,
      });
    }
  } catch (error) {
    console.error('DB 초기화 실패:', error);
  }
};
