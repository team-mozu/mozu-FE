import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, CheckBox, Select, Plus } from '@mozu/ui';
import { useEffect, useState } from 'react';
import { AddArticleItemModal } from '../article';
import { useClassStore } from '@/store';

interface Article {
  id: number;
  title: string;
  checked?: boolean;
}

interface ClassArticle {
  invDeg: number;
  articles: Article[];
  checked?: boolean;
}

interface IPropType {
  data?: ClassArticle[];
  isEdit: boolean;
  round: number;
}

export const ArticleTables = ({ data = [], isEdit, round }: IPropType) => {
  const [tableData, setTableData] = useState<ClassArticle[]>([]);
  const [isModal, setIsModal] = useState<boolean>(false);
  const { classData, setClassData, updateArticles } = useClassStore();

  const toggleAll = () => {
    if (!classData) return;

    const allChecked = classData.classArticles.every(
      (row) => row.articleGroupChecked,
    );

    const updatedData = classData.classArticles.map((row) => ({
      ...row,
      articleGroupChecked: !allChecked,
    }));

    updateArticles(updatedData);
  };

  const toggleArticleRow = (invDeg: number) => {
    if (!classData) return;
    const newArticles = classData.classArticles.map((article) =>
      article.invDeg === invDeg
        ? { ...article, articleGroupChecked: !article.articleGroupChecked }
        : article,
    );
    updateArticles(newArticles);
  };

  const hasCheckedItems = (classData?.classArticles ?? []).some(
    (row) => row.articleGroupChecked,
  );

  const handleDeleteChecked = () => {
    if (!classData) return;
    const filtered = classData.classArticles.filter(
      (row) => !row.articleGroupChecked,
    );
    updateArticles(filtered);
  };

  useEffect(() => {
    if (classData?.classArticles) {
      const formattedData = classData.classArticles.map((item) => ({
        ...item,
        invDeg: item.invDeg ?? 0,
        checked:
          item.articles?.some((article) => article.articleChecked) ?? false,
      }));
      setTableData(formattedData);
    } else {
      setTableData([]);
    }
  }, [classData?.classArticles]);

  const columns: ColumnDef<ClassArticle>[] = [
    ...(isEdit
      ? [
          {
            accessorKey: 'articleGroupChecked',
            header: () => (
              <CheckBox
                onChange={toggleAll}
                checked={
                  classData?.classArticles && classData.classArticles.length > 0
                    ? classData.classArticles.every(
                        (row) => row.articleGroupChecked,
                      )
                    : false
                }
                id={`article-header-checkbox`}
              />
            ),
            cell: ({ row }) => (
              <CheckBox
                checked={row.original.articleGroupChecked}
                onChange={() => toggleArticleRow(row.original.invDeg)}
                id={`article-row-${row.original.invDeg}`}
              />
            ),
            size: 52,
          },
        ]
      : []),
    {
      accessorKey: 'articles',
      header: '기사 제목',
      cell: ({ row }) =>
        row.original.articles?.map((a) => a.title).join(', ') ?? '',
      size: 1460,
    },
  ];

  const table = useReactTable({
    data: classData.classArticles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isOpen = () => setIsModal(true);
  const isClose = () => {
    setIsModal(false);
    setClassData({
      ...classData,
      classItems: classData.classItems.map((item) => ({
        ...item,
        checked: false,
      })),
      classArticles: classData.classArticles.map((article) => ({
        ...article,
        checked: false,
        articles: article.articles.map((a) => ({ ...a, checked: false })),
      })),
    });
  };

  return (
    <Table>
      {isModal && <AddArticleItemModal close={isClose} />}
      <Caption>
        <CaptionBox>
          <Text>기사 목록</Text>
          {isEdit && (
            <Option>
              <SelectBox>
                <Select
                  data={['1', '2', '3', '4', '5']}
                  width={100}
                  height={40}
                  padding={{ top: 10, bottom: 10, right: 76, left: 16 }}
                />
                차
              </SelectBox>
              <div onClick={handleDeleteChecked}>
                <Button
                  backgroundColor={color.zinc[50]}
                  borderColor={color.zinc[200]}
                  hoverBackgroundColor={color.zinc[100]}
                  disabled={!hasCheckedItems}
                >
                  선택항목 삭제하기
                </Button>
              </div>
            </Option>
          )}
        </CaptionBox>
      </Caption>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th
                key={header.id}
                style={{
                  width: header.column.columnDef.size || 'auto',
                  minWidth: header.column.columnDef.size || 'auto',
                  maxWidth: header.column.columnDef.size || 'auto',
                  flexGrow: 0,
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </Th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <Td colSpan={columns.length} style={{ textAlign: 'center' }}>
              데이터가 없습니다.
            </Td>
          </tr>
        )}
        {isEdit && (
          <tr>
            <PlusTd colSpan={columns.length} onClick={isOpen}>
              <PlusField>
                <Plus size={20} color="black" />
                추가하기
              </PlusField>
            </PlusTd>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  font: ${font.t2};
  height: 48px;
  background: ${color.orange[50]};
  border-bottom: 1px solid ${color.zinc[200]};
  text-align: left;
  vertical-align: middle;
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  &:first-of-type {
    border-top-left-radius: 8px;
    width: 52px;
    min-width: 52px;
    max-width: 52px;
    flex-grow: 0;
  }

  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  height: 48px;
  font: ${font.t4};
  border-bottom: 1px solid ${color.zinc[200]};
  border: 1px solid ${color.zinc[200]};
  padding: 16px 14px;
  text-align: left;
  vertical-align: middle;

  tbody tr:last-of-type & {
    &:first-of-type {
      border-bottom-left-radius: 8px;
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
`;

const CaptionBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Caption = styled.caption`
  font: ${font.b1};
  color: ${color.zinc[800]};
  margin-bottom: 18px;
`;

const Text = styled.div`
  padding-top: 20px;
  font: ${font.t2};
`;

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font: ${font.t4};
`;

const Option = styled.div`
  display: flex;
  gap: 24px;
`;

const PlusField = styled.div`
  display: flex;
  justify-content: center;
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
