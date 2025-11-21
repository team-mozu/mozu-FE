import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Check } from "@mozu/ui";
import { useState } from "react";
import { is } from "zod/v4/locales";
import type { TeamInfo } from "@/app/store";
import { roundToFixed } from "@/shared/lib";
import { DegCurrentModal, TeamCurrentModal } from ".";

interface Props {
  teamInfo: TeamInfo[];
  invDeg: number;
  maxInvDeg: number;
}

export const ImprovedTeamInfoTable = ({ teamInfo, invDeg, maxInvDeg }: Props) => {
  const [isOpenTeam, setIsOpenTeam] = useState(false);
  const [isOpenDeg, setIsOpenDeg] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedDegId, setSelectedDegId] = useState<number | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  // 헤더 리스트를 동적으로 생성
  const getTableHeaders = () => {
    const headers = [
      "팀명",
    ];
    for (let i = 1; i <= maxInvDeg; i++) {
      headers.push(`${i}차 투자`);
    }
    headers.push("총자산");
    return headers;
  };

  const tableHeaders = getTableHeaders();

  const handleOpenModal = (teamId: string, teamName: string) => {
    setSelectedTeamId(teamId);
    setSelectedTeamName(teamName);
    setIsOpenTeam(true);
  };

  const handleOpenDegModal = (teamId: string, invDeg: number) => {
    setSelectedTeamId(teamId);
    setSelectedDegId(invDeg);
    setIsOpenDeg(true);
  };

  if (!teamInfo || teamInfo.length <= 0) return null;

  return (
    <>
      <Table>
        <thead>
          <Tr isHeader>
            {tableHeaders.map((tableHead, index) => (
              <Th
                key={index}
                isLeft={index === 0}>
                {tableHead}
              </Th>
            ))}
          </Tr>
        </thead>
        <tbody>
          {teamInfo.map((team, index) => {
            const profitNum = team.trade.at(-1)?.profitNum;
            const isNegative = typeof profitNum === "string" ? profitNum.includes("-") : profitNum && profitNum < 0;

            return (
              <Tr
                isNotBorded={index + 1 === teamInfo.length}
                key={index}>
                <Td isLeft>
                  <TeamName isTeamName>{team.teamName}</TeamName>
                  {team.trade.length === invDeg && (
                    <CompletedBadge>
                      투자완료{" "}
                      <Check
                        size={18}
                        color={color.green[500]}
                      />
                    </CompletedBadge>
                  )}
                </Td>
                {Array.from({
                  length: maxInvDeg,
                }).map((_, degIndex) => {
                  const currentDeg = degIndex + 1; // 1차, 2차, 3차...

                  if (currentDeg > invDeg) {
                    return <Td key={degIndex} />;
                  }

                  // 현재가는 0번째 인덱스, 1차 투자는 1번째 인덱스...
                  // 하지만 테이블 헤더는 "1차 투자", "2차 투자"로 표시되므로
                  // degIndex(0, 1, 2...)를 그대로 사용하여 배열 인덱스와 매칭
                  const tradeData = team.trade[degIndex];
                  const profitNum = tradeData?.profitNum;
                  const isNegative =
                    tradeData === undefined
                      ? null
                      : typeof profitNum === "string"
                        ? profitNum.includes("-")
                        : profitNum && profitNum < 0;

                  return (
                    <Td key={degIndex}>
                      {tradeData === undefined ? (
                        "진행중"
                      ) : (
                        <Rate
                          isTotalMoney={false}
                          isNegative={isNegative}
                          onClick={() => handleOpenDegModal(team.teamId, currentDeg)}>
                          <span>{tradeData?.totalMoney?.toLocaleString() ?? "-"}원</span>
                          <span>
                            {!isNegative && "+"}
                            {tradeData?.valMoney?.toLocaleString() ?? "0"}원 ({!isNegative && "+"}
                            {roundToFixed(
                              typeof tradeData?.profitNum === "string"
                                ? parseFloat(tradeData?.profitNum as string)
                                : ((tradeData?.profitNum as number) ?? 0),
                              2,
                            )}
                            %)
                          </span>
                        </Rate>
                      )}
                    </Td>
                  );
                })}
                {/* 총자산 컬럼 */}
                <Td>
                  {team.trade.length > 0 ? (
                    <Rate
                      isTotalMoney={true}
                      isNegative={isNegative}>
                      <span>{team.trade.at(-1)?.totalMoney?.toLocaleString() ?? "0"}원</span>
                      <span>
                        {!isNegative && "+"}
                        {team.trade.at(-1)?.valMoney?.toLocaleString() ?? "0"}원 ({!isNegative && "+"}
                        {(() => {
                          const lastProfitNum = team.trade.at(-1)?.profitNum;
                          const numValue =
                            typeof lastProfitNum === "string" ? parseFloat(lastProfitNum) : (lastProfitNum ?? 0);
                          return roundToFixed(numValue, 2);
                        })()}
                        %)
                      </span>
                    </Rate>
                  ) : (
                    "진행중"
                  )}
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
      {isOpenTeam && selectedTeamId !== null && (
        <TeamCurrentModal
          isOpen={isOpenTeam}
          setIsOpen={setIsOpenTeam}
          id={selectedTeamId ?? ""}
        />
      )}
      {isOpenDeg && selectedDegId !== null && (
        <DegCurrentModal
          isOpen={isOpenDeg}
          setIsOpen={setIsOpenDeg}
          id={selectedTeamId ?? ""}
        />
      )}
    </>
  );
};

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

const Rate = styled.div<{
  isTotalMoney: boolean;
  isNegative: boolean | null | undefined;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: end;
  width: 100%;
  & > span:nth-of-type(1) {
    ${font.t1};
  }
  & > span:nth-of-type(2) {
    ${font.l1};
    color: ${({ isNegative }) => (isNegative ? color.blue[500] : color.red[500])};
  }
  
  ${({ isTotalMoney }) => !isTotalMoney && {
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  }};
`;

const TeamName = styled.span<{
  isTeamName?: boolean;
}>`
font: ${font.t2};
`;
