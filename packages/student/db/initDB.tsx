import Dexie from 'dexie';

// 데이터베이스 초기화
const db = new Dexie('student');
db.version(1).stores({
  holdItems:
    '++id, itemId, itemName, itemCnt, buyMoney, totalMoney, nomMoney, valMoney, valProfit, profitNum',
  team: '++id, name, baseMoney, totalMoney, cashMoney, valueMoney, invDeg, valueProfit, profitNum',
  tradeHistory: '++id, orderType, itemName, itemMoney, totalMoney, orderCount',
  items: '++id, itemId, itemName, itemMoney',
});

// 데이터 추가 함수
export const addData = async (storeName, data) => {
  try {
    const id = await db[storeName].add(data);
    return id;
  } catch (error) {
    console.error('데이터 추가 오류:', error);
  }
};

// 특정 데이터 가져오기
export const getData = async (storeName, id) => {
  try {
    const data = await db[storeName].get(id);
    return data;
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
  }
};

// 전체 데이터 가져오기
export const getAllData = async (storeName) => {
  try {
    const allData = await db[storeName].toArray();
    return allData;
  } catch (error) {
    console.error('전체 데이터 가져오기 오류:', error);
  }
};

// 데이터 삭제 함수
export const deleteData = async (storeName, id) => {
  try {
    await db[storeName].delete(id);
    console.log(`ID ${id} 삭제 완료`);
  } catch (error) {
    console.error('데이터 삭제 오류:', error);
  }
};

// 데이터 업데이트 함수
export const updateData = async (storeName, id, updateObj) => {
  try {
    await db[storeName].update(id, updateObj);
    console.log(`ID ${id} 업데이트 완료`);
  } catch (error) {
    console.error('데이터 업데이트 오류:', error);
  }
};

export default db;
