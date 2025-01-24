import { Tables } from '@/components';
import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { Button, Input, Select } from '@mozu/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export const CreateClass = () => {
  const [prices, setPrices] = useState<string[]>(['1,000,000']);
  const navigate = useNavigate();

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
  return (
    <Container>
      <Header>
        수업환경 생성
        <BtnContainer>
          <Button
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            color={color.zinc[800]}
            hoverBackgroundColor={color.zinc[100]}
            hoverBorderColor={color.zinc[100]}
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[400]}
            hoverBorderColor={color.orange[400]}
          >
            생성하기
          </Button>
        </BtnContainer>
      </Header>
      <Contents>
        <TextField>
          <InputBox>
            수업 이름
            <Input placeholder="수업 이름을 입력해 주세요.." width="1080px" />
          </InputBox>
          <SelectBox>
            투자 차수
            <SelectField>
              <Select
                data={['1', '2', '3', '4', '5']}
                width={120}
                height={48}
                padding={{ top: 14, bottom: 14, left: 16, right: 94 }}
              />
              차
            </SelectField>
          </SelectBox>
          <AssetBox>
            기초자산
            <AssetField>
              <AssetInput
                type="text"
                value={prices}
                onChange={priceChangeHandler(0)}
              />
              원
            </AssetField>
          </AssetBox>
        </TextField>
        <TableField>
          <Tables edit={true} tableName="invest" />
          <Tables edit={true} tableName="article" />
        </TableField>
      </Contents>
    </Container>
  );
};

export const TableField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const AssetField = styled.div`
  display: flex;
  align-items: center;
  font: ${font.t4};
  gap: 8px;
`;

export const AssetInput = styled.input`
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  padding: 14px 110px 14px 16px;
  height: 48px;
  width: 210px;
  font: ${font.b2};
`;

export const AssetBox = styled.div`
  display: flex;
  flex-direction: column;
  font: ${font.b1};
  gap: 8px;
`;

export const SelectField = styled.div`
  display: flex;
  align-items: center;
  font: ${font.t4};
  gap: 8px;
`;

export const SelectBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font: ${font.b1};
`;

export const TextField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

export const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  font: ${font.b1};
  gap: 8px;
`;

export const Contents = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  width: 1560px;
  height: fit;
  border-radius: 16px;
  padding: 32px 24px 52px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const BtnContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  gap: 8px;
`;

export const Header = styled.div`
  width: 1560px;
  height: 64px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  background-color: ${color.white};
  font: ${font.t1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px 12px 24px;
`;
