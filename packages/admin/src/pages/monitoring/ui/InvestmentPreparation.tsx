import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Del, Modal, Toast, WarningMsg } from "@mozu/ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTeamStore } from "@/app/store";
import { useEndClass as useClassStop, useGetClassDetail, useNextDegree } from "@/entities/class";
import { ParticipationContainer } from "@/features/monitoring";
import { type LessonSSEConnectedData, type TeamPartInData, useTypeSSE } from "@/shared/lib/hooks";
import { SSELoadingSpinner } from "@/shared/ui";

export const InvestmentPreparation = () => {
  const { id } = useParams();
  const { data: classNameData } = useGetClassDetail(id ?? "");
  const [inviteCode] = useState(() => localStorage.getItem("inviteCode") || "로딩중...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [datas, setDatas] = useState<{
    teams: {
      title: string;
      school: string;
    }[];
  }>({
    teams: [],
  });

  const nextDegree = useNextDegree(id, () => {
    setIsSubmitting(false);
    navigate(`/class-management/${id}/monitoring`);
  });
  const stopClass = useClassStop(id, () => {
    setIsModalOpen(false);
    Toast("수업을 성공적으로 취소했습니다.", {
      type: "success",
    });
    navigate(`/class-management/${id}`);
  });
  const { setTeamInfo, clearTeamInfo } = useTeamStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { isConnected, isConnecting } = useTypeSSE(
    `${import.meta.env.VITE_SERVER_URL}/lesson/sse/${id}`,
    (data: any) => {
      console.log(data.message);
    },
    (error: any) => {
      console.log(error.message);
    },
    {
      LESSON_SSE_CONNECTED: (data: LessonSSEConnectedData) => {
        console.log("SSE 연결 성공:", data.message);
      },
      TEAM_PART_IN: (data: TeamPartInData) => {
        console.log("참여팀:", data.teamName, "학교:", data.schoolName);
        setDatas(prev => {
          const updatedData = {
            ...prev,
            teams: [
              ...(prev?.teams || []),
              {
                title: data.teamName,
                school: data.schoolName,
              },
            ],
          };
          console.log("업데이트된 데이터:", updatedData);
          return updatedData;
        });
        setTeamInfo({
          teamId: data.teamId,
          teamName: data.teamName,
          schoolName: data.schoolName,
          trade: [],
        });
        Toast(`${data.teamName}이 참가했습니다`, {
          type: "success",
        });
      },
      TEAM_INV_END: () => {
        Toast("팀 투자가 종료되었습니다", {
          type: "info",
        });
      },
    },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    clearTeamInfo();
  }, []);

  const handleNext = () => {
    if (id) {
      if (isSubmitting) return;
      if (datas.teams.length === 0) {
        Toast("최소 한 팀 이상이 참여해야 합니다.", {
          type: "error",
        });
        return;
      }

      setIsSubmitting(true);
      nextDegree.mutate();
    }
  };

  const handleCancel = () => {
    if (id) {
      stopClass.mutate();
    }
  };

  const handleOpenCancelModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <SSELoadingSpinner isVisible={isConnecting && !isConnected} />
      {isModalOpen && (
        <Modal
          mainTitle={"수업을 취소하실 건가요?"}
          subTitle="취소하면 복구가 불가능합니다."
          onSuccessClick={handleCancel}
          icon={
            <Del
              size={24}
              color={color.red[400]}
            />
          }
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          isPending={stopClass.isPending}
        />
      )}
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
              onClick={handleOpenCancelModal}
              iconSize={24}
              iconColor={color.zinc[800]}
              hoverBackgroundColor={color.zinc[100]}>
              취소하기
            </Button>
            <Button
              width={240}
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
              hoverBackgroundColor={color.orange[600]}
              onClick={handleNext}
              disabled={datas.teams.length === 0 || isSubmitting}>
              진행하기 ({datas.teams.length ?? 0})
            </Button>
          </BtnContainer>
        </ContentContainer>
      </InvestmentPreparationContainer>
    </>
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
