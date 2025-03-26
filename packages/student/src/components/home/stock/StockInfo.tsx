import { font } from '@mozu/design-token';
import { Accounts } from '@mozu/ui';
import styled from '@emotion/styled';
import { color } from '@mozu/design-token';
import { useGetStockDetail } from '@/apis';
import { useParams } from 'react-router-dom';

export const StockInfo = () => {
  const { stockId } = useParams();
  const itemId = stockId ? parseInt(stockId) : null;
  const { data } = useGetStockDetail(itemId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
      <CompanyInfo>
        <Label>회사 정보</Label>
        <div>
          <p>{data?.itemInfo ?? ''}</p>
        </div>
      </CompanyInfo>
      <CompanyMain>
        <LeftSection>
          <Label>재무상태표</Label>
          <ContentWrapper>
            <Accounts title={'부채'} content={data?.debt ?? 0} />
            <Accounts title={'자본금'} content={data?.capital ?? 0} />
          </ContentWrapper>
        </LeftSection>

        <RightSection>
          <Label>손익계산서</Label>
          <ContentWrapper>
            <Accounts title={'매출액'} content={data?.profit ?? 0} />
            <Accounts title={'매출원가'} content={data?.profitOG ?? 0} />
            <Accounts title={'매출이익'} content={data?.profitBen ?? 0} />
            <Accounts title={'당기순이익'} content={data?.netProfit ?? 0} />
          </ContentWrapper>
        </RightSection>
      </CompanyMain>
    </div>
  );
};

const CompanyInfo = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  & > div {
    width: 100%;
    padding: 16px;
    background-color: ${color.zinc[50]};
    font: ${font.b2};
    color: ${color.black};
    border-radius: 12px;
  }
`;

const CompanyMain = styled.div`
  display: flex;
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
  display: grid;
  gap: 12px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
`;

const Label = styled.label`
  color: ${color.black};
  font: ${font.t3};
`;
