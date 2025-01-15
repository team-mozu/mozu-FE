import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Dot } from './assets';

interface ITeamType {
  title: string;
  school: { title: string; school: string }[];
}

export const TeamContainer = ({ title, school }: ITeamType) => {
  return (
    <TeamContent>
      <ContentContainer>
        <Dot />
        <TitleContainer>
          <Title>{title}</Title>
          <School>{school}</School>
        </TitleContainer>
      </ContentContainer>
    </TeamContent>
  );
};

const TeamContent = styled.div`
  width: 568px;
  height: 100px;
  border-radius: 4px;
  border: 1px solid ${color.zinc[100]};
  background-color: ${color.white};
  padding: 24px;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: start;
  gap: 8px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

const Title = styled.div`
  font: ${font.t1};
  color: ${color.zinc[800]};
`;

const School = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};
`;
