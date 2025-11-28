import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { StockTable } from "@/features";
import { TotalProperty } from "@/shared";

// Mock Data for UI rendering
const mockTeamData = {
  totalMoney: 12345678,
  profitNum: "+1,234,567",
  valueProfit: 11.5,
  baseMoney: 10000000,
  cashMoney: 2345678,
  valueMoney: 10000000,
};

export const MockStudentClassPage = () => {

  return (
    <Wrapper>

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
