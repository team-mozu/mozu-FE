import { Select, Tables } from '@mozu/ui';

const dummyData = ['1', '2', '3', '4', '5'];

export const Test = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Tables edit={true} tableName="article" />
    </div>
  );
};
