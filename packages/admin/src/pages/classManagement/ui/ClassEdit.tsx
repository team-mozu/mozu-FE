import { color } from "@mozu/design-token";
import { Button, Input, Save, Select, Toast } from "@mozu/ui";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetClassDetail, useUpdateClass } from "@/entities/class";
import { useGetStockList } from "@/entities/stock";
import { ArticleTables } from "@/features/articleCRUD/ui/ArticleTables";
import { formatPrice, useArticle } from "@/shared/lib";
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
  const { mutate: editClass, isPending } = useUpdateClass(id ?? "");

  // 상태 관리
  const [className, setClassName] = useState<string>("");
  const [classDeg, setClassDeg] = useState<string>("3");
  const [baseMoney, setBaseMoney] = useState<number>(1000000);
  const [classItems, setClassItems] = useState<ClassItem[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);

  // ✅ 기사 Context
  const { classArticles, resetArticles, addArticles, filterArticlesByMaxDegree } = useArticle();

  // 클래스 데이터 로딩
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    if (classDetailData) {
      // 기본 정보 설정
      setClassName(classDetailData.name);
      setClassDeg(classDetailData.maxInvRound.toString());
      setBaseMoney(classDetailData.baseMoney);

      // 투자 종목 데이터 설정 - 실제 차수에 맞게 데이터 자르기
      const maxRound = classDetailData.maxInvRound;
      const requiredLength = maxRound + 1; // 1차~N차 + 종료가

      const items = classDetailData.lessonItems.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        money: item.money.slice(0, requiredLength), // 실제 차수에 맞게 자르기
      }));
      setClassItems(items);

      // 스톡 테이블 데이터 설정
      const stockItems = classDetailData.lessonItems.map(item => {
        return {
          itemId: item.itemId,
          itemCode: item.itemId,
          itemName: item.itemName,
          money: item.money.slice(0, requiredLength), // 실제 차수에 맞게 자르기
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

    // 차수 변경 시 money 배열 업데이트 (새로운 구조: [1차가격, 2차가격, ..., 종료가])
    if (newDegree !== prevDegree) {
      if (newDegree < prevDegree) {
        filterArticlesByMaxDegree(newDegree);
      }

      setClassItems(prevItems =>
        prevItems.map(item => {
          const updatedMoney = [...item.money];
          const requiredLength = newDegree + 1; // 1차~N차 + 종료가

          // 배열 길이 조정
          if (updatedMoney.length < requiredLength) {
            // 길이가 부족하면 0 채움 (나중에 사용자가 입력)
            while (updatedMoney.length < requiredLength) {
              updatedMoney.push(0);
            }
          } else if (updatedMoney.length > requiredLength) {
            // 길이가 초과하면 자름 (종료가는 유지)
            const endPrice = updatedMoney[updatedMoney.length - 1];
            updatedMoney.length = requiredLength;
            updatedMoney[requiredLength - 1] = endPrice;
          }

          return {
            ...item,
            money: updatedMoney,
          };
        }),
      );

      setStockData(prevData =>
        prevData.map(item => {
          const updatedMoney = [...item.money];
          const requiredLength = newDegree + 1; // 1차~N차 + 종료가

          // 배열 길이 조정
          if (updatedMoney.length < requiredLength) {
            // 길이가 부족하면 null로 채움 (나중에 사용자가 입력)
            while (updatedMoney.length < requiredLength) {
              updatedMoney.push(null);
            }
          } else if (updatedMoney.length > requiredLength) {
            // 길이가 초과하면 자름 (종료가는 유지)
            const endPrice = updatedMoney[updatedMoney.length - 1];
            updatedMoney.length = requiredLength;
            updatedMoney[requiredLength - 1] = endPrice;
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
    const currentDegree = parseInt(classDeg);
    const requiredLength = currentDegree + 1; // 1차~N차 + 종료가

    const processedItems = newItems.map(item => ({
      ...item,
      money: item.money && item.money.length === requiredLength
        ? item.money
        : new Array(requiredLength).fill(null)
    }));

    setClassItems(prev => [
      ...prev,
      ...processedItems,
    ]);

    const newStockData = newItems.map(item => {
      const stockItem = stockListData?.find(stock => stock.itemId === item.itemId);
      const itemMoney = item.money && item.money.length === requiredLength
        ? item.money
        : new Array(requiredLength).fill(null);

      return {
        itemId: item.itemId,
        itemCode: item.itemId,
        itemName: stockItem ? stockItem.itemName : `Item ${item.itemId}`,
        money: itemMoney,
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

    // 기사 검증
    const totalArticles = classArticles.reduce((total, group) => total + group.articles.length, 0);
    if (totalArticles === 0) {
      alert("최소 하나 이상의 기사를 추가해주세요.");
      return;
    }

    const classData = {
      lessonName: className,
      lessonRound: parseInt(classDeg),
      baseMoney,
      lessonItems: classItems.map(item => {
        // 새로운 구조: [1차가격, 2차가격, 3차가격, ..., 종료가]
        const moneyForRequest = item.money.map(price => price ?? 0);
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
      onError: () => {
        Toast("수업 수정에 실패했습니다.", { type: "error" });
      }
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
            onClick={cancelClick}
            disabled={isPending}>
            취소
          </Button>
          <Button
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[400]}
            hoverBorderColor={color.orange[400]}
            onClick={handleSubmit}
            disabled={isPending}>
            {isPending ? "저장 중..." : "저장하기"}
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
