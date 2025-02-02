import styled from '@emotion/styled';
import {
  Table,
  Tbody,
  Thead,
} from '/Users/jidohyun/Desktop/백업/mozu-FE/packages/admin/src/components/common/Tables';
import { color, font } from '@mozu/design-token';
import { RateDiv } from '/Users/jidohyun/Desktop/백업/mozu-FE/packages/admin/src/components/monitoring/TeamInfoTable';

interface IThType {
  width: string;
  padding: string;
  justifyContent: string;
}

interface ITdProps {
  width: string;
  align: string;
  padding: string;
  font: any;
}

export const StockTable = () => {
  const headers = [
    { text: '종목 이름', width: '376px' },
    { text: '거래 가격', width: '140px' },
    { text: '수량', width: '100px' },
    { text: '거래 금액', width: '140px' },
    { text: '현재 가격', width: '140px' },
    { text: '수익률', width: '200px' },
  ];

  const datas = [
    {
      id: 1,
      datas: [
        { text: '삼성전자', value: '종목 이름', width: '376px' },
        { text: '53,800원', value: '거래 가격', width: '140px' },
        { text: '10', value: '수량', width: '100px' },
        { text: '538,000원', value: '거래 금액', width: '140px' },
        { text: '51,100원', value: '현재 가격', width: '140px' },
        {
          text: '511,000원',
          value: '수익률',
          width: '200px',
          rate: '-27,000원 (-5.02%)',
        },
      ],
    },
    {
      id: 2,
      datas: [
        { text: 'LG전자', value: '종목 이름', width: '376px' },
        { text: '85,600원', value: '거래 가격', width: '140px' },
        { text: '3', value: '수량', width: '100px' },
        { text: '256,800원', value: '거래 금액', width: '140px' },
        { text: '85,800원', value: '현재 가격', width: '140px' },
        {
          text: '257,400원',
          value: '수익률',
          width: '200px',
          rate: '+600원 (+0.23%)',
        },
      ],
    },
  ];

  return (
    <Table>
      <Thead>
        <tr>
          {headers.map((data, index) => (
            <Th
              key={index}
              width={data.width}
              padding={index !== 5 ? '0px 0px 0px 16px' : '0px 16px 0px 0px'}
              justifyContent={index === 5 ? 'center' : 'flex-start'}
            >
              {data.text}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {datas.map((data) => (
          <tr key={data.id}>
            {data.datas.map((data, index) => (
              <Td
                key={index}
                width={data.width}
                padding={index !== 5 ? '0px 0px 0px 16px' : '0px 16px 0px 0px'}
                align={index === 5 ? 'right' : 'left'}
                font={index === 5 ? font.b1 : font.b2}
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

const Th = styled.th<IThType>`
  font: ${font.b1};
  border: 1px solid ${color.zinc[200]};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justifyContent};
  width: ${(props) => props.width};
  padding: ${(props) => props.padding};
`;

const Td = styled.td<ITdProps>`
  padding: ${(props) => props.padding};
  text-align: ${(props) => props.align};
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 72px;
  font: ${(props) => props.font};
  border: 1px solid ${color.zinc[200]};
  width: ${(props) => props.width};
`;
