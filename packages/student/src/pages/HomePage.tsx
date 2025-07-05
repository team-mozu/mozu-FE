import { useGetArticleList, useGetTeamDetail } from "@/apis";
import { StockTable, TotalProperty } from "@/components";
import { ArticleModal } from "@/components/news/ArticleModal";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useEffect, useState, useRef } from "react";

export const HomePage = () => {
  const { data: teamData, isLoading } = useGetTeamDetail();
  const { data: newsData } = useGetArticleList();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [newArticles, setNewArticles] = useState<any[]>([]);
  const prevInvDegRef = useRef<number | null>(null);

  // invDeg 변경 감지 및 새 기사 모달 표시
  useEffect(() => {
    if (isLoading || !teamData || !newsData) return;
    const modalShown = sessionStorage.getItem("newsModalShown");
    if (modalShown === "true") return;

    const currentInvDeg = teamData.invDeg;

    // 첫 로드이거나 invDeg가 변경된 경우 모달 표시
    if (
      prevInvDegRef.current === null ||
      prevInvDegRef.current !== currentInvDeg
    ) {
      // 현재 invDeg에 해당하는 새로운 기사들을 찾는 로직
      // 여기서는 예시로 최신 기사들을 가져오는 것으로 가정
      const latestArticles = newsData.slice(0, 3);

      // 새로운 기사가 있을 때만 모달 표시
      if (latestArticles.length > 0) {
        setNewArticles(latestArticles);
        setCurrentArticleIndex(0);
        setIsModalOpen(true);
      }
    }

    prevInvDegRef.current = currentInvDeg;
  }, [teamData?.invDeg, newsData, isLoading]);

  const handlePrevArticle = () => {
    if (currentArticleIndex > 0) {
      setCurrentArticleIndex(currentArticleIndex - 1);
    }
  };

  const handleNextArticle = () => {
    if (currentArticleIndex < newArticles.length - 1) {
      setCurrentArticleIndex(currentArticleIndex + 1);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewArticles([]);
    setCurrentArticleIndex(0);
    sessionStorage.setItem("newsModalShown", "true");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Wrapper>
      {isModalOpen && newArticles.length > 0 && (
        <ArticleModal
          article={newArticles[currentArticleIndex]}
          total={newArticles.length}
          current={currentArticleIndex}
          onPrev={handlePrevArticle}
          onNext={handleNextArticle}
          onClose={handleCloseModal}
          isFirst={currentArticleIndex === 0}
          isLast={currentArticleIndex === newArticles.length - 1}
        />
      )}
      <TotalProperty
        totalMoney={teamData?.totalMoney.toLocaleString() ?? "0"}
        profitNum={teamData?.profitNum ?? "0"}
        valueProfit={teamData?.valueProfit ?? 0}
        basicMoney={teamData?.baseMoney.toLocaleString() ?? "0"}
        cashMoney={teamData?.cashMoney.toLocaleString() ?? "0"}
        valueMoney={teamData?.valueMoney.toLocaleString() ?? "0"}
      />
      <TableDiv>
        보유주식
        <StockTable />
      </TableDiv>
    </Wrapper>
  );
};

const TableDiv = styled.div`
  width: 100%;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 24px;
  font: ${font.t2};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 700px;
  gap: 24px;
  align-items: center;
  padding: 40px;
  width: calc(100dvw - 680px);
  min-height: calc(100vh - 64px);
  height: 100%;
`;
