import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';

interface IThProp {
  width: string;
}

export const InvestInfoTable = () => {
  const header = ['종목 이름', '1차', '2차', '3차', '4차', '5차'];
  const contents = [
    {
      id: 1,
      data: [
        { text: '삼성전자', value: '종목 이름' },
        { text: '53,800', value: '1차' },
        { text: '53,800', value: '2차' },
        { text: '53,800', value: '3차' },
        { text: '53,800', value: '4차' },
        { text: '53,800', value: '5차' },
      ],
    },
    {
      id: 2,
      data: [
        { text: 'LG전자', value: '종목 이름' },
        { text: '43,800', value: '1차' },
        { text: '63,800', value: '2차' },
        { text: '53,800', value: '3차' },
        { text: '53,800', value: '4차' },
        { text: '53,800', value: '5차' },
      ],
    },
  ];
  return (
    <Table>
      <Thead>
        <tr>
          {header.map((data, index) => (
            <Th key={index} width={index === 0 ? '300' : '140'}>
              {data}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {contents.map((data) => (
          <tr key={data.id}>
            {data.data.map((data, index) => (
              <Td key={index} width={index === 0 ? '300' : '140'}>
                {data.text}
              </Td>
            ))}
          </tr>
        ))}
      </Tbody>
    </Table>
  );
};

const Th = styled.th<IThProp>`
  font: ${font.b1};
  border: 1px solid ${color.zinc[200]};
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 16px;
`;

const Td = styled(Th)`
  font: ${font.b2};
`;

const Table = styled.table`
  border-radius: 8px;
  border-collapse: separate;
  overflow: hidden;
  width: 1000px;
`;
const Thead = styled.thead`
  > tr {
    background-color: ${color.orange[50]};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const Tbody = styled.tbody`
  > tr {
    width: 100%;
    background-color: ${color.white};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
