import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Input, Select } from "@mozu/ui";
import { type ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useClassCreate, useGetArticleList, useGetStockList } from "@/apis";
import type { Article, ClassCreateRequest, ClassItemRequest } from "@/apis/class/type";
import { ArticleTables } from "@/components/common/ArticleTables";
import { StockTables } from "@/components/common/StockTables";
import { useArticle } from "@/utils";
import { formatPrice } from "@/utils/formatPrice";
export const CreateClass = () => {
  const navigate = useNavigate();
  const { mutate: mutateClassCreate } = useClassCreate();
  const [className, setClassName] = useState<string>("");
  const [classDeg, setClassDeg] = useState<"3" | "4" | "5">("3");
  const [baseMoney, setBaseMoney] = useState<number>(1000000);
  const [classItems, setClassItems] = useState<ClassItemRequest[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const { data: stockListData } = useGetStockList();
  const { data: articleListData } = useGetArticleList();
  const { classArticles, resetArticles } = useArticle();

  const onTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  },[]);

  const onDegreeChange = useCallback((value: string) => {
    setClassDeg(value as "3" | "4" | "5");
  },[]);

  const onBaseMoneyChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const numValue = value === "" ? 0 : parseInt(value, 10);
    setBaseMoney(numValue);
  },[]);

  const handleAddItems = useCallback((newItems: any[]) => {
    setClassItems(prevItems => [
      ...prevItems,
      ...newItems.map(item => {
        const requiredLength = parseInt(classDeg, 10) + 2;
        const money = [
          ...(item.money || []),
        ];
        while (money.length < requiredLength) money.push(0);
        return {
          ...item,
          money,
        };
      }),
    ]);

    const newStockData = newItems.map(item => {
      const requiredLength = parseInt(classDeg, 10) + 2;
      const money = [
        ...(item.money || []),
      ];
      while (money.length < requiredLength) money.push(0);
      const stockItem = stockListData?.items.find(stockItem => stockItem.id === item.id);
      const itemName = stockItem ? stockItem.name : `Item ${item.id}`;
      return {
        itemId: item.id,
        itemCode: String(item.id),
        itemName,
        money,
        stockChecked: false,
      };
    });

    setStockData(prevData => [
      ...prevData,
      ...newStockData,
    ]);
  },[classDeg, stockListData]);

  const onDeleteItems = (itemIds: number[]) => {
    setClassItems(classItems.filter(item => !itemIds.includes(item.id)));
    setStockData(stockData.filter(item => !itemIds.includes(item.itemId)));
  };

  const handleUpdateItemPrice = (itemId: number, levelIndex: number, value: number | null) => {
    setClassItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const updatedMoney = [
            ...item.money,
          ];
          updatedMoney[levelIndex] = value ?? 0;
          if (levelIndex === 1) updatedMoney[0] = value ?? 0;
          return {
            ...item,
            money: updatedMoney,
          };
        }
        return item;
      }),
    );

    setStockData(data =>
      data.map(item => {
        if (item.itemId === itemId) {
          const updatedMoney = [
            ...item.money,
          ];
          updatedMoney[levelIndex] = value ?? 0;
          if (levelIndex === 1) updatedMoney[0] = value ?? 0;
          return {
            ...item,
            money: updatedMoney,
          };
        }
        return item;
      }),
    );
  };

  const onSubmit = () => {
    if (!className.trim()) {
      alert("수업 이름을 입력해주세요.");
      return;
    }
    if (classItems.length === 0) {
      alert("최소 하나 이상의 투자 종목을 추가해주세요.");
      return;
    }

    const processedClassItems = classItems.map(item => {
      const updatedMoney = [
        ...item.money,
      ];
      if (updatedMoney.length > 1) updatedMoney[0] = updatedMoney[1];
      return {
        ...item,
        money: updatedMoney,
      };
    });

    const classCreateData: ClassCreateRequest = {
      className,
      classDeg: parseInt(classDeg),
      baseMoney,
      classItems: processedClassItems,
      classArticles,
    };

    mutateClassCreate(classCreateData, {
      onSuccess: () => {
        resetArticles(); // 기사 상태 초기화
      }
    });
  };

  const articleTableData = classArticles.map(group => ({
    invDeg: group.invDeg,
    articles: group.articles.map(id => {
      const article = articleListData?.article.find(a => a.id === id);
      return {
        id,
        title: article ? article.title : `기사 ID: ${id}`,
      };
    }),
  }));

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
            onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[600]}
            onClick={onSubmit}>
            생성하기
          </Button>
        </BtnContainer>
      </Header>

      <Contents>
        <TextField>
          <FlexInputBox>
            수업 이름
            <Input
              placeholder="수업 이름을 입력해 주세요.."
              value={className}
              onChange={onTitleChange}
            />
          </FlexInputBox>

          <FlexColumnBox>
            투자 차수
            <SelectField>
              <Select
                data={[
                  "3",
                  "4",
                  "5",
                ]}
                width={120}
                height={48}
                padding={{
                  top: 14,
                  bottom: 14,
                  left: 16,
                  right: 10,
                }}
                value={classDeg}
                onChange={onDegreeChange}
              />
              차
            </SelectField>
          </FlexColumnBox>

          <FlexColumnBox>
            기초자산
            <AssetField>
              <AssetInput
                type="text"
                onChange={onBaseMoneyChange}
                value={formatPrice(baseMoney)}
                width="10rem"
              />
              원
            </AssetField>
          </FlexColumnBox>
        </TextField>

        <TableField>
          <StockTables
            isEdit
            degree={classDeg}
            data={stockData || []}
            onPriceChange={handleUpdateItemPrice}
            onDeleteItems={onDeleteItems}
            onAddItems={handleAddItems}
          />
        </TableField>

        <TableField>
          <ArticleTables
            isEdit
            degree={classDeg}
            data={articleTableData}
          />
        </TableField>
      </Contents>
    </Container>
  );
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  gap: 8px;
  width: 100%;
`;

export const Header = styled.div`
  width: 100%;
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

export const BtnContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const Contents = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  padding: 32px 24px 52px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const TextField = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

export const FlexInputBox = styled.div`
  display: flex;
  flex-direction: column;
  font: ${font.b1};
  gap: 8px;
  width: 62rem;
`;

export const FlexColumnBox = styled.div`
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
  padding: 14px 16px;
  height: 48px;
  width: 210px;
  font: ${font.b2};
  :focus {
    border: 1px solid ${color.orange[300]};
  }
`;

export const TableField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
