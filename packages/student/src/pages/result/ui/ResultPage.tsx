import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetTeamDetail } from "@/entities/user";
import { RankModal } from "@/features";
import { ResultContainer, SSELoadingSpinner } from "@/shared";
import { useSSE } from "@/shared/contexts";

export const ResultPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data: teamInfo } = useGetTeamDetail();
  const endRound = teamInfo?.maxInvRound;

  const { isReconnecting, retryCount } = useSSE();

  return (
    <Container>
      <SSELoadingSpinner
        isVisible={isReconnecting}
        retryCount={retryCount}
      />

      <ResultContainer
        onRankClick={handleOpenModal}
        endRound={endRound}
      />

      {isModalOpen && (
        <RankModal
          onCancel={handleCloseModal}
          endRound={endRound}
        />
      )}
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