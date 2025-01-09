import { Select } from '@mozu/ui';

const dummyData = ['1', '2', '3', '4', '5'];

export const Test = () => {
  return (
    <Select
      data={dummyData}
      width={20}
      height={20}
      padding={{ top: 20, right: 20, bottom: 20, left: 20 }}
    />
  );
};
