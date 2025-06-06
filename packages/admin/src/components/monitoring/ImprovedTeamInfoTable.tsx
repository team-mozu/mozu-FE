import { Check } from "@mozu/ui";
import { roundToFixed } from "@/utils";
import { color, font } from "@mozu/design-token";
import styled from "@emotion/styled";
import { TeamInfo } from "@/store";
import { useState } from "react";
import { TeamCurrentModal } from "./TeamCurrentModal";

interface Props {
  teamInfo: TeamInfo[];
  invDeg: number;
  maxInvDeg: number;
}

export const ImprovedTeamInfoTable = ({
  teamInfo,
  invDeg,
  maxInvDeg,
}: Props) => {

  const [isOpenTeam, setIsOpenTeam] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const TableHeaderList = [
    "팀명",
    "1차 투자",
    "2차 투자",
    "3차 투자",
    "4차 투자",
    "5차 투자",
  ];

  console.log(teamInfo);

  const handleOpenModal = (teamId: number, teamName: string) => {
    setSelectedTeamId(teamId);
    setSelectedTeamName(teamName);
    setIsOpenTeam(true);
  };

  if (!teamInfo && teamInfo.length <= 0) return;

  return (
    <>
      <Table>
        <Tr isHeader>
          {TableHeaderList.map((tableHead, index) => {
            if (index > maxInvDeg) return;
            return (
              <Th key={index} isLeft={index === 0}>
                {tableHead}
              </Th>
            );
          })}
          <Th>총자산</Th>
        </Tr>
        {teamInfo.map((team, index) => {
          const isNegative = team.trade.at(-1)?.profitNum.includes("-");

          return (
            <Tr isNotBorded={index + 1 === teamInfo.length} key={index}>
              <Td isLeft>
                <TeamName onClick={() => handleOpenModal(team.teamId, team.teamName)}>{team.teamName}</TeamName>
                {team.trade.length === invDeg && (
                  <CompletedBadge>
                    투자완료 <Check size={18} color={color.green[500]} />
                  </CompletedBadge>
                )}
              </Td>
              {Array.from({ length: maxInvDeg }).map((_, index) => {
                if (index + 1 > invDeg) {
                  return <Td key={index} />;
                }

                const isNegative =
                  team.trade[index] === undefined
                    ? null
                    : team.trade[index].profitNum.includes("-");

                return (
                  <Td key={index}>
                    {team.trade[index] === undefined ? (
                      "진행중"
                    ) : (
                      <Rate isNegative={isNegative}>
                        <span>{team.trade[index].totalMoney}원</span>
                        <span>
                          {!isNegative && "+"}
                          {team.trade[index].valMoney}원 ({!isNegative && "+"}
                          {roundToFixed(
                            parseFloat(team.trade[index].profitNum),
                            2
                          )}
                          )
                        </span>
                      </Rate>
                    )}
                  </Td>
                );
              })}
              <Td isNotBorded>
                {team.trade.length > 0 ? (
                  <Rate isNegative={isNegative}>
                    <span>{team.trade.at(-1).totalMoney}원</span>
                    <span>
                      {!isNegative && "+"}
                      {team.trade.at(-1).valMoney}원 ({!isNegative && "+"}
                      {roundToFixed(parseFloat(team.trade.at(-1).profitNum), 2)})
                    </span>
                  </Rate>
                ) : (
                  "진행중"
                )}
              </Td>
            </Tr>
          );
        })}
      </Table>
      {isOpenTeam && selectedTeamId !== null && (
        <TeamCurrentModal
          teamId={selectedTeamId}
          isOpen={isOpenTeam}
          setIsOpen={setIsOpenTeam}
          teamName={selectedTeamName}
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
  border-bottom: ${({ isNotBorded }) =>
    isNotBorded ? "none" : `1px solid ${color.zinc[200]}`};
  background-color: ${({ isHeader }) => isHeader && `${color.orange[50]}`};
`;

const Th = styled.th<{
  isNotBorded?: boolean;
  isLeft?: boolean;
}>`
  flex: ${({ isLeft }) => (isLeft ? "1" : "0 0 13.23%")};
  border-right: ${({ isNotBorded }) =>
    isNotBorded ? "none" : `1px solid ${color.zinc[200]}`};
  padding: 16px;
  display: flex;
  justify-content: ${({ isLeft }) => (isLeft ? "start" : "center")};
  align-items: center;
  ${font.b1};
`;

const Td = styled.td<{
  isNotBorded?: boolean;
  isLeft?: boolean;
}>`
  flex: ${({ isLeft }) => (isLeft ? "1" : "0 0 13.23%")};
  border-right: ${({ isNotBorded }) =>
    isNotBorded ? "none" : `1px solid ${color.zinc[200]}`};
  padding: 16px;
  display: flex;
  justify-content: ${({ isLeft }) => (isLeft ? "start" : "center")};
  align-items: center;
  gap: 6px;
  ${font.t4};
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

const Rate = styled.div<{ isNegative: boolean }>`
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
    color: ${({ isNegative }) =>
    isNegative ? color.blue[500] : color.red[500]};
  }
`;

const TeamName = styled.span`
  cursor: pointer;
  font: ${font.t2};
  :hover {
    text-decoration: underline;
  }
`;
