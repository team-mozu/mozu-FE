import { color, font } from '@mozu/design-token';
import { Table, Tbody, Thead } from '../../admin/src/components/common/Tables';
import styled from '@emotion/styled';

interface IThProps {
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

const Th = styled.th<IThProps>`
  font: ${font.b1};
  border: 1px solid ${color.zinc[200]};
  height: 48px;
  display: flex;
  width: ${(props) => props.width};
  align-items: center;
  padding-left: 16px;
`;

const Td = styled(Th)`
  font: ${font.b2};
`;
