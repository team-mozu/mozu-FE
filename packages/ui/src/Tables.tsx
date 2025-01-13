import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Plus } from './assets';
import { useEffect, useState } from 'react';
import { Button, CheckBox, Select } from './index';

interface IThProps {
  width: string;
}

interface IEditType {
  edit: boolean;
  tableName: string;
}

export const Tables = ({ edit, tableName }: IEditType) => {
  const headers = [
    { text: '종목코드', value: '종목코드', width: '120px' },
    { text: '종목이름', value: '종목이름', width: '500px' },
    { text: '현재가', value: '현재가', width: '140px' },
    { text: '1차', value: '1차', width: edit ? '140px' : '160px' },
    { text: '2차', value: '2차', width: edit ? '140px' : '160px' },
    { text: '3차', value: '3차', width: edit ? '140px' : '160px' },
    { text: '4차', value: '4차', width: edit ? '140px' : '160px' },
    { text: '5차', value: '5차', width: edit ? '140px' : '160px' },
  ];
  const [headCheck, setHeadCheck] = useState<boolean>(false);

  const newInvestData = [
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

  const newArticleData = [
    {
      checked: false,
      title: '수학천재 지도현 돌연 은퇴 선언, 세계 수학계 깜짝놀라..',
    },
  ];

  const [investDatas, setInvestDatas] = useState([
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

  const [articleDatas, setArticleDatas] = useState([
    {
      checked: false,
      title: '윤 대통령 측 "탄핵소추 적법성 따질것"...헌재"협조해야"',
    },
    {
      checked: false,
      title: '윤 대통령 측 "탄핵소추 적법성 따질것"...헌재"협조해야"',
    },
    {
      checked: false,
      title: '윤 대통령 측 "탄핵소추 적법성 따질것"...헌재"협조해야"',
    },
  ]);

  const handleDeleteChecked = () => {
    if (tableName === 'invest') {
      const filteredData = investDatas.filter((data) => !data.checked);
      setInvestDatas(filteredData);
    } else {
      const filteredData = articleDatas.filter((data) => !data.checked);
      setArticleDatas(filteredData);
    }

    setHeadCheck(false);
  };

  const addRow = () => {
    if (tableName === 'invest') {
      setInvestDatas(investDatas.concat(newInvestData));
    } else {
      setArticleDatas(articleDatas.concat(newArticleData));
    }
  };

  const [prices, setPrices] = useState<string[]>(
    Array(5 * investDatas.length).fill(''),
  );

  useEffect(() => {
    setPrices((prevPrices) => {
      const newPrices = Array(5 * investDatas.length).fill('');
      return newPrices.map((item, index) => prevPrices[index] || '');
    });
  }, [investDatas.length]);

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
    if (tableName === 'invest') {
      const newData = [...investDatas];
      newData[index].checked = !newData[index].checked;
      setInvestDatas(newData);
    } else {
      const newData = [...articleDatas];
      newData[index].checked = !newData[index].checked;
      setArticleDatas(newData);
    }
  };

  const headHandleCheckboxChange = () => {
    const newHeadCheck = !headCheck;
    setHeadCheck(newHeadCheck);
    if (tableName === 'invest') {
      const newData = investDatas.map((data) => ({
        ...data,
        checked: newHeadCheck,
      }));

      setInvestDatas(newData);
    } else {
      const newData = articleDatas.map((data) => ({
        ...data,
        checked: newHeadCheck,
      }));

      setArticleDatas(newData);
    }
  };

  return tableName === 'invest' ? (
    <Table>
      <Caption>
        <CaptionBox>
          <Text>투자 종목</Text>
          {edit && (
            <div onClick={handleDeleteChecked}>
              <Button
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                hoverBackgroundColor={color.zinc[200]}
              >
                선택항목 삭제하기
              </Button>
            </div>
          )}
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

          {headers.map((header) =>
            !edit && header.text === '현재가' ? null : (
              <Th key={header.text} width={header.width}>
                {header.text}
              </Th>
            ),
          )}
        </tr>
      </Thead>
      <Tbody>
        {investDatas.map((data, rowIndex) => (
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

            {data.details.map((item, index) =>
              !edit && index === 2 ? null : (
                <Td key={index} width={item.width}>
                  {item.text}
                </Td>
              ),
            )}
            {edit
              ? Array(5)
                  .fill(null)
                  .map((item, index) => (
                    <Td key={`input-${rowIndex * 5 + index}`} width="140">
                      <Input
                        value={prices[rowIndex * 5 + index]}
                        type="text"
                        placeholder={`${index + 1}차 금액`}
                        onChange={priceChangeHandler(rowIndex * 5 + index)}
                        required
                      />
                    </Td>
                  ))
              : Array(5)
                  .fill(null)
                  .map((price, index) => (
                    <Td key={`input-${rowIndex * 5 + index}`} width="160">
                      {prices[rowIndex * 5 + index]}
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
  ) : (
    <Table>
      <Caption>
        <CaptionBox>
          <Text>기사 목록</Text>
          <Option>
            <SelectBox>
              <Select
                data={['1', '2', '3', '4', '5']}
                width={100}
                height={40}
                padding={{ top: 10, bottom: 10, right: 76, left: 16 }}
              />
              차
            </SelectBox>

            {edit && (
              <div onClick={handleDeleteChecked}>
                <Button
                  backgroundColor={color.zinc[50]}
                  borderColor={color.zinc[200]}
                  hoverBackgroundColor={color.zinc[200]}
                >
                  선택항목 삭제하기
                </Button>
              </div>
            )}
          </Option>
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
          <Th width="1460">기사 제목</Th>
        </tr>
      </Thead>
      <Tbody>
        {articleDatas.map((data, index) => (
          <tr key={index}>
            {edit && (
              <CheckTh>
                <CheckBox
                  checked={data.checked}
                  onChange={() => handleCheckboxChange(index)}
                  id={`checkbox-${index}`}
                />
              </CheckTh>
            )}
            <Td width="1460">{data.title}</Td>
          </tr>
        ))}
        {edit && (
          <tr>
            <PlusTd colSpan={9} width="1510" onClick={addRow}>
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

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Option = styled.div`
  display: flex;
  gap: 24px;
`;

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

const Th = styled(CheckTh)<IThProps>`
  text-align: left;
  font: ${font.b2};
  width: ${(props) => props.width};
`;
const Td = styled(Th)``;

const PlusField = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font: ${font.b1};
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
  font: ${font.b2};
  width: 110px;
`;
