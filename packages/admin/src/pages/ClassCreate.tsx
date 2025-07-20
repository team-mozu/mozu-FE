import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Input, Select } from "@mozu/ui";
import { type ChangeEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useClassCreate, useGetArticleList, useGetStockList } from "@/apis";
import type { Article, ClassArticleRequest, ClassCreateRequest, ClassItemRequest } from "@/apis/class/type";
import { ArticleTables } from "@/components/common/ArticleTables";
import { StockTables } from "@/components/common/StockTables";
import { formatPrice } from "@/utils/formatPrice";

export const CreateClass = () => {
  const navigate = useNavigate();
  const { mutate: mutateClassCreate } = useClassCreate();
  const [className, setClassName] = useState<string>("");
  const [classDeg, setClassDeg] = useState<"3" | "4" | "5">("3");
  const [baseMoney, setBaseMoney] = useState<number>(1000000);
  const [classItems, setClassItems] = useState<ClassItemRequest[]>([]);
  const [classArticles, setClassArticles] = useState<ClassArticleRequest[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const { data: stockListData } = useGetStockList();
  const { data: articleListData } = useGetArticleList();

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const onDegreeChange = (value: "3" | "4" | "5") => {
    setClassDeg(value);
  };

  const onBaseMoneyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const numValue = value === "" ? 0 : parseInt(value, 10);

    setBaseMoney(numValue);
  };

  // 투자 종목 관련 핸들러
  const handleAddItems = (newItems: any[]) => {
    console.log("New items received in CreateClass:", newItems);

    // Add new items to the classItems array
    setClassItems(prevItems => [
      ...prevItems,
      ...newItems.map(item => {
        const requiredLength = parseInt(classDeg, 10) + 2;
        const money = [
          ...(item.money || []),
        ];

        // money 배열 길이 보정
        while (money.length < requiredLength) {
          money.push(0);
        }

        return {
          ...item,
          money,
        };
      }),
    ]);

    // Convert to display format for the table
    const newStockData = newItems.map(item => {
      const requiredLength = parseInt(classDeg, 10) + 2;
      const money = [
        ...(item.money || []),
      ];

      while (money.length < requiredLength) {
        money.push(0);
      }

      const stockItem = stockListData?.items.find(stockItem => stockItem.id === item.id);
      const itemName = stockItem ? stockItem.name : `Item ${item.id}`;

      return {
        itemId: item.id,
        itemCode: String(item.id),
        itemName: itemName,
        money: money,
        stockChecked: false,
      };
    });

    setStockData(prevData => [
      ...prevData,
      ...newStockData,
    ]);
  };

  const onDeleteItems = (itemIds: number[]) => {
    // Remove items from the classItems array
    setClassItems(classItems.filter(item => !itemIds.includes(item.id)));

    // Remove items from the stockData array
    setStockData(stockData.filter(item => !itemIds.includes(item.itemId)));
  };

  const handleUpdateItemPrice = (itemId: number, levelIndex: number, value: number | null) => {
    // classItems 업데이트
    setClassItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const updatedMoney = [
            ...item.money,
          ];
          updatedMoney[levelIndex] = value ?? 0;

          // 1번 인덱스(현재가)가 변경된 경우, 0번 인덱스도 같은 값으로 설정
          if (levelIndex === 1) {
            updatedMoney[0] = value ?? 0;
          }

          return {
            ...item,
            money: updatedMoney,
          };
        }
        return item;
      }),
    );

    // stockData 업데이트
    setStockData(data =>
      data.map(item => {
        if (item.itemId === itemId) {
          const updatedMoney = [
            ...item.money,
          ];
          updatedMoney[levelIndex] = value ?? 0;

          // 1번 인덱스(현재가)가 변경된 경우, 0번 인덱스도 같은 값으로 설정
          if (levelIndex === 1) {
            updatedMoney[0] = value ?? 0;
          }

          return {
            ...item,
            money: updatedMoney,
          };
        }
        return item;
      }),
    );
  };

  // 기사 관련 핸들러
  const handleAddArticles = (newArticleGroup: { invDeg: number; articles: Article[] }) => {
    console.log("New articles received:", newArticleGroup);

    const { invDeg, articles } = newArticleGroup;

    // 해당 차수의 기사 그룹 찾기
    const existingGroupIndex = classArticles.findIndex(group => group.invDeg === invDeg);

    if (existingGroupIndex >= 0) {
      // 기존 그룹에 새 기사 추가
      setClassArticles(prevGroups => {
        const updatedGroups = [
          ...prevGroups,
        ];
        // 현재 기사 ID 배열
        const currentArticleIds = updatedGroups[existingGroupIndex].articles;

        // 새 기사 ID 추가
        const newArticleIds = articles.map(article => article.id);
        const combinedIds = [
          ...new Set([
            ...currentArticleIds,
            ...newArticleIds,
          ]),
        ];

        updatedGroups[existingGroupIndex] = {
          ...updatedGroups[existingGroupIndex],
          articles: combinedIds,
        };

        return updatedGroups;
      });
    } else {
      // 새 그룹 추가
      setClassArticles(prevGroups => [
        ...prevGroups,
        {
          invDeg,
          articles: articles.map(article => article.id),
        },
      ]);
    }
  };

  const handleDeleteArticles = (articleIds: number[], degree: number) => {
    // 해당 차수의 기사 그룹 찾기
    const groupIndex = classArticles.findIndex(group => group.invDeg === degree);

    if (groupIndex === -1) return;

    setClassArticles(prevGroups => {
      const updatedGroups = [
        ...prevGroups,
      ];
      // 삭제할 ID를 제외한 기사만 남기기
      const filteredArticleIds = updatedGroups[groupIndex].articles.filter(id => !articleIds.includes(id));

      // 남은 기사가 없으면 그룹 자체를 제거
      if (filteredArticleIds.length === 0) {
        return prevGroups.filter(group => group.invDeg !== degree);
      }

      // 남은 기사가 있으면 업데이트
      updatedGroups[groupIndex] = {
        ...updatedGroups[groupIndex],
        articles: filteredArticleIds,
      };

      return updatedGroups;
    });
  };

  const onSubmit = () => {
    // Validate inputs
    if (!className.trim()) {
      alert("수업 이름을 입력해주세요.");
      return;
    }

    if (classItems.length === 0) {
      alert("최소 하나 이상의 투자 종목을 추가해주세요.");
      return;
    }

    // 요청 전에 classItems의 0번 인덱스를 1번 인덱스(현재가)와 같게 설정
    const processedClassItems = classItems.map(item => {
      const updatedMoney = [
        ...item.money,
      ];
      // 0번 인덱스를 1번 인덱스(현재가)와 같게 설정
      if (updatedMoney.length > 1) {
        updatedMoney[0] = updatedMoney[1];
      }
      return {
        ...item,
        money: updatedMoney,
      };
    });

    const classCreateData: ClassCreateRequest = {
      className: className,
      classDeg: parseInt(classDeg),
      baseMoney: baseMoney,
      classItems: processedClassItems,
      classArticles: classArticles,
    };

    mutateClassCreate(classCreateData);
  };

  // 기사 테이블용 데이터 변환
  const articleTableData = classArticles.map(group => {
    // API 데이터에서 기사 제목 찾기
    const articleDetails = group.articles.map(id => {
      const article = articleListData?.article.find(a => a.id === id);
      return {
        id: id,
        title: article ? article.title : `기사 ID: ${id}`,
      };
    });

    return {
      invDeg: group.invDeg,
      articles: articleDetails,
    };
  });

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
              width="100%"
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
                width={"10rem"}
              />
              원
            </AssetField>
          </FlexColumnBox>
        </TextField>

        {/* 투자 종목 테이블 */}
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

        {/* 기사 테이블 */}
        <TableField>
          <ArticleTables
            isEdit
            degree={classDeg}
            data={articleTableData}
            onDeleteArticles={handleDeleteArticles}
            onAddArticles={handleAddArticles}
          />
        </TableField>
      </Contents>
    </Container>
  );
};

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const Text = styled.div`
  font: ${font.t2};
`;

export const TableField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

export const FlexColumnBox = styled.div`
  display: flex;
  flex-direction: column;
  font: ${font.b1};
  gap: 8px;
`;

export const FlexInputBox = styled.div`
  display: flex;
  flex-direction: column;
  font: ${font.b1};
  gap: 8px;
  width: 62rem;
`;

export const SelectField = styled.div`
  display: flex;
  align-items: center;
  font: ${font.t4};
  gap: 8px;
`;

export const TextField = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

export const Contents = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  width: 100%;
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
