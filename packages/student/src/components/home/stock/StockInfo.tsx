import { font } from '@mozu/design-token';
import { Accounts } from '@mozu/ui';
import styled from '@emotion/styled';
import { color } from '@mozu/design-token';

export const StockInfo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
      <CompanyInfo>
        <Label>회사 정보</Label>
        <div>
          <p>
            한국 및 DX부문 해외 9개 지역총괄과 DS부문 해외 5개 지역총괄, SDC,
            Harman 등 229개의 종속기업으로 구성된 글로벌 전자기업이다.
          </p>
        </div>
      </CompanyInfo>
      <CompanyMain>
        <LeftSection>
          <Label>재무상태표</Label>
          <ContentWrapper>
            <Accounts title={'부채'} content={'1,050,259억'} />
            <Accounts title={'자본금'} content={'1,050,259억'} />
          </ContentWrapper>
        </LeftSection>

        <RightSection>
          <Label>손익계산서</Label>
          <ContentWrapper>
            <Accounts title={'매출액'} content={'1,050,259억'} />
            <Accounts title={'매출원가'} content={'1,050,259억'} />
            <Accounts title={'매출이익'} content={'1,050,259억'} />
            <Accounts title={'당기순이익'} content={'1,050,259억'} />
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
