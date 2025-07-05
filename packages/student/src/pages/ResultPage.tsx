import { ResultContainer, RankModal } from "@/components";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useGetTeamDetail } from "@/apis";
import { useNavigate, useLocation } from "react-router-dom";

export const ResultPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeRouteLeave = (e: PopStateEvent) => {
      const confirmLeave = window.confirm("정말 나가시겠습니까?\n\n나가시면 재접속 불가합니다");
      if (!confirmLeave) {
        navigate(location.pathname);
        history.pushState(null, "", location.pathname);
      }
    };

    window.addEventListener("popstate", handleBeforeRouteLeave);

    return () => {
      window.removeEventListener("popstate", handleBeforeRouteLeave);
    };
  }, [navigate, location]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data: teamInfo } = useGetTeamDetail();
  const endRound = teamInfo?.maxInvDeg;

  return (
    <Container>
      <ResultContainer onRankClick={handleOpenModal} endRound={endRound} />
      {isModalOpen && <RankModal onCancle={handleCloseModal} endRound={endRound} />}
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
`;
