import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, CheckBox, Select } from "@mozu/ui";
import { useEffect, useState } from "react";
import { AddArticleItemModal } from "@/components/article/AddArticleItemModal";
import { Article } from "@/apis/class/type";
import { Skeleton } from "../../../../design-token/src/theme/Skeleton";

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
  degree: string; // 차수 (3, 4, 5)
  onDeleteArticles?: (articleIds: number[], degree: number) => void;
  onAddArticles?: (newArticleGroup: {
    invDeg: number;
    articles: Article[];
  }) => void;
  isApiLoading?: boolean;
}

export const ArticleTables = ({
  data = [],
  isEdit,
  degree,
  isApiLoading,
  onDeleteArticles,
  onAddArticles,
}: ArticleTablesProps) => {
  const [isModal, setIsModal] = useState<boolean>(false);
  // 선택된 차수 (1, 2, 3, 4, 5)
  const [selectedRound, setSelectedRound] = useState("1");

  // 현재 선택된 차수의 기사 목록
  const [currentArticles, setCurrentArticles] = useState<DisplayArticle[]>([]);

  // 체크된 기사 ID 관리
  const [checkedArticleIds, setCheckedArticleIds] = useState<number[]>([]);

  // 선택된 차수나 데이터가 변경될 때 현재 표시할 기사 목록 업데이트
  useEffect(() => {
    const round = parseInt(selectedRound);
    const articleGroup = data.find((group) => group.invDeg === round);

    if (articleGroup) {
      setCurrentArticles(
        articleGroup.articles.map((article) => ({
          ...article,
          checked: checkedArticleIds.includes(article.id),
        }))
      );
    } else {
      setCurrentArticles([]);
    }
  }, [data, selectedRound, checkedArticleIds]);

  //isLoading을 받아 스켈레톤 ui 구현
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //받아오는 isLoading 값이 변경 될 때(로딩이 다시 될 때)와 selectedRound가 변경될 때 실행
  useEffect(() => {
    setIsLoading(true);
    if (!isApiLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isApiLoading, selectedRound]);

  // 체크 상태가 변경될 때마다 현재 기사 목록 업데이트
  useEffect(() => {
    setCurrentArticles((prevArticles) =>
      prevArticles.map((article) => ({
        ...article,
        checked: checkedArticleIds.includes(article.id),
      }))
    );
  }, [checkedArticleIds]);

  // 차수 선택 변경 핸들러
  const handleRoundChange = (value: string) => {
    setSelectedRound(value);
    // 차수가 변경되면 체크 상태 초기화
    setCheckedArticleIds([]);
  };

  // 헤더 체크박스 토글
  const toggleAll = () => {
    if (currentArticles.length === 0) return;

    if (checkedArticleIds.length === currentArticles.length) {
      // 모두 체크되어 있으면 모두 해제
      setCheckedArticleIds([]);
    } else {
      // 일부만 체크되어 있거나 모두 해제되어 있으면 모두 체크
      setCheckedArticleIds(currentArticles.map((article) => article.id));
    }
  };

  // 개별 기사 체크박스 토글
  const toggleArticle = (id: number) => {
    setCheckedArticleIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 선택된 항목이 있는지 확인
  const hasCheckedItems = checkedArticleIds.length > 0;

  // 선택된 항목 삭제 처리
  const handleDeleteChecked = () => {
    if (!hasCheckedItems || !onDeleteArticles) return;

    // 선택된 기사 ID와 현재 선택된 차수를 부모 컴포넌트에 전달
    onDeleteArticles(checkedArticleIds, parseInt(selectedRound));

    // 체크 상태 초기화
    setCheckedArticleIds([]);
  };

  // 모달 열기
  const handleOpenModal = () => setIsModal(true);

  // 모달 닫기
  const handleCloseModal = () => setIsModal(false);

  // 모달에서 기사 선택 완료 시 처리
  const handleArticlesSelected = (selectedArticles: Article[]) => {
    if (onAddArticles && selectedArticles.length > 0) {
      // 선택된 차수와 기사 목록을 부모 컴포넌트에 전달
      onAddArticles({
        invDeg: parseInt(selectedRound),
        articles: selectedArticles,
      });
    }
    handleCloseModal();
  };

  // 현재 선택된 차수에 맞는 옵션 배열 생성
  const roundOptions = Array.from({ length: parseInt(degree) }, (_, i) =>
    (i + 1).toString()
  );

  // 이미 추가된 모든 기사의 ID를 수집
  const allAddedArticleIds = data.flatMap((group) =>
    group.articles.map((article) => article.id)
  );

  // 테이블 컬럼 정의
  const columns: ColumnDef<DisplayArticle>[] = [
    ...(isEdit
      ? [
        {
          accessorKey: 'checked',
          header: () => (
            <CheckBox
              onChange={toggleAll}
              checked={
                currentArticles.length > 0 &&
                checkedArticleIds.length === currentArticles.length
              }
              id="article-header-checkbox"
            />
          ),
          cell: ({ row }) => (
            <CheckBox
              checked={row.original.checked}
              onChange={() => toggleArticle(row.original.id)}
              id={`article-row-${row.original.id}`}
            />
          ),
          size: 52,
        },
      ]
      : []),
    {
      accessorKey: "title",
      header: "기사 제목",
      cell: ({ row }) => {
        const value = row.original.title;
        if (isLoading) {
          return <EmptyValueTextDiv>{value}</EmptyValueTextDiv>;
        } else {
          return <EmptyValueText>{value}</EmptyValueText>;
        }
      },
      size: 1460,
    },
  ];

  // 테이블 인스턴스 생성
  const table = useReactTable({
    data: currentArticles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer>
      <ControlContainer>
        <TableTitle>기사 목록</TableTitle>

        <div>
          <SelectBox>
            <Select
              data={roundOptions}
              width={100}
              height={40}
              value={selectedRound}
              onChange={handleRoundChange}
              padding={{ top: 10, bottom: 10, right: 10, left: 16 }}
            />
            차
          </SelectBox>

          {isEdit && (
            <RightControls>
              <Button
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                hoverBackgroundColor={color.zinc[100]}
                onClick={handleDeleteChecked}
                disabled={!hasCheckedItems}
              >
                선택항목 삭제하기
              </Button>
            </RightControls>
          )}
        </div>

      </ControlContainer>

      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} width={`${header.column.getSize()}px`}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </tr>
          ))}
        </Thead>

        <Tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} width={`${cell.column.getSize()}px`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <EmptyStateTd colSpan={columns.length}>
                <EmptyStateContainer>
                  <EmptyStateText>
                    {isEdit
                      ? `${selectedRound}차에 추가된 기사가 없습니다.`
                      : "기사가 없습니다."}
                  </EmptyStateText>
                </EmptyStateContainer>
              </EmptyStateTd>
            </tr>
          )}
          {isEdit && (
            <tr>
              <PlusTd colSpan={columns.length} onClick={handleOpenModal}>
                <PlusField>
                  <PlusIcon>+</PlusIcon>
                  추가하기
                </PlusField>
              </PlusTd>
            </tr>
          )}
        </Tbody>
      </Table>

      {isModal && (
        <AddArticleItemModal
          close={handleCloseModal}
          onArticlesSelected={handleArticlesSelected}
          selectedDegree={parseInt(selectedRound)}
          existingArticles={data.flatMap((group) =>
            group.articles.map((article) => ({ id: article.id }))
          )}
        />
      )}
    </TableContainer>
  );
};

const EmptyValueText = styled.span`
  color: ${color.zinc[900]};
`;

const EmptyValueTextDiv = styled(Skeleton)`
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
  table-layout: auto;
`;

const Thead = styled.thead`
  background: ${color.orange[50]};
`;

const Tbody = styled.tbody`
  background-color: ${color.white};
`;

const Th = styled.th<{ width: string }>`
  font: ${font.t2};
  height: 48px;
  background: ${color.orange[50]};
  border-bottom: 1px solid ${color.zinc[200]};
  vertical-align: middle;
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  min-width: 80px;
  width: ${(props) => props.width};
  text-align: left;

  &:first-of-type {
    border-top-left-radius: 8px;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td<{ width?: string }>`
  height: 48px;
  font: ${font.t4};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  text-align: left;
  width: ${(props) => props.width};

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
