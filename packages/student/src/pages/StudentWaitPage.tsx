import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Header, Users, Info, Toast } from '@mozu/ui';
import { useSSE } from '@/hook';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTeamEnd } from '@/apis';

export const StudentWaitPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{ classId: number; nextInvDeg: number }>();
  const { mutate: teamEnd, isSuccess } = useTeamEnd();

  useEffect(() => {
    teamEnd();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      useSSE(
        `${import.meta.env.VITE_SERVER_URL}/team/sse`,
        (data) => {
          Toast(`${data.message}`, { type: 'success' });
        },
        (error) => {
          console.log(error);
          Toast(`SSE 에러 발생: ${error.message}`, { type: 'error' });
        },
        {
          CLASS_NEXT_INV_START: (data) => {
            Toast('다음 투자가 시작되었습니다', { type: 'info' });
            setData(data);
            navigate(`/${data.classId}/home`);
          },
        },
      );
    }
  }, [isSuccess]);

  return (
    <AppContainer>
      <Header isAdmin={false} />
      <Container>
        <IconDiv>
          <Users size={32} color={color.orange[500]} />
        </IconDiv>
        <TextDiv>
          <p>모의투자 시작을 기다리는중...</p>
          <span>2024년도 모의투자</span>
        </TextDiv>
        <p>
          <Info size={18} color={color.zinc[500]} />
          모의투자가 시작되면 자동으로 투자 페이지로 넘어가요.
        </p>
      </Container>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const IconDiv = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${color.orange[50]};
  border: 1px solid ${color.orange[200]};
  border-radius: 12px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 40px;
  > p {
    font: ${font.b1};
    color: ${color.zinc[500]};
    display: flex;
    gap: 4px;
  }
`;

const TextDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  > p {
    font: ${font.h1};
    color: ${color.black};
  }
  > span {
    font: ${font.h4};
    color: ${color.zinc[500]};
  }
`;
