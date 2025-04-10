import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Check } from '@mozu/ui';

interface IRateType {
  color: string;
}

interface TeamRow {
  팀명: string;
  '1차 투자': { text: string; rate?: string };
  '2차 투자': { text: string; rate?: string };
  '3차 투자': { text: string; rate?: string };
  '4차 투자': { text: string; rate?: string };
  '5차 투자': { text: string; rate?: string };
  '총 자산': { text: string; rate?: string };
  isCompleted: boolean;
}

const data: TeamRow[] = [
  {
    팀명: '대마고 화이팅',
    '1차 투자': { text: '511,000원', rate: '+200원 (+0.23%)' },
    '2차 투자': { text: '511,000원', rate: '-200원 (-0.23%)' },
    '3차 투자': { text: '511,000원', rate: '+200원 (+0.23%)' },
    '4차 투자': { text: '', rate: undefined },
    '5차 투자': { text: '', rate: undefined },
    '총 자산': { text: '511,000원', rate: '+400원 (+0.53%)' },
    isCompleted: true,
  },
  {
    팀명: '대마고',
    '1차 투자': { text: '511,000원', rate: '+200원 (+0.23%)' },
    '2차 투자': { text: '511,000원', rate: '+200원 (+0.23%)' },
    '3차 투자': { text: '511,000원', rate: '-100원 (-0.13%)' },
    '4차 투자': { text: '', rate: undefined },
    '5차 투자': { text: '', rate: undefined },
    '총 자산': { text: '511,000원', rate: '+500원 (+0.53%)' },
    isCompleted: false,
  },
];

export const TeamInfoTable = () => {
  const columns = useMemo<ColumnDef<TeamRow>[]>(
    () => [
      {
        accessorKey: '팀명',
        header: () => '팀명',
        cell: ({ row }) => {
          const teamName = row.getValue('팀명') as string;
          const isCompleted = row.original.isCompleted;

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{teamName}</span>
              {isCompleted && (
                <CompletedBadge>
                  투자완료 <Check size={18} color={color.green[500]} />
                </CompletedBadge>
              )}
            </div>
          );
        },
      },
      ...[
        '1차 투자',
        '2차 투자',
        '3차 투자',
        '4차 투자',
        '5차 투자',
        '총 자산',
      ].map((key) => ({
        accessorKey: key,
        header: () => (key === '총 자산' ? '총 자산\n(총 수익률)' : key),
        cell: ({ getValue }) => {
          const { text, rate } = getValue() as { text: string; rate?: string };
          const isNegative = rate?.includes('-');

          return (
            <>
              {text}
              {rate && (
                <RateDiv color={isNegative ? color.blue[500] : color.red[500]}>
                  {rate}
                </RateDiv>
              )}
            </>
          );
        },
      })),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Th
                key={header.id}
                width={header.column.id === '팀명' ? '40%' : '15%'}
                alignRight={header.column.id !== '팀명'}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </Th>
            ))}
          </tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td
                key={cell.id}
                width={cell.column.id === '팀명' ? '40%' : '15%'}
                alignRight={cell.column.id !== '팀명'}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const RateDiv = styled.div<IRateType>`
  font: ${font.l1};
  color: ${(props) => props.color};
`;

const Th = styled.th<{ width?: string; alignRight?: boolean }>`
  width: ${(props) => props.width || 'auto'};
  padding: 16px;
  font: ${font.t3};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: ${(props) => (props.alignRight ? 'right' : 'center')};
  height: 72px;
  border: 1px solid ${color.zinc[200]};
  &:first-of-type {
    border-top-left-radius: 8px;
    flex-grow: 0;
  }
  &:last-of-type {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td<{ width?: string; alignRight?: boolean }>`
  width: ${(props) => props.width || 'auto'};
  padding: 16px;
  font: ${font.t1};
  border: 1px solid ${color.zinc[200]};
  height: 72px;
  display: flex;
  align-items: ${(props) => (props.alignRight ? 'flex-end' : 'center')};
  justify-content: ${(props) => (props.alignRight ? 'flex-end' : 'flex-start')};
  flex-direction: ${(props) => (props.alignRight ? 'column' : 'row')};
  text-align: ${(props) => (props.alignRight ? 'right' : 'left')};
  tbody tr:last-of-type & {
    &:first-of-type {
      border-bottom-left-radius: 8px;
    }
    &:last-of-type {
      border-bottom-right-radius: 8px;
    }
  }
`;

const Thead = styled.thead`
  > tr {
    background-color: ${color.orange[50]};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const Tbody = styled.tbody`
  > tr {
    width: 100%;
    background-color: ${color.white};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Table = styled.table`
  border-radius: 8px;
  border-collapse: separate;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
`;

const CompletedBadge = styled.span`
  padding: 2px 6px;
  background-color: ${color.green[50]};
  color: ${color.green[600]};
  font: ${font.l1};
  border-radius: 4px;
  border: 1px solid ${color.green[200]};
  display: flex;
  align-items: center;
  gap: 2px;
`;
