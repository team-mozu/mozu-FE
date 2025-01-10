import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Plus } from './assets';
import { useEffect, useState } from 'react';
import { Button, CheckBox } from './index';

interface ThProps {
  width: string;
}

interface EditType {
  edit: boolean;
}

export const InvestTable = ({ edit }: EditType) => {
  const headers = [
    { text: '종목코드', value: '종목코드', width: '120px' },
    { text: '종목이름', value: '종목이름', width: '500px' },
    { text: '현재가', value: '현재가', width: '140px' },
    { text: '1차', value: '1차', width: '140px' },
    { text: '2차', value: '2차', width: '140px' },
    { text: '3차', value: '3차', width: '140px' },
    { text: '4차', value: '4차', width: '140px' },
    { text: '5차', value: '5차', width: '140px' },
  ];
  const [headCheck, setHeadCheck] = useState<boolean>(false);

  const newData = [
    // 추가될 더미 데이터들
    {
      checked: false,

      details: [
        { text: '000660', value: '종목코드', width: '120px' },
        { text: 'SK하이닉스', value: '종목이름', width: '500px' },
        { text: '110,000', value: '현재가', width: '140px' },
      ],
    },
  ];

  const [datas, setDatas] = useState([
    // 현재 추가되어 있는 데이터
    {
      checked: false,

      details: [
        { text: '005930', value: '종목코드', width: '120px' },
        { text: '삼성전자', value: '종목이름', width: '500px' },
        { text: '53,600', value: '현재가', width: '140px' },
      ],
    },
    {
      checked: false,

      details: [
        { text: '000660', value: '종목코드', width: '120px' },
        { text: 'SK하이닉스', value: '종목이름', width: '500px' },
        { text: '110,000', value: '현재가', width: '140px' },
      ],
    },
    {
      checked: false,
      details: [
        { text: '005380', value: '종목코드', width: '120px' },
        { text: '현대차', value: '종목이름', width: '500px' },
        { text: '200,000', value: '현재가', width: '140px' },
      ],
    },
  ]);

  const handleDeleteChecked = () => {
    const filteredData = datas.filter((data) => !data.checked);
    setDatas(filteredData);
    setHeadCheck(false);
  };

  const addRow = () => {
    setDatas(datas.concat(newData));
  };

  const [prices, setPrices] = useState<string[]>(
    Array(5 * datas.length).fill(''),
  );

  useEffect(() => {
    setPrices((prevPrices) => {
      const newPrices = Array(5 * datas.length).fill('');
      return newPrices.map((_, index) => prevPrices[index] || '');
    });
  }, [datas.length]);

  const priceChangeHandler = // 숫자를 변경해줌 11111 => 11,111
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      const numericValue = Number(inputValue.replace(/,/g, ''));

      const newPrices = [...prices];

      if (isNaN(numericValue) || inputValue === '') {
        newPrices[index] = '';
      } else {
        newPrices[index] = numericValue.toLocaleString('ko-KR');
      }

      setPrices(newPrices);
    };

  const handleCheckboxChange = (index: number) => {
    const newData = [...datas];
    newData[index].checked = !newData[index].checked;
    setDatas(newData);
  };

  const headHandleCheckboxChange = () => {
    const newHeadCheck = !headCheck;
    setHeadCheck(newHeadCheck);

    const newData = datas.map((data) => ({
      ...data,
      checked: newHeadCheck,
    }));

    setDatas(newData);
  };

  return (
    <Table>
      <Caption>
        <CaptionBox>
          <Text>투자 종목</Text>
          <div onClick={handleDeleteChecked}>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[200]}
            >
              선택항목 삭제하기
            </Button>
          </div>
        </CaptionBox>
      </Caption>
      <Thead>
        <tr>
          {edit && (
            <CheckTh>
              <CheckBox
                onChange={headHandleCheckboxChange}
                checked={headCheck}
                id="head"
              />
            </CheckTh>
          )}

          {headers.map((header) => (
            <Th key={header.text} width={header.width}>
              {header.text}
            </Th>
          ))}
        </tr>
      </Thead>
      <Tbody>
        {datas.map((data, rowIndex) => (
          <tr key={rowIndex}>
            {edit && (
              <CheckTd>
                <CheckBox
                  checked={data.checked}
                  onChange={() => handleCheckboxChange(rowIndex)}
                  id={`checkbox-${rowIndex}`}
                />
              </CheckTd>
            )}

            {data.details.map((item, index) => (
              <Td key={index} width={item.width}>
                {item.text}
              </Td>
            ))}
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <Td key={`input-${rowIndex * 5 + index}`} width="140">
                  <Input
                    value={prices[rowIndex * 5 + index]}
                    type="text"
                    placeholder={`${index + 1}차 금액`}
                    onChange={priceChangeHandler(rowIndex * 5 + index)}
                    required
                  />
                </Td>
              ))}
          </tr>
        ))}
        {edit && (
          <tr>
            <PlusTd colSpan={9} width="1520" onClick={addRow}>
              <PlusField>
                <Plus size={20} color="black" />
                추가하기
              </PlusField>
            </PlusTd>
          </tr>
        )}
      </Tbody>
    </Table>
  );
};

const Text = styled.div`
  padding-top: 20px;
`;

const CaptionBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Table = styled.table`
  border-radius: 4px;
  border-collapse: separate;
  overflow: hidden;
`;

const Caption = styled.caption`
  font: ${font.b1};
  color: ${color.zinc[800]};
  margin-bottom: 18px;
`;

const CheckTh = styled.th`
  border: 1px solid ${color.zinc[200]};
  padding: 14px;
  height: 56px;
`;

const CheckTd = styled(CheckTh)``;

const Th = styled(CheckTh)<ThProps>`
  text-align: left;
  font: ${font.b1};
  width: ${(props) => props.width};
`;
const Td = styled(Th)``;

const PlusField = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`;

const PlusTd = styled(Td)`
  text-align: center;
  cursor: pointer;
  background-color: ${color.zinc[50]};
  &:hover {
    background-color: ${color.zinc[200]};
  }
`;

const Thead = styled.thead`
  > tr {
    background-color: ${color.orange[50]};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Tbody = styled.tbody`
  > tr {
    background-color: ${color.white};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  font: ${font.b1};
  width: 110px;
`;
