import styled from "@emotion/styled";
import { color, font, Skeleton } from "@mozu/design-token";
import { Button, CheckBox, Select } from "@mozu/ui";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { Article } from "@/entities/class/api/type";
import { AddArticleItemModal } from "@/features/articleCRUD";
import { useArticle } from "@/shared/lib";

interface ClassArticleItem {
  invDeg: number;
  articles: Article[];
}

interface DisplayArticle extends Article {
  checked?: boolean;
}

interface ArticleTablesProps {
  data?: ClassArticleItem[];
  isEdit: boolean;
  degree: string;
  isApiLoading?: boolean;
}

const SKELETON_DELAY = 500;
const DEFAULT_ROUND = "1";

const useTableLoading = (isApiLoading?: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (!isApiLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, SKELETON_DELAY);
      return () => clearTimeout(timer);
    }
  }, [
    isApiLoading,
  ]);

  return isLoading;
};

const useArticleSelection = () => {
  const [checkedArticleIds, setCheckedArticleIds] = useState<number[]>([]);

  const resetSelection = useCallback(() => {
    setCheckedArticleIds([]);
  }, []);

  const toggleArticle = useCallback((id: number) => {
    setCheckedArticleIds(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [
          ...prev,
          id,
        ],
    );
  }, []);

  const toggleAll = useCallback((articleIds: number[]) => {
    setCheckedArticleIds(prev => (prev.length === articleIds.length ? [] : articleIds));
  }, []);

  return {
    checkedArticleIds,
    resetSelection,
    toggleArticle,
    toggleAll,
  };
};

const useRoundSelection = (degree: string) => {
  const [selectedRound, setSelectedRound] = useState(DEFAULT_ROUND);

  const roundOptions = useMemo(
    () =>
      Array.from(
        {
          length: parseInt(degree, 10),
        },
        (_, i) => (i + 1).toString(),
      ),
    [
      degree,
    ],
  );

  const handleRoundChange = useCallback((value: string, onSelectionReset: () => void) => {
    setSelectedRound(value);
    onSelectionReset();
  }, []);

  return {
    selectedRound,
    roundOptions,
    handleRoundChange,
  };
};

const TableHeader = memo(
  ({ isEdit, hasItems, onToggleAll }: { isEdit: boolean; hasItems: boolean; onToggleAll: () => void }) => (
    <Thead>
      <tr>
        {isEdit && (
          <Th width="52px">
            <CheckBoxWrapper>
              <CheckBox
                onChange={onToggleAll}
                checked={hasItems}
                id="article-header-checkbox"
              />
            </CheckBoxWrapper>
          </Th>
        )}
        <Th>기사 제목</Th>
      </tr>
    </Thead>
  ),
);

const ArticleRow = memo(
  ({
    article,
    isEdit,
    isLoading,
    onToggle,
  }: {
    article: DisplayArticle;
    isEdit: boolean;
    isLoading: boolean;
    onToggle: (id: number) => void;
  }) => (
    <tr key={article.id}>
      {isEdit && (
        <Td width="52px">
          <CheckBoxWrapper>
            <CheckBox
              checked={article.checked}
              onChange={() => onToggle(article.id)}
              id={`article-row-${article.id}`}
            />
          </CheckBoxWrapper>
        </Td>
      )}
      <Td>{isLoading ? <SkeletonText>{article.title}</SkeletonText> : <ArticleTitle>{article.title}</ArticleTitle>}</Td>
    </tr>
  ),
);

const EmptyState = memo(
  ({ colSpan, isEdit, selectedRound }: { colSpan: number; isEdit: boolean; selectedRound: string }) => (
    <tr>
      <EmptyStateTd colSpan={colSpan}>
        <EmptyStateContainer>
          <EmptyStateText>
            {isEdit ? `${selectedRound}차에 추가된 기사가 없습니다.` : "기사가 없습니다."}
          </EmptyStateText>
        </EmptyStateContainer>
      </EmptyStateTd>
    </tr>
  ),
);

const AddRowButton = memo(({ colSpan, onClick }: { colSpan: number; onClick: () => void }) => (
  <tr>
    <PlusTd
      colSpan={colSpan}
      onClick={onClick}>
      <PlusField>
        <PlusIcon>+</PlusIcon>
        추가하기
      </PlusField>
    </PlusTd>
  </tr>
));

const TableControls = memo(
  ({
    selectedRound,
    roundOptions,
    isEdit,
    hasCheckedItems,
    onRoundChange,
    onDeleteChecked,
  }: {
    selectedRound: string;
    roundOptions: string[];
    isEdit: boolean;
    hasCheckedItems: boolean;
    onRoundChange: (value: string) => void;
    onDeleteChecked: () => void;
  }) => (
    <ControlContainer>
      <TableTitle>기사 목록</TableTitle>
      <div>
        <SelectBox>
          <Select
            data={roundOptions}
            width={100}
            height={40}
            value={selectedRound}
            onChange={onRoundChange}
            padding={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 16,
            }}
          />
          차
        </SelectBox>
        {isEdit && (
          <RightControls>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[100]}
              onClick={onDeleteChecked}
              disabled={!hasCheckedItems}>
              선택항목 삭제하기
            </Button>
          </RightControls>
        )}
      </div>
    </ControlContainer>
  ),
);

