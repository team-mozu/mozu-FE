import { color } from "@mozu/design-token";
import { Button, Input, Save, Select } from "@mozu/ui";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetClassDetail, useUpdateClass } from "@/entities/class";
import { useGetStockList } from "@/entities/stock";
import { ArticleTables } from "@/features/articleCRUD/ui/ArticleTables";
import { formatPrice, useArticle } from "@/shared/lib";
import type { ClassData } from "@/shared/types";
import { FullPageLoader, StockTables } from "@/shared/ui";
import {
  AssetField,
  BtnContainer,
  Container,
  Contents,
  FlexColumnBox,
  FlexInputBox,
  Header,
  SelectField,
  TableField,
  TextField,
} from "./ClassCreate";

interface StockData {
  itemId: number;
  itemCode: number;
  itemName: string;
  money: (number | null)[];
  stockChecked?: boolean;
}

interface ClassItem {
  itemId: number;
  itemName: string;
  money: number[];
}

export const ClassEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // API 호출
  const { data: classDetailData, isLoading } = useGetClassDetail(id ?? "");
  const { data: stockListData } = useGetStockList();
  const { mutate: editClass } = useUpdateClass(id ?? "");

  // 상태 관리
  const [className, setClassName] = useState<string>("");
  const [classDeg, setClassDeg] = useState<string>("3");
  const [baseMoney, setBaseMoney] = useState<number>(1000000);
  const [classItems, setClassItems] = useState<ClassItem[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);

  // ✅ 기사 Context
  const { classArticles, resetArticles, addArticles } = useArticle();

  // 클래스 데이터 로딩
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    if (classDetailData) {
      // 기본 정보 설정
      setClassName(classDetailData.name);
      setClassDeg(classDetailData.maxInvRound.toString());
      setBaseMoney(classDetailData.baseMoney);

      // 투자 종목 데이터 설정
      const items = classDetailData.lessonItems.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        money: item.money,
      }));
      setClassItems(items);

      // 스톡 테이블 데이터 설정
      const stockItems = classDetailData.lessonItems.map(item => {
        const money = [
          ...item.money,
        ];

        // 투자 차수에 맞춰 길이 맞춤
        const requiredLength = parseInt(classDetailData.maxInvRound.toString());
        while (money.length <= requiredLength + 1) {
          money.push(0);
        }

        return {
          itemId: item.itemId,
          itemCode: item.itemId,
          itemName: item.itemName,
          money: item.money,
          stockChecked: false,
        };
      });
      setStockData(stockItems);

      // ✅ 기사 데이터 Context 초기화
      resetArticles();
      classDetailData.lessonArticles.forEach(group => {
        // BaseArticle[]을 Article[]로 변환
        const convertedArticles = group.articles.map(baseArticle => ({
          articleId: String(baseArticle.articleId),
          title: baseArticle.title,
        }));
        addArticles(group.investmentRound, convertedArticles);
      });
    }
  }, [
    classDetailData,
  ]);

  // 기본 정보 변경 핸들러
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const onDegreeChange = (value: string) => {
    const newDegree = parseInt(value);
    const prevDegree = parseInt(classDeg);

    setClassDeg(value);

    // 차수 변경 시 money 배열 업데이트
    if (newDegree !== prevDegree) {
      setClassItems(prevItems =>
        prevItems.map(item => {
          const updatedMoney = [
            ...item.money,
          ];
          const endPrice = updatedMoney[prevDegree + 1];

          if (newDegree > prevDegree) {
            updatedMoney.splice(prevDegree + 1, 1);
            for (let i = prevDegree + 1; i <= newDegree; i++) {
              updatedMoney.splice(i, 0, 0);
            }
            updatedMoney[newDegree + 1] = endPrice;
          } else {
            updatedMoney.splice(newDegree + 1, prevDegree - newDegree, endPrice);
          }
          return {
            ...item,
            money: updatedMoney,
          };
        }),
      );

      setStockData(prevData =>
        prevData.map(item => {
          const updatedMoney = [
            ...item.money,
          ];
          const endPrice = updatedMoney[prevDegree + 1];

          if (newDegree > prevDegree) {
            updatedMoney.splice(prevDegree + 1, 1);
            for (let i = prevDegree + 1; i <= newDegree; i++) {
              updatedMoney.splice(i, 0, 0);
            }
            updatedMoney[newDegree + 1] = endPrice;
          } else {
            updatedMoney.splice(newDegree + 1, prevDegree - newDegree, endPrice);
          }
          return {
            ...item,
            money: updatedMoney,
          };
        }),
      );
    }
  };

  const onBaseMoneyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    setBaseMoney(value === "" ? 0 : parseInt(value, 10));
  };

  // 투자 종목 핸들러
  const handleAddItems = (newItems: any[]) => {
    setClassItems(prev => [
      ...prev,
      ...newItems,
    ]);
    const newStockData = newItems.map(item => {
      const stockItem = stockListData?.find(stock => stock.itemId === item.itemId);
      return {
        itemId: item.itemId,
        itemCode: item.itemId,
        itemName: stockItem ? stockItem.itemName : `Item ${item.itemId}`,
        money: item.money || [],
        stockChecked: false,
      };
    });
    setStockData(prev => [
      ...prev,
      ...newStockData,
    ]);
  };

  const onDeleteItems = (itemIds: number[]) => {
    setClassItems(classItems.filter(item => !itemIds.includes(item.itemId)));
    setStockData(stockData.filter(item => !itemIds.includes(item.itemId)));
  };

  const handleUpdateItemPrice = (itemId: number, levelIndex: number, value: number | null) => {
    setClassItems(items =>
      items.map(item =>
        item.itemId === itemId
          ? {
            ...item,
            money: Object.assign(
              [
                ...item.money,
              ],
              {
                [levelIndex]: value ?? 0,
                0: levelIndex === 1 ? (value ?? 0) : item.money[0],
              },
            ),
          }
          : item,
      ),
    );
    setStockData(data =>
      data.map(item =>
        item.itemId === itemId
          ? {
            ...item,
            money: Object.assign(
              [
                ...item.money,
              ],
              {
                [levelIndex]: value ?? 0,
                0: levelIndex === 1 ? (value ?? 0) : item.money[0],
              },
            ),
          }
          : item,
      ),
    );
  };

  // 수정 제출 핸들러
  const handleSubmit = () => {
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
      if (updatedMoney.length > 1) {
        updatedMoney[0] = updatedMoney[1] ?? 0;
      }
      return {
        ...item,
        money: updatedMoney,
      };
    });

    const classData: ClassData = {
      lessonName: className,
      lessonRound: parseInt(classDeg),
      baseMoney,
      lessonItems: processedClassItems.map(item => {
        const moneyForRequest = [
          ...item.money.slice(0, parseInt(classDeg) + 2),
        ];
        while (moneyForRequest.length < parseInt(classDeg) + 2) {
          moneyForRequest.push(0);
        }
        return {
          itemId: item.itemId,
          money: moneyForRequest,
        };
      }),
      // ✅ Context에서 가져온 기사 데이터 사용 (API 요청 형태로 변환)
      lessonArticles: classArticles.map(group => ({
        investmentRound: group.invDeg,
        articles: group.articles.map(article => article.articleId), // Article[]에서 ID만 추출
      })),
    };

    editClass(classData, {
      onSuccess: () => {
        navigate(`/class-management/${id}`);
        resetArticles();
      },
    });
  };

  // 기사 테이블 데이터 변환 (UI용)
  const articleTableData = useMemo(
    () =>
      classArticles.map(group => ({
        investmentRound: group.invDeg,
        articles: group.articles, // 이미 Article[] 형태
      })),
    [classArticles],
  );

  if (isLoading) return <FullPageLoader />;

  const cancelClick = () => {
    resetArticles();
    navigate(-1);
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
            onClick={cancelClick}>
            취소
          </Button>
          <Button
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[400]}
            hoverBorderColor={color.orange[400]}
            onClick={handleSubmit}>
            저장하기
            <Save
              size={20}
              color="white"
            />
          </Button>
        </BtnContainer>
      </Header>

      <Contents>
        <TextField>
          <FlexInputBox
            style={{
              flex: 5,
            }}>
            수업 이름
            <Input
              placeholder="수업 이름을 입력해 주세요.."
              fullWidth
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
          <FlexColumnBox
            style={{
              flex: 1,
            }}>
            기초자산
            <AssetField>
              <Input
                type="money"
                fullWidth
                placeholder="기초자산을 입력하세요.."
                onChange={onBaseMoneyChange}
                value={baseMoney === 0 ? "" : formatPrice(baseMoney)}
                rightText="원"
              />
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
