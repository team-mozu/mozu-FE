import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';

interface ITitleType {
  mainTitle?: string;
  subTitle?: string;
}

export const PageTitle = ({ mainTitle, subTitle }: ITitleType) => {
  return (
    <TitleContainer>
      <MainTitle>{mainTitle}</MainTitle>
      <SubTitle>{subTitle}</SubTitle>
    </TitleContainer>
  );
};

const MainTitle = styled.div`
  font: ${font.h2};
  color: ${color.black};
`;

const SubTitle = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: start;
`;
