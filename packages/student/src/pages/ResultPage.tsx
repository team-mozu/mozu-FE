// TODO: 소수점이 너무 길게 나와요
import { ResultContainer, RankModal } from "@/components";
import styled from "@emotion/styled";
import { useState } from "react";

export const ResultPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <ResultContainer onRankClick={handleOpenModal} />
      {isModalOpen && <RankModal onCancle={handleCloseModal} />}
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
