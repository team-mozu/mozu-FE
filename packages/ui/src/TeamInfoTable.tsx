import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Tbody, Thead } from './Tables';

interface IThProps {
  width: string;
  justify: string;
  padding: string;
}
interface ITdProps {
  width: string;
  align: string;
  padding: string;
  font: any;
}

interface IRateType {
  color: string;
}

export const TeamInfoTable = () => {
  const headers = [
    { text: '팀명', width: '312px' },
    { text: '1차 투자', width: '200px' },
    { text: '2차 투자', width: '200px' },
    { text: '3차 투자', width: '200px' },
    { text: '4차 투자', width: '200px' },
    { text: '5차 투자', width: '200px' },
    {
      text: '총 자산\n(총 수익률)',
      width: '200px',
    },
  ];

  const contents = [
    {
      id: 1,
      data: [
        {
          text: '대마고 화이팅',
          value: '팀명',
          width: '312px',
        },
        {
          text: '511,000',
          rate: '+200원 (+0.23%)',
          value: '1차 투자',
          width: '200px',
        },
        {
          text: '511,000',
          rate: '-200원 (-0.23%)',
          value: '2차 투자',
          width: '200px',
        },
        {
          text: '511,000',
          rate: '+200원 (+0.23%)',
          value: '3차 투자',
          width: '200px',
        },
        {
          text: '',
          value: '4차 투자',
          width: '200px',
        },
        {
          text: '',
          value: '5차 투자',
          width: '200px',
        },
        {
          text: '511,000',
          rate: '+400원 (+0.53%)',
          value: '총 자산',
          width: '200px',
        },
      ],
    },
    {
      id: 2,
      data: [
        {
          text: '대마고',
          value: '팀명',
          width: '312px',
        },
        {
          text: '511,000',
          rate: '+200원 (+0.23%)',
          value: '1차 투자',
          width: '200px',
        },
        {
          text: '511,000',
          rate: '+200원 (+0.23%)',
          value: '2차 투자',
          width: '200px',
        },
        {
          text: '511,000',
          rate: '-100원 (-0.13%)',
          value: '3차 투자',
          width: '200px',
        },
        {
          text: '',
          value: '4차 투자',
          width: '200px',
        },
        {
          text: '',
          value: '5차 투자',
          width: '200px',
        },
        {
          text: '511,000',
          rate: '+500원 (+0.53%)',
          value: '총 자산',
          width: '200px',
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
              justify={index === 0 ? 'left' : 'center'}
              padding={index === 0 ? '16px' : '0px'}
            >
              {data.text}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {contents.map((content) => (
          <tr key={content.id}>
            {content.data.map((data, index) => (
              <Td
                width={data.width}
                key={index}
                align={index !== 0 ? 'right' : 'left'}
                padding={index !== 0 ? '0px 16px 0px 0px' : '0px 0px 0px 16px'}
                font={index !== 0 ? font.t1 : font.t4}
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
                )}{' '}
              </Td>
            ))}
          </tr>
        ))}
      </Tbody>
    </Table>
  );
};

const RateDiv = styled.div<IRateType>`
  font: ${font.l1};
  color: ${(props) => props.color};
`;

const Table = styled.table`
  border-radius: 4px;
  border-collapse: collapse;
  overflow: hidden;
`;

const Th = styled.th<IThProps>`
  border: 1px solid ${color.zinc[200]};
  width:${(props) => props.width}
  padding: 26px 0px;
  padding-left:${(props) => props.padding};
  height: 72px;
  font: ${font.b1};
  display:flex;
  align-items:center;
  justify-content:${(props) => props.justify};
  white-space:pre-line;
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
