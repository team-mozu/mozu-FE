import styled from '@emotion/styled';
import { Tbody, Thead } from './Tables';
import { color, font } from '@mozu/design-token';
import { RateDiv } from './TeamInfoTable';

interface IThProps {
  width: string;
  textAlign: string;
  padding: string;
}

interface ITdProps {
  width: string;
  textAlign: string;
  padding: string;
  color: string;
}

export const TeamInvestStatusTable = () => {
  const header = [
    { text: '구분', width: '120px' },
    { text: '종목 이름', width: '300px' },
    { text: '거래 가격', width: '140px' },
    { text: '수량', width: '100px' },
    { text: '현재 가격', width: '140px' },
    { text: '수익률', width: '200px' },
  ];

  const contents = [
    {
      id: 1,
      data: [
        { text: '매수', value: '구분', width: '120px' },
        { text: '삼성전자', value: '종목 이름', width: '300px' },
        { text: '53,800', value: '거래 가격', width: '140px' },
        { text: '10', value: '수량', width: '100px' },
        { text: '51,000', value: '현재 가격', width: '140px' },
        {
          text: '511,000',
          rate: '-27,000 (-5.02%)',
          value: '수익률',
          width: '200px',
        },
      ],
    },
    {
      id: 2,
      data: [
        { text: '매도', value: '구분', width: '120px' },
        { text: '삼성전자', value: '종목 이름', width: '300px' },
        { text: '53,800', value: '거래 가격', width: '140px' },
        { text: '10', value: '수량', width: '100px' },
        { text: '56,000', value: '현재 가격', width: '140px' },
        {
          text: '560,000',
          rate: '+27,000 (+5.02%)',
          value: '수익률',
          width: '200px',
        },
      ],
    },
  ];

  return (
    <Table>
      <Thead>
        <tr>
          {header.map((data, index) => (
            <Th
              key={index}
              width={data.width}
              textAlign={index === 0 || index === 5 ? 'center' : 'left'}
              padding={index === 0 || index === 5 ? '0px' : '16px'}
            >
              {data.text}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {contents.map((data) => (
          <tr key={data.id}>
            {data.data.map((data, index) => (
              <Td
                key={index}
                width={data.width}
                textAlign={
                  index === 0 ? 'center' : index === 5 ? 'right' : 'left'
                }
                padding={
                  index === 0
                    ? '0px 0px 0px 0px'
                    : index === 5
                      ? '0px 16px 0px 0px'
                      : '0px 0px 0px 16px'
                }
                color={
                  index === 0
                    ? data.text === '매수'
                      ? color.red[500]
                      : data.text === '매도'
                        ? color.blue[500]
                        : color.black
                    : color.black
                }
              >
                {data.text}
                {data.rate && (
                  <RateDiv
                    color={
                      data.rate.indexOf('-') !== -1
                        ? color.blue[500]
                        : color.red[500]
                    }
                  >
                    {data.rate}
                  </RateDiv>
                )}
              </Td>
            ))}
          </tr>
        ))}
      </Tbody>
    </Table>
  );
};

const Table = styled.table`
  border-radius: 4px;
  border-collapse: separate;
  overflow: hidden;
`;

const Th = styled.th<IThProps>`
  font: ${font.b1};
  height: 64px;
  display: flex;
  border: 1px solid ${color.zinc[200]};
  align-items: center;
  width: ${(props) => props.width};
  justify-content: ${(props) => props.textAlign};
  padding-left: ${(props) => props.padding};
`;

const Td = styled.td<ITdProps>`
  font: ${font.b2};
  border: 1px solid ${color.zinc[200]};
  height: 64px;
  color: ${(props) => props.color};
  padding: ${(props) => props.padding};
  display: flex;
  flex-direction: column;
  text-align: ${(props) => props.textAlign};
  justify-content: center;
`;
