import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { ArticleDetail } from "@/entities/news";
import { useGetArticleList } from "@/entities/news";
import { useGetTeamDetail } from "@/entities/user";
import { ArticleModal } from "@/features/news-reading";
import { StockTable } from "@/features/stock-trading";
import { TotalProperty } from "@/shared/ui";

// 컴포넌트 외부에 전역 상태로 관리하여 마운트/언마운트 시에도 유지
const shownInvDegs = new Set<number>();

// 전역 상태 초기화 함수 export
export const resetShownInvDegs = () => {
  shownInvDegs.clear();
};

export const HomePage = () => {
  const { data: teamData, isLoading } = useGetTeamDetail();
  const { data: newsData } = useGetArticleList();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [newArticles, setNewArticles] = useState<ArticleDetail[]>([]);
  const location = useLocation();

  // 라우트 변경 감지하여 상태 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    // 라우트가 변경될 때마다 모달 상태 초기화
    setIsModalOpen(false);
    setNewArticles([]);
    setCurrentArticleIndex(0);
  }, [
    location.pathname,
  ]);

  // invDeg 변경 감지 및 새 기사 모달 표시
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    if (isLoading || !teamData || !newsData) return;

    const currentInvDeg = teamData.invDeg;

    // 해당 차수의 모달을 아직 표시하지 않은 경우에만 표시
    if (!shownInvDegs.has(currentInvDeg)) {
      // 해당 차수를 표시했다고 기록
      shownInvDegs.add(currentInvDeg);

      // 현재 차수에 해당하는 기사들 표시
      showArticlesForCurrentInvDeg();
    }
  }, [
    teamData?.invDeg,
    newsData,
    isLoading,
  ]);

  // 현재 차수에 해당하는 기사들을 표시하는 함수
  const showArticlesForCurrentInvDeg = () => {
    if (!newsData || newsData.length === 0) return;

    // 현재 차수에 해당하는 기사들을 필터링
    const articlesForCurrentInvDeg = getArticlesForInvDeg(newsData);

    if (articlesForCurrentInvDeg.length > 0) {
      setNewArticles(articlesForCurrentInvDeg);
      setCurrentArticleIndex(0);
      setIsModalOpen(true);
    }
  };

  // invDeg에 따라 해당하는 기사들을 반환하는 함수
  const getArticlesForInvDeg = (allArticles: ArticleDetail[]) => {
    // 기사 데이터에 invDeg 필드가 없으므로 모든 기사를 반환
    return allArticles;
  };

  // 모달 네비게이션 핸들러들
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
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Wrapper>
      {/* 기사 모달 */}
      {isModalOpen && newArticles.length > 0 && (
        <ArticleModal
          article={{
            id: newArticles[currentArticleIndex].articleId,
            title: newArticles[currentArticleIndex].title,
            description: newArticles[currentArticleIndex].description,
            image: newArticles[currentArticleIndex].image,
          }}
          total={newArticles.length}
          current={currentArticleIndex}
          onPrev={handlePrevArticle}
          onNext={handleNextArticle}
          onClose={handleCloseModal}
          isFirst={currentArticleIndex === 0}
          isLast={currentArticleIndex === newArticles.length - 1}
        />
      )}

      {/* 메인 컨텐츠 */}
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
  width: calc(100dvw - 780px);
  min-height: calc(100vh - 64px);
  height: 100%;
`;
