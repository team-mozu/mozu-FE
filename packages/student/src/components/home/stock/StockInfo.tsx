import { font } from "@mozu/design-token";
import { Accounts } from "@mozu/ui";
import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { useGetStockDetail } from "@/apis";
import { useParams } from "react-router-dom";

export const StockInfo = () => {
  const { stockId } = useParams();
  const itemId = stockId ? parseInt(stockId) : null;
  const { data } = useGetStockDetail(itemId);

  return (
    <Container>
      <CompanyInfo>
        <Label>회사 정보</Label>
        <div>
          <StyledText>{data?.itemInfo}</StyledText>
        </div>
      </CompanyInfo>
      <CompanyMain>
        <Section>
          <div>
            <Label>재무상태표</Label>
            <ContentWrapper>
              <Accounts title={"부채"} content={data?.debt ?? 0} />
              <Accounts title={"자본금"} content={data?.capital ?? 0} />
            </ContentWrapper>
          </div>

          <div>
            <Label>손익계산서</Label>
            <ContentWrapper>
              <Accounts title={"매출액"} content={data?.profit ?? 0} />
              <Accounts title={"매출원가"} content={data?.profitOG ?? 0} />
              <Accounts title={"매출이익"} content={data?.profitBen ?? 0} />
              <Accounts title={"당기순이익"} content={data?.netProfit ?? 0} />
            </ContentWrapper>
          </div>
        </Section>
      </CompanyMain>
    </Container>
  );
};

const CompanyInfo = styled.div`
  grid-column: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  & > div {
    width: 100%;
    padding: 16px;
    background-color: ${color.zinc[50]};
    font: ${font.t2};
    color: ${color.black};
    border-radius: 12px;
  }
`;

const StyledText = styled.p`
  white-space: pre-line;
  line-height: 1.7;
  word-break: keep-all;
`;

const CompanyMain = styled.div`
  grid-column: 2; /* 두 번째 열에 배치 */
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LeftSection = styled.div`
  flex: 1; /* 동일한 비율로 공간 차지 */
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const RightSection = styled.div`
  flex: 1; /* 동일한 비율로 공간 차지 */
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  color: ${color.black};
  font: ${font.t3};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const Container = styled.div`
  overflow: scroll;
  padding: 32px;
  background-color: ${color.white};
  width: 1500px;
  height: 95%;
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  display: grid;
  grid-template-columns: 50% 1fr;
  gap: 52px;
`;
