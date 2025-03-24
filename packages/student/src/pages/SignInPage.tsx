import { useState } from 'react';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Input, LogoWithText, Toast } from '@mozu/ui';
import { useForm, useSSE } from '@/hook';
import { useStudentLogin } from '@/apis';
import { useNavigate } from 'react-router-dom';

export const SignInPage = () => {
  const { state, onChangeInputValue, setState } = useForm<{
    classNum: number | null;
    schoolName: string;
    teamName: string;
  }>({
    classNum: null,
    schoolName: '',
    teamName: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [datas, setDatas] = useState<{ classId: number; nextInvDeg: number }[]>(
    [],
  );
  const navigate = useNavigate();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { mutate: studentLogin, isPending: isStudentLoginLoading } =
    useStudentLogin();

  const handleLogin = () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    studentLogin(state, {
      onSuccess: () => {
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
            CLASS_NEXT_INV_START: (teamData) => {
              setDatas((prevDatas) => [
                ...prevDatas,
                {
                  classId: teamData.classId,
                  nextInvDeg: teamData.nextInvDeg,
                },
              ]);

              Toast('새로운 팀이 참가했습니다', { type: 'success' });
            },
          },
        );
        navigate(`/${datas[0].classId}/home`);
      },
      onError: () => {
        setErrorMessage('형식을 다시 확인해주세요.');
        setState({ classNum: null, schoolName: '', teamName: '' });
      },
      onSettled: () => {
        setIsLoggingIn(false); // 로그인 요청이 끝나면 다시 false로 설정
      },
    });
  };

  return (
    <Container>
      <LogoWrapper>
        <LogoWithText width={74} height={28} />
        모의주식투자
      </LogoWrapper>
      <SigninContainer>
        <p>학생 로그인</p>
        <div
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              state.classNum !== null &&
              state.schoolName.trim() !== '' &&
              state.teamName.trim() !== '' &&
              !isStudentLoginLoading &&
              !isLoggingIn
            ) {
              handleLogin();
            }
          }}
        >
          <Input
            placeholder={'참가 코드를 입력해 주세요..'}
            label={'참가 코드'}
            value={state.classNum ?? ''}
            name="classNum"
            type="text"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 7);
              onChangeInputValue({ target: { name: 'classNum', value } });
              setErrorMessage('');
            }}
          />

          <Input
            placeholder={'학교 이름을 입력해 주세요..'}
            value={state.schoolName}
            name="schoolName"
            label={'학교'}
            onChange={(e) => {
              onChangeInputValue(e);
              setErrorMessage('');
            }}
          />

          <Input
            placeholder={'팀 이름을 입력해 주세요..'}
            value={state.teamName}
            name="teamName"
            label={'팀명'}
            onChange={(e) => {
              onChangeInputValue(e);
              setErrorMessage('');
            }}
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </div>
        <LoginButton
          onClick={handleLogin}
          disabled={
            state.classNum === null ||
            state.schoolName.trim() === '' ||
            state.teamName.trim() === '' ||
            isStudentLoginLoading ||
            isLoggingIn
          }
        >
          로그인
        </LoginButton>
      </SigninContainer>
      <p>© 대덕소프트웨어마이스터고등학교</p>
    </Container>
  );
};

const ErrorMessage = styled.p`
  color: ${color.red[500]};
  font: ${font.b2};
  margin-top: 8px;
`;

const Container = styled.div`
  width: 480px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  gap: 24px;
  > p {
    font: ${font.l2};
    color: ${color.zinc[500]};
  }
`;

const LogoWrapper = styled.div`
  align-items: center;
  gap: 12px;
  display: flex;
  font: ${font.b1};
  color: ${color.zinc[500]};
`;

const SigninContainer = styled.div`
  width: 100%;
  padding: 24px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  > p {
    font: ${font.t1};
    color: ${color.black};
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const LoginButton = styled.button`
  cursor: pointer;
  width: 100%;
  padding: 14px;
  background-color: ${color.orange[500]};
  color: ${color.white};
  font: ${font.b1};
  border: none;
  border-radius: 8px;
  :hover {
    background-color: ${color.orange[400]};
  }
  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
