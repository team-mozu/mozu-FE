import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, ClassInfoModal, DeleteModal, Toast } from "@mozu/ui";
import { useParams } from "react-router";
import { useState } from "react";
import { FullPageLoader, ArticleInfoModal, ImprovedTeamInfoTable } from "@/components";
import { useGetClassDetail, useNextDegree, useClassStop } from "@/apis";
import { useSSE } from "@/hooks";
import { useTeamStore } from "@/store";
import { queryClient } from "@/utils/queryClient";

export const ImprovedClassMonitoringPage = () => {
  const [isOpenArticle, setIsOpenArticle] = useState<boolean>(false);
  const [isOpenClass, setIsOpenClass] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { teamInfoMap, appendTrade } = useTeamStore();
  const teamInfo = Object.values(teamInfoMap);

  const { id } = useParams();
  const classId = id ? parseInt(id) : null;

  const { data: classData, isLoading, isFetching } = useGetClassDetail(classId);
  const { mutate: nextDegree } = useNextDegree(classId, () => {
    if (!classData) return;

    queryClient.setQueryData(["getClass", classId], {
      ...classData,
      curInvDeg: classData.curInvDeg + 1,
    });
  });
  const { mutate: stopClass } = useClassStop(classId);

  const isDegEnd = classData
    ? teamInfo.every((team) => (team.trade?.length ?? 0) >= classData.curInvDeg)
    : false;

  const articleInfoClick = () => {
    setIsOpenArticle(true);
  };

  const classInfoClick = () => {
    setIsOpenClass(true);
  };

  useSSE(
    `${import.meta.env.VITE_SERVER_URL}/class/sse/${classId}`,
    undefined,
    undefined,
    {
      TEAM_INV_END: (data) => {
        Toast(`${data.teamName}팀의 투자가 종료되었습니다!`, {
          type: "success",
        });

        appendTrade(data.teamId, {
          totalMoney: data.totalMoney,
          valMoney: data.valMoney,
          profitNum: data.profitNum,
        });
      },
    }
  );

  const handleStopClass = () => {
    setIsOpen(true);
  };

  if (isLoading || !classData || isFetching) return <FullPageLoader />;

  return (
    <>
      {
        isOpen && (
          <DeleteModal
            titleComment="모의투자 취소"
            subComment="모의투자를 취소하시겠습니까? 취소 후 투자 데이터는 삭제됩니다."
            onCancel={() => setIsOpen(false)}
            onDelete={() => stopClass()}
          />
        )
      }
      <Container>
        {isOpenArticle && (
          <ArticleInfoModal
            classArticles={classData?.classArticles}
            isOpen={isOpenArticle}
            setIsOpen={setIsOpenArticle}
          />
        )}
        {isOpenClass && (
          <ClassInfoModal
            classItems={classData?.classItems}
            isOpen={isOpenClass}
            setIsOpen={setIsOpenClass}
          />
        )}
        <Header>
          <TitleContainer>
            <Title>모의투자 현황</Title>
            <SubTitle>{classData?.name}</SubTitle>
          </TitleContainer>

          <ButtonContainer>
            <Button
              type={"logOutImg"}
              isIcon={true}
              iconColor={color.zinc[800]}
              iconSize={24}
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              color={color.zinc[800]}
              onClick={() => handleStopClass()}
              hoverBackgroundColor={color.zinc[100]}
            >
              모의투자 취소
            </Button>
            <Button
              type={"startImg"}
              isIcon={true}
              iconColor={color.white}
              iconSize={24}
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
              hoverBackgroundColor={color.orange[600]}
              onClick={() => nextDegree()}
              disabled={!isDegEnd}
            >
              다음 투자 진행
            </Button>
          </ButtonContainer>
        </Header>
        <MainContainer>
          <p>
            <span>{classData?.curInvDeg}차 투자</span>
            진행중
          </p>
          <InfoContainer>
            <ClassInfo>
              <p>
                투자 차수 <span>{classData?.maxInvDeg}차</span>
              </p>
              <span>|</span>
              <p>
                기초자산 <span>{classData?.baseMoney.toLocaleString()}</span>원
              </p>
            </ClassInfo>
            <InfoBtn>
              <Button
                type={"articleImg"}
                isIcon={true}
                color={color.zinc[800]}
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                iconColor={color.zinc[800]}
                iconSize={24}
                onClick={articleInfoClick}
                hoverBackgroundColor={color.zinc[100]}
              >
                기사정보
              </Button>
              <Button
                type={"classImg"}
                isIcon={true}
                color={color.zinc[800]}
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                iconColor={color.zinc[800]}
                iconSize={24}
                onClick={classInfoClick}
                hoverBackgroundColor={color.zinc[100]}
              >
                투자정보
              </Button>
            </InfoBtn>
          </InfoContainer>
          <ImprovedTeamInfoTable
            teamInfo={teamInfo}
            invDeg={classData.curInvDeg}
            maxInvDeg={classData.maxInvDeg}
          />
        </MainContainer>
      </Container>
    </>

  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.p`
  font: ${font.h2};
  color: ${color.black};
`;

const SubTitle = styled.p`
  font: ${font.b1};
  color: ${color.zinc[500]};
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  > p {
    font: ${font.h4};
    color: ${color.zinc[600]};
    display: flex;
    gap: 12px;
    align-items: center;
  }
  > p > span {
    font: ${font.h3};
    color: ${color.orange[500]};
  }
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ClassInfo = styled.div`
  display: flex;
  gap: 1rem;
  padding: 12px 24px;
  background-color: ${color.zinc[100]};
  border: none;
  border-radius: 8px;
  > p {
    font: ${font.b1};
    color: ${color.zinc[600]};
  }
  > p > span {
    font: ${font.b1};
    color: ${color.black};
  }
`;

const InfoBtn = styled.div`
  display: flex;
  gap: 12px;
`;

const TableContainer = styled.div``;
