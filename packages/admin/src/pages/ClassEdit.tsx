import { color } from "@mozu/design-token";
import { Button, Input, Save, Select } from "@mozu/ui";
import { type ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEditClass, useGetArticleList, useGetClassDetail, useGetStockList } from "@/apis";
import type { Article, ClassArticleRequest, ClassData, ClassItemRequest } from "@/apis/class/type";
import { FullPageLoader } from "@/components";
import { ArticleTables } from "@/components/common/ArticleTables";
import { StockTables } from "@/components/common/StockTables";
import { formatPrice } from "@/utils/formatPrice";
import {
  AssetField,
  AssetInput,
  BtnContainer,
  Container,
  Contents,
  FlexColumnBox,
  Header,
  SelectField,
  TableField,
  TextField,
} from "./ClassCreate";

interface StockData {
  itemId: number;
  itemCode: string;
  itemName: string;
  money: (number | null)[];
  stockChecked?: boolean;
}

export const ClassEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const classId = id ? parseInt(id) : null;

  // API 호출
  const { data: classDetailData, isLoading } = useGetClassDetail(classId ?? 0);
  const { data: articleListData } = useGetArticleList();
  const { data: stockListData } = useGetStockList();
  const { mutate: editClass } = useEditClass(classId ?? 0);

  // 상태 관리
  const [className, setClassName] = useState<string>("");
  const [classDeg, setClassDeg] = useState<string>("3");
  const [baseMoney, setBaseMoney] = useState<number>(1000000);
  const [classItems, setClassItems] = useState<ClassItemRequest[]>([]);
  const [classArticles, setClassArticles] = useState<ClassArticleRequest[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);

  // 클래스 데이터 로딩
  useEffect(() => {
    if (classDetailData) {
      // 기본 정보 설정
      setClassName(classDetailData.name);
      setClassDeg(classDetailData.maxInvDeg.toString());
      setBaseMoney(classDetailData.baseMoney);

      // 투자 종목 데이터 설정
      const items = classDetailData.classItems.map(item => ({
        id: item.itemId,
        money: item.money,
      }));
      setClassItems(items);

      // 스톡 테이블 데이터 설정
      const stockItems = classDetailData.classItems.map(item => {
        const money = [
          ...item.money,
        ];

        // 투자 차수에 맞춰 길이 맞춤
        const requiredLength = parseInt(classDetailData.maxInvDeg.toString());
        while (money.length <= requiredLength + 1) {
          money.push(0);
        }

        return {
          itemId: item.itemId,
          itemCode: String(item.itemId),
          itemName: item.itemName,
          money: money,
          stockChecked: false,
        };
      });
      setStockData(stockItems);

      // 기사 데이터 설정
      const articles = classDetailData.classArticles.map(group => ({
        invDeg: group.invDeg,
        articles: group.articles.map(article => article.id),
      }));
      setClassArticles(articles);
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

    // 차수가 변경되면 money 배열 구조 업데이트
    if (newDegree !== prevDegree) {
      // classItems 업데이트
      setClassItems(prevItems =>
        prevItems.map(item => {
          const updatedMoney = [
            ...item.money,
          ];
          const endPrice = updatedMoney[prevDegree + 1]; // 기존 종료가 저장

          // 차수가 늘어나는 경우
          if (newDegree > prevDegree) {
            // 종료가를 제거하고 새로운 차수들을 0으로 초기화
            updatedMoney.splice(prevDegree + 1, 1); // 기존 종료가 제거

            // 새로운 차수들을 0으로 초기화해서 추가
            for (let i = prevDegree + 1; i <= newDegree; i++) {
              updatedMoney.splice(i, 0, 0);
            }

            // 종료가를 맨 마지막에 다시 추가
            updatedMoney[newDegree + 1] = endPrice;
          }
          // 차수가 줄어드는 경우
          else if (newDegree < prevDegree) {
            // 줄어든 차수들을 제거하고 종료가를 올바른 위치로 이동
            updatedMoney.splice(newDegree + 1, prevDegree - newDegree, endPrice);
          }

          return {
            ...item,
            money: updatedMoney,
          };
        }),
      );

      // stockData 업데이트
      setStockData(prevData =>
        prevData.map(item => {
          const updatedMoney = [
            ...item.money,
          ];
          const endPrice = updatedMoney[prevDegree + 1]; // 기존 종료가 저장

          // 차수가 늘어나는 경우
          if (newDegree > prevDegree) {
            // 종료가를 제거하고 새로운 차수들을 0으로 초기화
            updatedMoney.splice(prevDegree + 1, 1); // 기존 종료가 제거

            // 새로운 차수들을 0으로 초기화해서 추가
            for (let i = prevDegree + 1; i <= newDegree; i++) {
              updatedMoney.splice(i, 0, 0);
            }

            // 종료가를 맨 마지막에 다시 추가
            updatedMoney[newDegree + 1] = endPrice;
          }
          // 차수가 줄어드는 경우
          else if (newDegree < prevDegree) {
            // 줄어든 차수들을 제거하고 종료가를 올바른 위치로 이동
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
    const numValue = value === "" ? 0 : parseInt(value, 10);
    setBaseMoney(numValue);
  };

  // 투자 종목 관련 핸들러
  const handleAddItems = (newItems: any[]) => {
    // 클래스 아이템 배열에 추가
    setClassItems(prevItems => [
      ...prevItems,
      ...newItems,
    ]);

    // 테이블 표시용 데이터로 변환
    const newStockData = newItems.map(item => {
      const stockItem = stockListData?.items.find(stock => stock.id === item.id);
      const itemName = stockItem ? stockItem.name : `Item ${item.id}`;

      return {
        itemId: item.id,
        itemCode: String(item.id),
        itemName: itemName,
        money: item.money,
        stockChecked: false,
      };
    });

    setStockData(prevData => [
      ...prevData,
      ...newStockData,
    ]);
  };

  const onDeleteItems = (itemIds: number[]) => {
    // 삭제할 아이템 필터링
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

          // 만약 현재가(1번 인덱스)를 수정했다면
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

    setStockData(data =>
      data.map(item => {
        if (item.itemId === itemId) {
          const updatedMoney = [
            ...item.money,
          ];
          updatedMoney[levelIndex] = value ?? 0;

          // 마찬가지로 stockData에도 반영
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
    const { invDeg, articles } = newArticleGroup;

    // 이미 해당 차수의 기사 그룹이 있는지 확인
    const existingGroupIndex = classArticles.findIndex(group => group.invDeg === invDeg);

    if (existingGroupIndex >= 0) {
      // 기존 그룹에 기사 추가
      setClassArticles(prevGroups => {
        const updatedGroups = [
          ...prevGroups,
        ];
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

      // 남은 기사가 없으면 그룹 제거
      if (filteredArticleIds.length === 0) {
        return prevGroups.filter(group => group.invDeg !== degree);
      }

      // 업데이트
      updatedGroups[groupIndex] = {
        ...updatedGroups[groupIndex],
        articles: filteredArticleIds,
      };

      return updatedGroups;
    });
  };

  // 수정 제출 핸들러
  const handleSubmit = () => {
    // 유효성 검사
    if (!className.trim()) {
      alert("수업 이름을 입력해주세요.");
      return;
    }

    if (classItems.length === 0) {
      alert("최소 하나 이상의 투자 종목을 추가해주세요.");
      return;
    }

    // 모든 아이템의 0번 인덱스를 1번 인덱스로 덮어씌움
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
      className: className,
      classDeg: parseInt(classDeg),
      baseMoney: baseMoney,
      classItems: processedClassItems.map(item => {
        const moneyForRequest = [
          ...item.money.slice(0, parseInt(classDeg) + 2), // +2로 종료가까지 포함
        ];

        // 배열 길이 부족 시 null 채우기
        const requiredLength = parseInt(classDeg) + 2;
        while (moneyForRequest.length < requiredLength) {
          moneyForRequest.push(0);
        }

        return {
          id: item.id,
          money: moneyForRequest,
        };
      }),
      classArticles: classArticles.map(group => ({
        invDeg: group.invDeg,
        articles: group.articles,
      })),
    };

    editClass(classData, {
      onSuccess: () => navigate(`/class-management/${id}`),
    });
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

  if (isLoading) {
    return <FullPageLoader />;
  }

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
            onClick={() => navigate(-1)}>
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
          <FlexColumnBox>
            수업 이름
            <Input
              placeholder="수업 이름을 입력해 주세요.."
              width="1080px"
              value={className}
              onChange={onTitleChange}
            />
          </FlexColumnBox>
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
