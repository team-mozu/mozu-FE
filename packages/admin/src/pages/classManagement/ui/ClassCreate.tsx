import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Input, Select } from "@mozu/ui";
import type { ChangeEvent } from "react";
import { ArticleTables } from "@/features/articleCRUD/ui/ArticleTables";
import { useClassCreation } from "@/features/classManagement/hooks/useClassCreation";
import { formatPrice } from "@/shared/lib";
import { StockTables } from "@/shared/ui";

/**
 * 수업 생성 페이지 컴포넌트
 * 수업명, 투자 차수, 기초자산을 설정하고 투자 종목과 기사를 추가할 수 있습니다.
 */
export const CreateClass = () => {

  const {
    // 폼 데이터
    formData,
    stockTableData,
    classArticles,

    // 폼 핸들러
    updateLessonName,
    handleLessonRoundChange,
    updateBaseMoney,

    // 아이템 핸들러
    addItems,
    removeItems,
    updateItemPrice,

    // 제출/취소
    handleSubmit,
    handleCancel,

    // 상태
    isPending,
  } = useClassCreation();

  /**
   * 수업 이름 변경 핸들러
   */
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateLessonName(e.target.value);
  };

  /**
   * 투자 차수 변경 핸들러
   */
  const onDegreeChange = (value: "3" | "4" | "5") => {
    handleLessonRoundChange(parseInt(value, 10));
  };

  /**
   * 기초자산 변경 핸들러
   */
  const onBaseMoneyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const numValue = value === "" ? 0 : parseInt(value, 10);
    updateBaseMoney(numValue);
  };

  /**
   * 투자 종목 추가 핸들러
   */
  const handleAddItems = (
    newItems: Array<{
      itemId: number;
      money?: number[];
    }>,
  ) => {
    addItems(newItems);
  };

  /**
   * 투자 종목 삭제 핸들러
   */
  const onDeleteItems = (itemIds: number[]) => {
    removeItems(itemIds);
  };

  /**
   * 투자 종목 가격 업데이트 핸들러
   */
  const handleUpdateItemPrice = (itemId: number, levelIndex: number, value: number | null) => {
    updateItemPrice(itemId, levelIndex, value);
  };

  /**
   * 기사 테이블용 데이터 변환
   */
  const articleTableData = classArticles.map(group => ({
    investmentRound: group.invDeg,
    articles: group.articles, // 이미 Article[] 형태
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
            onClick={handleCancel}>
            취소
          </Button>
          <Button
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[600]}
            onClick={handleSubmit}
            disabled={isPending}>
            {isPending ? "생성 중..." : "생성하기"}
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
              fullWidth={true}
              value={formData.lessonName}
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
                value={String(formData.lessonRound)}
                onChange={onDegreeChange as (value: string) => void}
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
                fullWidth={true}
                type="money"
                placeholder="기초자산을 입력하세요.."
                onChange={onBaseMoneyChange}
                value={formData.baseMoney === 0 ? "" : formatPrice(formData.baseMoney)}
                rightText="원"
              />
            </AssetField>
          </FlexColumnBox>
        </TextField>

        {/* 투자 종목 테이블 */}
        <TableField>
          <StockTables
            isEdit
            degree={String(formData.lessonRound)}
            data={stockTableData}
            onPriceChange={handleUpdateItemPrice}
            onDeleteItems={onDeleteItems}
            onAddItems={handleAddItems}
          />
        </TableField>

        {/* 기사 테이블 */}
        <TableField>
          <ArticleTables
            isEdit
            degree={String(formData.lessonRound)}
            data={articleTableData}
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
  justify-content: flex-start;
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
