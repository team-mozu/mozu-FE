import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useGetTeamDetail } from "@/entities/user";
import { StockTable } from "@/features";
import { SSELoadingSpinner, TotalProperty } from "@/shared";
import { useSSE } from "@/shared/contexts";

// 컴포넌트 외부에 전역 상태로 관리하여 마운트/언마운트 시에도 유지
const shownInvDegs = new Set<number>();

// 전역 상태 초기화 함수 export
export const resetShownInvDegs = () => {
  shownInvDegs.clear();
};

export const HomePage = () => {
  const { data: teamData, isLoading } = useGetTeamDetail();

  const { isReconnecting, retryCount } = useSSE();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Wrapper>
      <SSELoadingSpinner
        isVisible={isReconnecting}
        retryCount={retryCount}
      />

      {/* 메인 컨텐츠 */}
      <TotalProperty
        totalMoney={teamData?.totalMoney.toLocaleString() ?? "0"}
        profitNum={teamData?.profitNum ?? "0"}
        valueProfit={teamData?.valProfit ?? 0}
        basicMoney={teamData?.baseMoney.toLocaleString() ?? "0"}
        cashMoney={teamData?.cashMoney.toLocaleString() ?? "0"}
        valueMoney={teamData?.valuationMoney.toLocaleString() ?? "0"}
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
