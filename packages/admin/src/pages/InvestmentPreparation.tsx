import { Button, WarningMsg, Toast } from "@mozu/ui";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useNavigate, useParams } from "react-router";
import { ParticipationContainer } from "@/components";
import { useSSE } from "@/hooks";
import { useEffect, useState } from "react";
import { useClassStop, useGetClassDetail, useNextDegree } from "@/apis";
import { useTeamStore } from "@/store";

export const InvestmentPreparation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const classId = id ? parseInt(id) : null;
  const { data: classNameData } = useGetClassDetail(classId);
  const [inviteCode, setInviteCode] = useState(
    () => localStorage.getItem("inviteCode") || "로딩중..."
  );
  const [datas, setDatas] = useState({ teams: [] });
  const { mutate: nextDegree } = useNextDegree(classId);
  const { mutate: stopClass } = useClassStop(classId);
  const { setTeamInfo, clearTeamInfo } = useTeamStore();

  useEffect(() => {
    clearTeamInfo();
  }, []);

  useSSE(
    `${import.meta.env.VITE_SERVER_URL}/class/sse/${classId}`,
    (data) => {
      console.log(data.message);
    },
    (error) => {
      console.log(error);
      Toast(`SSE 에러 발생: ${error.message}`, { type: "error" });
    },
    {
      TEAM_PART_IN: (teamData) => {
        setDatas((prev) => {
          const updatedData = {
            ...prev,
            teams: [
              ...(prev?.teams || []),
              { title: teamData.teamName, school: teamData.schoolName },
            ],
          };
          console.log("업데이트된 데이터:", updatedData);
          return updatedData;
        });
        setTeamInfo({
          teamId: teamData.teamId,
          teamName: teamData.teamName,
          schoolName: teamData.schoolName,
          trade: [],
        });
        Toast("새로운 팀이 참가했습니다", { type: "success" });
      },
      TEAM_INV_END: (data) => {
        Toast("팀 투자가 종료되었습니다", { type: "info" });
      },
    }
  );

  return (
    <InvestmentPreparationContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>모의투자 준비</Title>
          <UsedDate>{classNameData?.name ?? "로딩중..."}</UsedDate>
        </TitleContainer>
        <ParticipationContainer
          code={inviteCode ?? "로딩중..."}
          teamDatas={datas.teams}
        />
        <WarningMsg message="모의투자를 시작하면 중도참여가 불가능해요." />
        <BtnContainer>
          <Button
            width={240}
            isIcon={true}
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            color={color.zinc[800]}
            type="cancelImg"
            onClick={() => {
              stopClass();
            }}
            iconSize={24}
            iconColor={color.zinc[800]}
            hoverBackgroundColor={color.zinc[100]}
          >
            취소하기
          </Button>
          <Button
            width={240}
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[600]}
            onClick={() => nextDegree()}
            disabled={datas.teams.length === 0}
          >
            진행하기 ({datas.teams.length ?? 0})
          </Button>
        </BtnContainer>
      </ContentContainer>
    </InvestmentPreparationContainer>
  );
};

const InvestmentPreparationContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Title = styled.div`
  font: ${font.h1};
  color: ${color.black};
`;

const UsedDate = styled.div`
  font: ${font.t4};
  color: ${color.zinc[500]};
`;
