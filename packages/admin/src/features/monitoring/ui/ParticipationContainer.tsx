import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { TeamContainer } from "@mozu/ui";
import { useState } from "react";
import { Tooltip } from "react-tooltip";

interface teamData {
  title: string;
  school: string;
}

interface IParticipationType {
  code: string;
  teamDatas: teamData[];
}

export const ParticipationContainer = ({ code, teamDatas }: IParticipationType) => {
  const [tooltipContent, setTooltipContent] = useState("클릭하여 복사하기");

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setTooltipContent("복사 완료!");

      setTimeout(() => {
        setTooltipContent("클릭하여 복사하기");
      }, 3000);
    } catch (_e) {
      setTooltipContent("복사 실패");

      setTimeout(() => {
        setTooltipContent("클릭하여 복사하기");
      }, 3000);
    }
  };

  const datas = teamDatas;

  return (
    <ParticipationAllContainer>
      <CodeContainer>
        <CodeSubContent>
          <CodeTitle>참가 코드</CodeTitle>
          <Code
            onClick={() => handleCopyClipBoard(code)}
            data-tooltip-id="code-tooltip"
            data-tooltip-content={tooltipContent}>
            {code}
          </Code>
          <Tooltip
            id="code-tooltip"
            place="bottom"
            style={{
              backgroundColor: color.green[500],
              color: color.white,
              fontWeight: 500,
              borderRadius: "4px",
              padding: "8px 12px",
              fontSize: "14px",
            }}
          />
        </CodeSubContent>
        <CodeSubTitle>참가 코드를 학생들에게 공유해 주세요.</CodeSubTitle>
      </CodeContainer>
      <TeamContentContainer>
        {datas.length ? (
          <TeamContent>
            {datas.map((data, index) => (
              <TeamContainer
                key={index}
                title={data.title}
                school={data.school}
              />
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

// 스타일 컴포넌트는 변경 없음
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

  /* 데스크탑 반응형 - 컨테이너 크기 조정 */
  @media (max-width: 1440px) {
    width: 920px;
    height: 380px;
  }

  @media (max-width: 1200px) {
    width: 840px;
    height: 360px;
    border-radius: 12px;
  }

  @media (max-width: 1024px) {
    width: 760px;
    height: 340px;
    border-radius: 10px;
  }

  @media (max-width: 900px) {
    width: 680px;
    height: 320px;
    border-radius: 8px;
  }
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

  /* 데스크탑 반응형 - 팀 콘텐츠 영역 조정 */
  @media (max-width: 1440px) {
    width: 536px;
    height: 364px;
  }

  @media (max-width: 1200px) {
    width: 488px;
    height: 344px;
    border-radius: 6px;
    padding: 6px;
  }

  @media (max-width: 1024px) {
    width: 440px;
    height: 324px;
    padding: 6px;
  }

  @media (max-width: 900px) {
    width: 392px;
    height: 304px;
    border-radius: 4px;
    padding: 4px;
  }
`;
const CodeContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;

  /* 데스크탑 반응형 - 코드 컨테이너 조정 */
  @media (max-width: 1440px) {
    width: 368px;
    height: 380px;
  }

  @media (max-width: 1200px) {
    width: 336px;
    height: 360px;
  }

  @media (max-width: 1024px) {
    width: 304px;
    height: 340px;
  }

  @media (max-width: 900px) {
    width: 272px;
    height: 320px;
  }
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

  /* 데스크탑 반응형 - 폰트 크기 조정 */
  @media (max-width: 1200px) {
    font: ${font.t3};
  }

  @media (max-width: 1024px) {
    font: ${font.t4};
  }

  @media (max-width: 900px) {
    font: ${font.b1};
  }
`;
const Code = styled.div`
  cursor: pointer;
  font: ${font.h1};
  color: ${color.orange[500]};

  &:hover {
    text-decoration: underline;
  }

  /* 데스크탑 반응형 - 코드 폰트 크기 조정 */
  @media (max-width: 1200px) {
    font: ${font.h2};
  }

  @media (max-width: 1024px) {
    font: ${font.h3};
  }

  @media (max-width: 900px) {
    font: ${font.h4};
  }
`;
const CodeSubTitle = styled.div`
  font: ${font.l1};
  color: ${color.zinc[500]};
  position: absolute;
  bottom: 24px;
  left: 95px;

  /* 데스크탑 반응형 - 서브타이틀 조정 */
  @media (max-width: 1440px) {
    bottom: 22px;
    left: 87px;
    font: ${font.l1};
  }

  @media (max-width: 1200px) {
    bottom: 20px;
    left: 79px;
    font: ${font.l2};
  }

  @media (max-width: 1024px) {
    bottom: 18px;
    left: 71px;
    font: ${font.l2};
  }

  @media (max-width: 900px) {
    bottom: 16px;
    left: 63px;
    font: ${font.l2};
  }
`;
