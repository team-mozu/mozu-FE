import { ResultContainer, RankModal } from "@/components";
import styled from "@emotion/styled";
import { useState } from "react";
import { useGetTeamDetail } from "@/apis";

export const ResultPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

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
