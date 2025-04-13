import { Button, Input, Save, Select } from '@mozu/ui';
import {
  AssetField,
  AssetInput,
  BtnContainer,
  Container,
  Contents,
  Header,
  FlexColumnBox,
  SelectField,
  TableField,
  TextField,
} from './ClassCreate';
import { color } from '@mozu/design-token';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArticleTables, StockTables } from '@/components';
import { useEditClass, useGetClassDetail } from '@/apis';
import { useClassStore } from '@/store';

export const ClassEdit = () => {
  const navigate = useNavigate();
  const { classId, id } = useParams();
  const articleId = id ? parseInt(id) : null;

  const { data } = useGetClassDetail(articleId);
  const { classData, setClassData } = useClassStore();
  const [investmentDegree, setInvestmentDegree] = useState(
    classData?.maxInvDeg?.toString() || '3',
  );
  const [prices, setPrices] = useState<string[]>([
    classData?.baseMoney ? classData.baseMoney.toLocaleString('ko-KR') : '',
  ]);
  const [selectedRound, setSelectedRound] = useState(1); // 기본값 1차
  const { mutate: editClass } = useEditClass(articleId);

  // 차수 변경 핸들러
  const handleRoundChange = (value: string) => {
    const round = parseInt(value);
    setSelectedRound(round);
  };

  useEffect(() => {
    if (classData?.baseMoney !== undefined) {
      setPrices([classData.baseMoney.toLocaleString('ko-KR')]);
    }
  }, [classData]);

  useEffect(() => {
    if (data && JSON.stringify(classData) !== JSON.stringify(data)) {
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

  const priceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(e.target.value.replace(/[^0-9]/g, ''));
    setClassData({
      ...classData,
      baseMoney: numericValue,
    });
    setPrices([numericValue.toLocaleString('ko-KR')]);
  };

  const handleSubmit = () => {
    if (!classData) return;
    const payload = {
      ...classData,
      classNum: null, // 추가
      curInvDeg: null, // 추가
      maxInvDeg: selectedRound,
      baseMoney: Number(prices[0]?.replace(/[^0-9]/g, '')) || 0,
      classItems: classData.classItems.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        money: item.money?.slice(0, selectedRound + 1) || [],
      })),
      classArticles: classData.classArticles.map((article) => ({
        invDeg: article.invDeg,
        articles: article.articles.map((a) => ({
          id: a.id,
          title: a.title,
        })),
      })),
    };

    editClass(payload, {
      onSuccess: () => navigate(-1),
    });
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
            onClick={handleSubmit}
          >
            저장하기
            <Save size={20} color="white" />
          </Button>
        </BtnContainer>
      </Header>
      <Contents>
        <TextField>
          <FlexColumnBox>
            수업 이름
            <Input
              value={classData?.name ?? ''}
              onChange={(e) =>
                setClassData({ ...classData, name: e.target.value })
              }
              placeholder="수업 이름을 입력해 주세요.."
              width="1080px"
            />
          </FlexColumnBox>
          <FlexColumnBox>
            투자 차수
            <SelectField>
              <Select
                data={['1', '2', '3', '4', '5']}
                width={120}
                height={48}
                padding={{ top: 14, bottom: 14, left: 16, right: 10 }}
                value={selectedRound.toString()}
                onChange={handleRoundChange}
              />
              차
            </SelectField>
          </FlexColumnBox>
          <FlexColumnBox>
            기초자산
            <AssetField>
              <AssetInput
                type="text"
                value={prices}
                onChange={priceChangeHandler}
              />
              원
            </AssetField>
          </FlexColumnBox>
        </TextField>
        <TableField>
          <StockTables
            isEdit={true}
            data={classData?.classItems ?? []}
            selectedRound={selectedRound}
          />
          <ArticleTables isEdit={true} data={classData?.classArticles ?? []} />
        </TableField>
      </Contents>
    </Container>
  );
};
