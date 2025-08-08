import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useEffect, useState } from "react";
import { StockTable, TotalProperty } from "@/components";
import { ArticleModal } from "@/components/news/ArticleModal";

// Mock Data for UI rendering
const mockTeamData = {
  totalMoney: 12345678,
  profitNum: "+1,234,567",
  valueProfit: 11.5,
  baseMoney: 10000000,
  cashMoney: 2345678,
  valueMoney: 10000000,
};

const mockNewsData = [
  {
    id: 1,
    title: "[MOCK] 시장, 기록적인 최고치 경신",
    content:
      "이것은 모의 뉴스 기사입니다. 주식 시장은 기술 및 재생 에너지 부문에 힘입어 전례 없는 성장을 보였습니다. 투자자들은 미래에 대해 낙관적입니다.",
  },
  {
    id: 2,
    title: "[MOCK] AI의 새로운 혁신에 대한 보고서",
    content:
      "인공 지능의 획기적인 발전이 발표되어 여러 산업에 혁명을 일으킬 것으로 예상됩니다. 이 기사는 뉴스 모달 기능을 시연하기 위한 것입니다.",
  },
];

export const MockStudentClassPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  // 페이지가 마운트될 때 모의 기사 모달을 자동으로 엽니다.
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  // 모달 네비게이션 핸들러
  const handlePrevArticle = () => {
    if (currentArticleIndex > 0) {
      setCurrentArticleIndex(currentArticleIndex - 1);
    }
  };

  const handleNextArticle = () => {
    if (currentArticleIndex < mockNewsData.length - 1) {
      setCurrentArticleIndex(currentArticleIndex + 1);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Wrapper>
      {/* 기사 모달 */}
      {isModalOpen && mockNewsData.length > 0 && (
        <ArticleModal
          article={mockNewsData[currentArticleIndex]}
          total={mockNewsData.length}
          current={currentArticleIndex}
          onPrev={handlePrevArticle}
          onNext={handleNextArticle}
          onClose={handleCloseModal}
          isFirst={currentArticleIndex === 0}
          isLast={currentArticleIndex === mockNewsData.length - 1}
        />
      )}

      {/* 메인 컨텐츠 */}
      <TotalProperty
        totalMoney={mockTeamData.totalMoney.toLocaleString()}
        profitNum={mockTeamData.profitNum}
        valueProfit={mockTeamData.valueProfit}
        basicMoney={mockTeamData.baseMoney.toLocaleString()}
        cashMoney={mockTeamData.cashMoney.toLocaleString()}
        valueMoney={mockTeamData.valueMoney.toLocaleString()}
      />

      <TableDiv>
        보유주식
        <StockTable isMock={true} />
      </TableDiv>
    </Wrapper>
  );
};

// HomePage.tsx에서 스타일 복사
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
