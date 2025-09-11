import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Check } from "@mozu/ui";
import { useState } from "react";
import { useParams } from "react-router";
import { DegCurrentModal, TeamCurrentModal } from "@/components";
import type { TeamInfo } from "@/store";
import { useInvestmentProgress } from "@/hooks";
import { createTableHeaders, transformTeamDataToTableRows } from "@/utils/tableUtils";
import { TableCell } from "./TableCell";

interface Props {
  teamInfo: TeamInfo[];
}

export const ImprovedTeamInfoTable = ({ teamInfo }: Props) => {
  const [isOpenTeam, setIsOpenTeam] = useState(false);
  const [isOpenDeg, setIsOpenDeg] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedDegId, setSelectedDegId] = useState<number | null>(null);

  const { id } = useParams();
  const classId = id ? parseInt(id) : null;
  const { classData, currentInvDeg } = useInvestmentProgress(classId ?? 0);

  const maxInvDeg = classData?.maxInvDeg ?? 0;

  // 테이블 데이터 변환 - 메모이제이션 제거하여 즉시 반응하도록
  console.log("🔄 Table data computing:", {
    currentInvDeg,
    maxInvDeg,
    teamCount: teamInfo?.length,
  });

  const tableData = transformTeamDataToTableRows(teamInfo, currentInvDeg, maxInvDeg);
  const tableHeaders = createTableHeaders(maxInvDeg);

  const handleOpenModal = (teamId: number) => {
    setSelectedTeamId(teamId);
    setIsOpenTeam(true);
  };

  const handleOpenDegModal = (teamId: number, invDeg: number) => {
    setSelectedTeamId(teamId);
    setSelectedDegId(invDeg);
    setIsOpenDeg(true);
  };

  if (!teamInfo || teamInfo.length <= 0) {
    return (
      <Container>
        <Table>
          <Tr isHeader>
            {tableHeaders.map((header, index) => (
              <Th
                key={header}
                isLeft={index === 0}>
                {header}
              </Th>
            ))}
          </Tr>
          <Tr>
            <EmptyMessage colSpan={tableHeaders.length}>팀 정보를 불러오는 중입니다...</EmptyMessage>
          </Tr>
        </Table>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Table>
          <Tr isHeader>
            {tableHeaders.map((header, index) => (
              <Th
                key={header}
                isLeft={index === 0}>
                {header}
              </Th>
            ))}
          </Tr>
          {tableData.map((row, index) => (
            <Tr
              key={row.teamId}
              isNotBorded={index + 1 === tableData.length}>
              {/* 팀명 컬럼 */}
              <Td isLeft>
                <TeamName onClick={() => handleOpenModal(row.teamId)}>{row.teamName}</TeamName>
                {row.isCompleted && (
                  <CompletedBadge>
                    <Check
                      size={12}
                      color={color.green[500]}
                    />
                  </CompletedBadge>
                )}
              </Td>

              {/* 각 차수별 컬럼 */}
              {row.cells.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  data={cell}
                  onClick={() => handleOpenDegModal(row.teamId, cellIndex + 1)}
                />
              ))}

              {/* 총자산 컬럼 */}
              <TableCell
                data={row.totalAssets}
                onClick={() => handleOpenModal(row.teamId)}
              />
            </Tr>
          ))}
        </Table>
      </Container>
      {isOpenTeam && selectedTeamId !== null && (
        <TeamCurrentModal
          isOpen={isOpenTeam}
          setIsOpen={setIsOpenTeam}
          id={selectedTeamId}
        />
      )}
      {isOpenDeg && selectedDegId !== null && (
        <DegCurrentModal
          isOpen={isOpenDeg}
          setIsOpen={setIsOpenDeg}
          id={selectedTeamId ?? 0}
        />
      )}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1152px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: white;
`;

const Tr = styled.tr<{
  isNotBorded?: boolean;
  isHeader?: boolean;
}>`
  width: 100%;
  height: 72px;
  display: flex;
  border-bottom: ${({ isNotBorded }) => (isNotBorded ? "none" : `1px solid ${color.zinc[200]}`)};
  background-color: ${({ isHeader }) => isHeader && `${color.orange[50]}`};
`;

const Th = styled.th<{
  isNotBorded?: boolean;
  isLeft?: boolean;
}>`
  flex: ${({ isLeft }) => (isLeft ? "1" : "0 0 11.11%")};
  border-right: 1px solid ${color.zinc[200]};
  padding: 16px;
  display: flex;
  justify-content: ${({ isLeft }) => (isLeft ? "start" : "center")};
  align-items: center;
  ${font.b1};
  
  &:last-child {
    border-right: none;
  }
`;

const Td = styled.td<{
  isNotBorded?: boolean;
  isLeft?: boolean;
  isTeamName?: boolean;
}>`
  flex: ${({ isLeft }) => (isLeft ? "1" : "0 0 11.11%")};
  border-right: 1px solid ${color.zinc[200]};
  padding: 16px;
  display: flex;
  justify-content: ${({ isLeft }) => (isLeft ? "start" : "center")};
  align-items: center;
  gap: 6px;
  ${font.t4};
  ${({ isTeamName }) => isTeamName && "cursor: pointer"};
  
  &:last-child {
    border-right: none;
  }
`;

const EmptyMessage = styled.td`
  text-align: center;
  padding: 40px 16px;
  color: ${color.zinc[500]};
  font: ${font.b1};
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
  cursor: pointer;
  font: ${font.t2};
  &:hover {
    text-decoration: underline;
  }
`;