export const ArticleTables = memo(({ data = [], isEdit, degree, isApiLoading }: ArticleTablesProps) => {
  const [isModal, setIsModal] = useState<boolean>(false);

  const isLoading = useTableLoading(isApiLoading);
  const { checkedArticleIds, resetSelection, toggleArticle, toggleAll } = useArticleSelection();
  const { selectedRound, roundOptions, handleRoundChange } = useRoundSelection(degree);
  const { addArticles, deleteArticles } = useArticle();

  const currentArticles = useMemo<DisplayArticle[]>(() => {
    const round = parseInt(selectedRound, 10);
    const articleGroup = data.find(group => group.invDeg === round);

    if (articleGroup) {
      return articleGroup.articles.map(article => ({
        ...article,
        checked: checkedArticleIds.includes(article.id),
      }));
    }
    return [];
  }, [
    data,
    selectedRound,
    checkedArticleIds,
  ]);

  const hasCheckedItems = checkedArticleIds.length > 0;
  const isAllChecked = currentArticles.length > 0 && checkedArticleIds.length === currentArticles.length;
  const colSpan = isEdit ? 2 : 1;
  const existingArticles = useMemo(
    () => data.flatMap(group => group.articles),
    [
      data,
    ],
  );

  const handleRoundChangeWithReset = useCallback(
    (value: string) => {
      handleRoundChange(value, resetSelection);
    },
    [
      handleRoundChange,
      resetSelection,
    ],
  );

  const handleToggleAll = useCallback(() => {
    toggleAll(currentArticles.map(article => article.id));
  }, [
    toggleAll,
    currentArticles,
  ]);

  const handleDeleteChecked = useCallback(() => {
    if (!hasCheckedItems) return;
    deleteArticles(checkedArticleIds, parseInt(selectedRound));
    resetSelection();
  }, [
    hasCheckedItems,
    deleteArticles,
    resetSelection,
    checkedArticleIds,
    selectedRound,
  ]);

  const handleOpenModal = useCallback(() => setIsModal(true), []);
  const handleCloseModal = useCallback(() => setIsModal(false), []);

  const handleArticlesSelected = useCallback(
    (selectedArticles: Article[]) => {
      if (selectedArticles.length > 0) {
        addArticles(parseInt(selectedRound), selectedArticles);
      }
      handleCloseModal();
    },
    [
      addArticles,
      selectedRound,
      handleCloseModal,
    ],
  );

  return (
    <TableContainer>
      <TableControls
        selectedRound={selectedRound}
        roundOptions={roundOptions}
        isEdit={isEdit}
        hasCheckedItems={hasCheckedItems}
        onRoundChange={handleRoundChangeWithReset}
        onDeleteChecked={handleDeleteChecked}
      />

      <Table>
        <TableHeader
          isEdit={isEdit}
          hasItems={isAllChecked}
          onToggleAll={handleToggleAll}
        />

        <Tbody>
          {currentArticles.length > 0 ? (
            currentArticles.map(article => (
              <ArticleRow
                key={article.id}
                article={article}
                isEdit={isEdit}
                isLoading={isLoading}
                onToggle={toggleArticle}
              />
            ))
          ) : (
            <EmptyState
              colSpan={colSpan}
              isEdit={isEdit}
              selectedRound={selectedRound}
            />
          )}

          {isEdit && (
            <AddRowButton
              colSpan={colSpan}
              onClick={handleOpenModal}
            />
          )}
        </Tbody>
      </Table>

      {isModal && (
        <AddArticleItemModal
          close={handleCloseModal}
          onArticlesSelected={handleArticlesSelected}
          selectedDegree={parseInt(selectedRound, 10)}
          existingArticles={existingArticles}
        />
      )}
    </TableContainer>
  );
});

const ArticleTitle = styled.span`
  color: ${color.zinc[900]};
`;

const SkeletonText = styled(Skeleton)`
  color: transparent;
`;

const TableTitle = styled.div`
  font: ${font.t2};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const ControlContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  > div {
    display: flex;
    gap: 24px;
  }
`;

const RightControls = styled.div`
  display: flex;
  gap: 10px;
`;

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font: ${font.t4};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  table-layout: fixed;
`;

const Thead = styled.thead`
  background: ${color.orange[50]};
`;

const Tbody = styled.tbody`
  background-color: ${color.white};
`;

const Th = styled.th<{
  width?: string;
}>`
  font: ${font.t2};
  height: 48px;
  background: ${color.orange[50]};
  vertical-align: middle;
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  min-width: 80px;
  width: ${props => props.width};
  text-align: left;

  &:first-of-type {
    border-top-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td<{
  width?: string;
}>`
  height: 48px;
  font: ${font.t4};
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  text-align: left;
  vertical-align: middle;
  width: ${props => props.width};

  tbody tr:last-of-type & {
    &:first-of-type {
      border-bottom-left-radius: 8px;
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
`;

const EmptyStateTd = styled(Td)`
  text-align: center;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyStateText = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
`;

const PlusIcon = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const PlusField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font: ${font.b1};
`;

const PlusTd = styled(Td)`
  text-align: center;
  cursor: pointer;
  background-color: ${color.zinc[50]};
  &:hover {
    background-color: ${color.zinc[100]};
  }
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0 auto;

  /* CheckBox 컴포넌트의 크기 고정 */
  & > * {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`;
