import { TeamContainer } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IParticipationType {
  code: number;
  teamDatas: object;
}

export const ParticipationContainer = ({
  code,
  teamDatas,
}: IParticipationType) => {
  const datas = teamDatas;
  return (
    <ParticipationAllContainer>
      <CodeContainer>
        <CodeSubContent>
          <CodeTitle>참가 코드</CodeTitle>
          <Code>{code}</Code>
        </CodeSubContent>
        <CodeSubTitle>참가 코드를 학생들에게 공유해 주세요.</CodeSubTitle>
      </CodeContainer>
      <TeamContentContainer>
        {datas.length ? (
          <TeamContent>
            {datas.map((data) => (
              <TeamContainer title={data.title} school={data.school} />
            ))}
          </TeamContent>
        ) : (
          <TeamTitleContainer>
            <TeamTitle>참가 팀 기다리는 중...</TeamTitle>
            <TeamSubTitle>한 팀 이상 참가하면 진행할 수 있어요.</TeamSubTitle>
          </TeamTitleContainer>
        )}
      </TeamContentContainer>
    </ParticipationAllContainer>
  );
};

const TeamContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

const ParticipationAllContainer = styled.div`
  width: 1000px;
  height: 400px;
  border-radius: 16px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
  display: flex;
  align-items: center;
`;

const TeamTitle = styled.div`
  font: ${font.h4};
  color: ${color.zinc[600]};
`;

const TeamSubTitle = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
`;

const TeamTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const TeamContentContainer = styled.div`
  width: 584px;
  height: 384px;
  border-radius: 8px;
  border: 1px solid ${color.zinc[100]};
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  overflow: scroll;
`;

const CodeContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
`;

const CodeSubContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const CodeTitle = styled.div`
  font: ${font.t2};
  color: ${color.black};
`;

const Code = styled.div`
  font: ${font.h1};
  color: ${color.orange[500]};
`;

const CodeSubTitle = styled.div`
  font: ${font.l1};
  color: ${color.zinc[500]};
  position: absolute;
  bottom: 24px;
  left: 95px;
`;
