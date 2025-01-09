import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IInvestmentMetricsType {
  title?: string;
  subTitle?: string;
  number?: string;
}

export const InvestmentMetrics = ({
  title,
  subTitle,
  number,
}: IInvestmentMetricsType) => {
  return (
    <InvestMetricsContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
        </TitleContainer>
        <NumberContent>{number}</NumberContent>
      </ContentContainer>
    </InvestMetricsContainer>
  );
};
const NumberContent = styled.div`
  font: ${font.t1};
  color: ${color.zinc[600]};
`;

const InvestMetricsContainer = styled.div`
  width: 400px;
  height: 90px;
  padding: 0 24px;
  border-radius: 12px;
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
`;

const Title = styled.div`
  font: ${font.t3};
  color: ${color.black};
`;

const SubTitle = styled.div`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
