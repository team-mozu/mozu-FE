import { Select } from '@mozu/ui';

const dummyData = ['1', '2', '3', '4', '5'];

export const Test = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Select
        data={dummyData}
        width={120}
        height={48}
        padding={{ top: 14, right: 16, bottom: 14, left: 16 }}
      />
    </div>
  );
};
