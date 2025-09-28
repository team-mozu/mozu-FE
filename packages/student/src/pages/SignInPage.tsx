import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Input, LogoWithText } from "@mozu/ui";
import { useEffect, useState } from "react";
import { useStudentLogin } from "@/apis";
import type { StudentLoginProps } from "@/apis/login/type";
import { useForm } from "@/hook";

export const SignInPage = () => {
  const { state, onChangeInputValue } = useForm<StudentLoginProps>({
    lessonNum: null,
    schoolName: "",
    teamName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate: studentLogin, isPending } = useStudentLogin();

  // 뒤로가기 방지 useEffect
  useEffect(() => {
    // 히스토리가 초기화되었는지 확인
    const isHistoryCleared = sessionStorage.getItem("historyCleared");

    if (isHistoryCleared) {
      // 히스토리 초기화 플래그 제거
      sessionStorage.removeItem("historyCleared");

      // 현재 페이지를 히스토리의 첫 번째 엔트리로 만들기
      window.history.replaceState(null, "", "/signin");
    }

    // 뒤로가기 방지 함수
    const preventBackNavigation = (e: PopStateEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 현재 페이지를 다시 푸시하여 뒤로가기 방지
      window.history.pushState(null, "", "/signin");

      // 선택적: 사용자에게 알림 (필요에 따라 주석 해제)
      // alert("이전 페이지로 돌아갈 수 없습니다.");
    };

    // 페이지 로드 시 히스토리 엔트리 추가
    window.history.pushState(null, "", "/signin");

    // popstate 이벤트 리스너 추가
    window.addEventListener("popstate", preventBackNavigation);

    // 페이지 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("popstate", preventBackNavigation);
    };
  }, []);

  /**
   * 입력값이 모두 유효하고 로그인 중이 아닐 때 true를 반환
   * @return {boolean}
   */
  const isValidForm = () =>
    state.lessonNum !== null && state.schoolName.trim() !== "" && state.teamName.trim() !== "" && !isPending;

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidForm()) return;
    studentLogin(state, {
      onError: () => setErrorMessage("형식을 다시 확인해주세요."),
    });
  };

  const handleChange = (field: "lessonNum" | "schoolName" | "teamName") => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = e.target.value;
    if (field === "lessonNum") {
      value = value.replace(/\D/g, "").slice(0, 7);
    }
    onChangeInputValue({
      target: {
        name: field,
        value,
      },
    });
    setErrorMessage("");
  };

  if (isPending) return;

  return (
    <Container>
      <LogoWrapper>
        <LogoWithText
          width={74}
          height={28}
        />
        모의주식투자
      </LogoWrapper>
      <SigninContainer onSubmit={handleLogin}>
        <Title>학생 로그인</Title>
        <FormGroup>
          <Input
            placeholder="참가 코드를 입력해 주세요.."
            label="참가 코드"
            value={state.lessonNum ?? ""}
            name="classNum"
            onChange={handleChange("lessonNum")}
            required={true}
          />
          <Input
            label="학교"
            placeholder="학교 이름을 입력해 주세요.."
            value={state.schoolName}
            name="schoolName"
            onChange={handleChange("schoolName")}
            required={true}
          />
          <Input
            label="팀명"
            placeholder="팀 이름을 입력해 주세요.."
            value={state.teamName}
            name="teamName"
            onChange={handleChange("teamName")}
            required={true}
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </FormGroup>
        <LoginButton
          type="submit"
          disabled={!isValidForm() || isPending}>
          로그인
        </LoginButton>
      </SigninContainer>
      <FooterText>© 대덕소프트웨어마이스터고등학교</FooterText>
    </Container>
  );
};

const Container = styled.div`
  width: 480px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font: ${font.b1};
  color: ${color.zinc[500]};
`;

const SigninContainer = styled.form`
  width: 100%;
  padding: 24px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.p`
  font: ${font.t1};
  color: ${color.black};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${color.red[500]};
  font: ${font.b2};
  margin-top: 8px;
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

const FooterText = styled.p`
  font: ${font.l2};
  color: ${color.zinc[500]};
`;
