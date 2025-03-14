import { Button, Input, Save, Select } from '@mozu/ui';
import {
  AssetBox,
  AssetField,
  AssetInput,
  BtnContainer,
  Container,
  Contents,
  Header,
  InputBox,
  SelectBox,
  SelectField,
  TableField,
  TextField,
} from './ClassCreate';
import { color } from '@mozu/design-token';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArticleTables, StockTables } from '@/components';
import { useGetClassDetail } from '@/apis';
import { useClassStore } from '@/store';

export const ClassEdit = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<string[]>(['1,000,000']);
  const { classId, id } = useParams();
  const articleId = id ? parseInt(id) : null;
  const { data } = useGetClassDetail(articleId);
  const { classData, setClassData } = useClassStore();

  useEffect(() => {
    if (data) {
      const safeData = {
        ...data,
        classItems:
          data.classItems?.map((item) => ({
            ...item,
            stockChecked: false,
          })) ?? [],
        classArticles:
          data.classArticles?.map((article) => ({
            ...article,
            articleGroupChecked: false,
            articles:
              article.articles?.map((a) => ({
                ...a,
                articleChecked: false,
              })) ?? [],
          })) ?? [],
      };
      setClassData(safeData);
    }
  }, [data]);

  const priceChangeHandler =
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
        수업환경 수정
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
            저장하기
            <Save size={20} color="white" />
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
          <StockTables isEdit={true} data={classData?.classItems ?? []} />
          <ArticleTables
            isEdit={true}
            data={classData?.classArticles ?? []}
            round={1}
          />
        </TableField>
      </Contents>
    </Container>
  );
};
