import { useState, KeyboardEvent } from "react";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Input, LogoWithText } from "@mozu/ui";
import { useForm } from "@/hook";
import { useStudentLogin } from "@/apis";
import { StudentLoginProps } from "@/apis/login/type";

export const SignInPage = () => {
  const { state, onChangeInputValue } = useForm<StudentLoginProps>({
    classNum: null,
    schoolName: "",
    teamName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { mutate: studentLogin, isPending } = useStudentLogin();

  /**
   * 입력값이 모두 유효하고 로그인 중이 아닐 때 true를 반환
   * @return {boolean}
   */
  const isValidForm = () =>
    state.classNum !== null &&
    state.schoolName.trim() !== "" &&
    state.teamName.trim() !== "" &&
    !isPending;

  const handleLogin = () => {
    if (!isValidForm()) return;

    studentLogin(state, {
      onError: () => setErrorMessage("형식을 다시 확인해주세요."),
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleChange =
    (field: "classNum" | "schoolName" | "teamName") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value: string | number = e.target.value;

      if (field === "classNum") {
        value = value.replace(/\D/g, "").slice(0, 7);
      }

      onChangeInputValue({ target: { name: field, value } });
      setErrorMessage("");
    };

  return (
    <Container>
      <LogoWrapper>
        <LogoWithText width={74} height={28} />
        모의주식투자
      </LogoWrapper>
      <SigninContainer onKeyDown={handleKeyDown}>
        <Title>학생 로그인</Title>
        <FormGroup>
          <Input
            label="참가 코드"
            placeholder="참가 코드를 입력해 주세요.."
            value={state.classNum ?? ""}
            name="classNum"
            onChange={handleChange("classNum")}
          />
          <Input
            label="학교"
            placeholder="학교 이름을 입력해 주세요.."
            value={state.schoolName}
            name="schoolName"
            onChange={handleChange("schoolName")}
          />
          <Input
            label="팀명"
            placeholder="팀 이름을 입력해 주세요.."
            value={state.teamName}
            name="teamName"
            onChange={handleChange("teamName")}
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </FormGroup>
        <LoginButton onClick={handleLogin} disabled={!isValidForm()}>
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

const SigninContainer = styled.div`
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
