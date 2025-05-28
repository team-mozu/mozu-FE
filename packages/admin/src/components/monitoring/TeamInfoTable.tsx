import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Check } from "@mozu/ui";
import { TeamCurrentModal } from "./TeamCurrentModal";
import { roundToFixed } from "@/utils";
import { color, font } from "@mozu/design-token";
import styled from "@emotion/styled";

interface Team {
  teamId: number;
  teamName: string;
  schoolName: string;
}

interface IRateType {
  color: string;
}

interface TableCell {
  text: string;
  rate: string;
}

interface TeamRow {
  팀명: string;
  "1차 투자": TableCell;
  "2차 투자": TableCell;
  "3차 투자": TableCell;
  "4차 투자": TableCell;
  "5차 투자": TableCell;
  "총 자산": TableCell;
  isCompleted: boolean;
}

interface TradeResult {
  teamId: number;
  invDeg: number;
  totalMoney: number;
  valMoney: number;
  profitNum: string;
}

export const TeamInfoTable = ({
  teamInfo,
  tradeResults,
  invDeg,
}: {
  teamInfo: Team[];
  tradeResults: TradeResult[];
  invDeg: number;
}) => {
  const [isOpenTeam, setIsOpenTeam] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  const TradeKeys = [1, 2, 3, 4, 5] as const;
  type TradePhaseKey = `${(typeof TradeKeys)[number]}차 투자`;

  type TeamRow = {
    팀명: string;
    isCompleted: boolean;
    "총 자산": TableCell;
  } & Record<TradePhaseKey, TableCell>;

  const tableData: TeamRow[] = useMemo(() => {
    return teamInfo.map((team) => {
      const teamResults = tradeResults.filter((r) => r.teamId === team.teamId);

      const row: TeamRow = {
        팀명: team.teamName,
        isCompleted: false,
        "총 자산": { text: "", rate: "" },
        "1차 투자": { text: "", rate: "" },
        "2차 투자": { text: "", rate: "" },
        "3차 투자": { text: "", rate: "" },
        "4차 투자": { text: "", rate: "" },
        "5차 투자": { text: "", rate: "" },
      };

      TradeKeys.forEach((deg) => {
        const key = `${deg}차 투자` as TradePhaseKey;
        const result = teamResults.find((r) => Number(r.invDeg) === deg);

        if (deg === invDeg) {
          row[key] = { text: "진행중..", rate: "" };
        } else if (result) {
          const val = Number(result.valMoney);
          const valStr = `${val >= 0 ? "+" : "-"}${Math.abs(
            val
          ).toLocaleString()}`;
          const profitStr = result.profitNum.startsWith("-")
            ? result.profitNum
            : `+${result.profitNum}`;
          row[key] = {
            text: `${Number(result.totalMoney).toLocaleString()}원`,
            rate: `${valStr}(${profitStr})`,
          };
        }
      });

      const latest = teamResults[teamResults.length - 1];
      if (latest) {
        row["총 자산"] = {
          text: `${Number(latest.totalMoney).toLocaleString()}원`,
          rate: `${latest.profitNum.startsWith("-") ? "" : "+"}${
            latest.profitNum
          }`,
        };
      }

      row.isCompleted = teamResults.length >= 5;
      return row;
    });
  }, [teamInfo, tradeResults, invDeg]);

  const handleOpenModal = (teamId: number, teamName: string) => {
    setSelectedTeamId(teamId);
    setSelectedTeamName(teamName);
    setIsOpenTeam(true);
  };

  const columns = useMemo<ColumnDef<TeamRow>[]>(
    () => [
      {
        accessorKey: "팀명",
        header: () => "팀명",
        cell: ({ row }) => {
          const teamName = row.getValue("팀명") as string;
          const isCompleted = row.original.isCompleted;
          const matchedTeam = teamInfo.find((t) => t.teamName === teamName);

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
              onClick={() =>
                matchedTeam &&
                handleOpenModal(matchedTeam.teamId, matchedTeam.teamName)
              }
            >
              <TeamName>{teamName}</TeamName>
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
        "1차 투자",
        "2차 투자",
        "3차 투자",
        "4차 투자",
        "5차 투자",
        "총 자산",
      ].map((key) => ({
        accessorKey: key,
        header: () => (key === "총 자산" ? "총 자산\n(총 수익률)" : key),
        cell: ({ getValue }) => {
          const { text, rate } = getValue() as TableCell;
          const isPending = text === "진행중..";
          const isNegative = rate?.includes("-");

          const roundedRate =
            rate !== undefined && rate.includes("%")
              ? `${roundToFixed(parseFloat(rate), 3)}%`
              : rate !== undefined
              ? `${roundToFixed(parseFloat(rate), 3)}%`
              : null;

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isPending ? "center" : "flex-end",
                justifyContent: "center",
              }}
            >
              <span>{text}</span>
              {rate && (
                <RateDiv color={isNegative ? color.blue[500] : color.red[500]}>
                  {roundedRate}
                </RateDiv>
              )}
            </div>
          );
        },
      })),
    ],
    [teamInfo]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  width={header.column.id === "팀명" ? "40%" : "15%"}
                  alignRight={header.column.id !== "팀명"}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
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
                  width={cell.column.id === "팀명" ? "40%" : "15%"}
                  alignRight={cell.column.id !== "팀명"}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </tr>
          ))}
        </Tbody>
      </Table>

      {isOpenTeam && selectedTeamId !== null && (
        <TeamCurrentModal
          teamId={selectedTeamId}
          isOpen={isOpenTeam}
          setIsOpen={setIsOpenTeam}
          teamName={selectedTeamName}
        />
      )}
    </div>
  );
};

// Styled Components

export const RateDiv = styled.div<IRateType>`
  font: ${font.l1};
  color: ${(props) => props.color};
`;

const Th = styled.th<{ width?: string; alignRight?: boolean }>`
  width: ${(props) => props.width || "auto"};
  padding: 16px;
  font: ${font.t3};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: ${(props) => (props.alignRight ? "right" : "center")};
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
  width: ${(props) => props.width || "auto"};
  padding: 16px;
  font: ${font.t1};
  border: 1px solid ${color.zinc[200]};
  height: 72px;
  display: flex;
  align-items: ${(props) => (props.alignRight ? "flex-end" : "center")};
  justify-content: ${(props) => (props.alignRight ? "flex-end" : "flex-start")};
  flex-direction: ${(props) => (props.alignRight ? "column" : "row")};
  text-align: ${(props) => (props.alignRight ? "right" : "left")};
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

const TeamName = styled.span`
  :hover {
    text-decoration: underline;
  }
`;
