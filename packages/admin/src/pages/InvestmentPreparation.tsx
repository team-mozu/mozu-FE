import { Button, ParticipationContainer, WarningMsg } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useNavigate } from 'react-router';

const datas = [
  {
    code: 587701,
  },
  {
    usedDate: '10일 전',
  },
  {
    teams: [
      { title: '대마고 화이팅', school: '대덕소프트웨어마이스터고등학교' },
      { title: '동욱쌤 제자들', school: '대덕소프트웨어마이스터고등학교' },
    ],
  },
];

export const InvestmentPreparation = () => {
  const navigate = useNavigate();
  return (
    <InvestmentPreparationContainer>
      <ContentContainer>
        <TitleContainer>
          <Title>모의투자 준비</Title>
          <UsedDate>2024년도 모의투자 | {datas[1].usedDate} 사용</UsedDate>
        </TitleContainer>
        <ParticipationContainer
          code={datas[0].code}
          teamDatas={datas[2].teams}
        />
        <WarningMsg message="모의투자를 시작하면 중도참여가 불가능해요." />
        <BtnContainer>
          <Button
            width={240}
            isIcon={true}
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            color={color.zinc[800]}
            type="cancelImg"
            onClick={() => navigate(-1)}
          >
            취소하기
          </Button>
          <Button
            width={240}
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
          >
            진행하기 ({datas[2].teams.length})
          </Button>
        </BtnContainer>
      </ContentContainer>
    </InvestmentPreparationContainer>
  );
};

const InvestmentPreparationContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Title = styled.div`
  font: ${font.h1};
  color: ${color.black};
`;

const UsedDate = styled.div`
  font: ${font.t4};
  color: ${color.zinc[500]};
`;
