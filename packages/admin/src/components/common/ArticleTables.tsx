import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  Row,
  flexRender,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, CheckBox, Select, Plus } from '@mozu/ui';
import { useState } from 'react';
import { AddArticleItemModal } from '../article';

interface tableData {
  article: string;
  checked: boolean;
}

interface IPropType {
  isEdit: boolean;
  round: number;
}

export const ArticleTables = ({ isEdit, round }: IPropType) => {
  const [data, setData] = useState<tableData[]>([
    { article: '안녕하세요', checked: false },
    { article: '반갑습니다', checked: false },
    { article: '반갑습니다', checked: false },
    { article: '반갑습니다', checked: false },
    { article: '반갑습니다', checked: false },
  ]);
  const [isModal, setIsModal] = useState<boolean>(false);

  const hasCheckedItems = data.some((row) => row.checked);

  const toggleAll = () => {
    const allChecked = data.every((row) => row.checked);
    setData((prevData) =>
      prevData.map((row) => ({ ...row, checked: !allChecked })),
    );
  };

  const toggleRow = (index: number) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index].checked = !newData[index].checked;
      return newData;
    });
  };

  const handleDeleteChecked = () => {
    setData((prevData) => {
      const newData = prevData.filter((row) => !row.checked);

      if (newData.length > 0 && !newData.some((row) => row.checked)) {
        return newData;
      }

      return newData;
    });
  };

  const columns: ColumnDef<tableData>[] = [
    ...(isEdit
      ? [
          {
            accessorKey: 'checked',
            header: () => (
              <CheckBox
                onChange={toggleAll}
                checked={data.length > 0 && data.every((row) => row.checked)}
                id="header-checkbox"
              />
            ),
            cell: ({ row }: { row: Row<tableData> }) => (
              <CheckBox
                checked={row.original.checked}
                onChange={() => toggleRow(row.index)}
                id={`row-checkbox-${row.index}`}
              />
            ),
            size: 52,
          },
        ]
      : []),
    { accessorKey: 'article', header: '기사 제목', size: 1460 },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const isOpen = () => {
    setIsModal(true);
  };

  const isClose = () => {
    setIsModal(false);
  };
  return (
    <Table>
      {isModal && <AddArticleItemModal close={isClose} />}
      <Caption>
        <CaptionBox>
          <Text>기사 목록</Text>
          {isEdit ? (
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
          ) : (
            []
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
                  : typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
              </Th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td key={cell.id} style={{ width: cell.column.getSize() }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </tr>
        ))}
        {isEdit ? (
          <tr>
            <PlusTd colSpan={9} width="1510" onClick={isOpen}>
              <PlusField>
                <Plus size={20} color="black" />
                추가하기
              </PlusField>
            </PlusTd>
          </tr>
        ) : (
          []
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
  font: ${font.b1};
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
  font: ${font.b2};
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
