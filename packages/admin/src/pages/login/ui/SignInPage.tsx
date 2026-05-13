import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Input, SvgIcon, Toast } from "@mozu/ui";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLogin } from "@/entities/organ";
import { isTruthValues } from "@/shared/lib";
import { useForm } from "@/shared/lib/hooks";

export const SignInPage = () => {
  const { state, onChangeInputValue } = useForm({
    code: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const inFlightRef = useRef(false);

  const { mutate: adminLogin, isPending: isAdminLoginLoading } = useAdminLogin();

  const handleLogin = () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    adminLogin(state, {
      onSuccess: () => {
        navigate("/class-management");
      },
      onError: () => {
        setErrorMessage("기관코드 혹은 비밀번호가 잘못되었습니다.");
        Toast("기관코드 혹은 비밀번호를 다시 확인해주세요.", {
          type: "error",
        });
      },
      onSettled: () => {
        inFlightRef.current = false;
      },
    });
  };

  return (
    <Container>
      <LogoWrapper>
        <SvgIcon
          name="logo-with-text"
          size={72}
        />
        모의주식투자
      </LogoWrapper>
      <SigninContainer
        as="form"
        onSubmit={e => {
          e.preventDefault();
          if (
            isAdminLoginLoading ||
            !isTruthValues([
              state.code,
              state.password,
            ])
          )
            return;
          handleLogin();
        }}>
        <p>관리자 로그인</p>
        <Fields>
          <Input
            placeholder="기관 코드를 입력해 주세요.."
            type="text"
            label="기관 코드"
            value={state.code ?? ""}
            name="code"
            autoComplete="username"
            autoFocus
            onChange={e => {
              onChangeInputValue(e);
              setErrorMessage("");
            }}
            required={true}
          />

          <Input
            type="password"
            placeholder="비밀번호를 입력해 주세요.."
            label="비밀번호"
            name="password"
            value={state.password ?? ""}
            autoComplete="current-password"
            onChange={e => {
              onChangeInputValue(e);
              setErrorMessage("");
            }}
            required={true}
          />
          {errorMessage && <ErrorMessage role="alert">{errorMessage}</ErrorMessage>}
        </Fields>
        <LoginButton
          type="submit"
          disabled={
            !isTruthValues([
              state.code,
              state.password,
            ]) || isAdminLoginLoading
          }>
          로그인
        </LoginButton>
      </SigninContainer>
      <p>© 대덕소프트웨어마이스터고등학교</p>
    </Container>
  );
};

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
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${color.orange[500]};
  color: ${color.white};
  font: ${font.b1};
  border: none;
  border-radius: 8px;
  cursor: pointer;

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ErrorMessage = styled.p`
  color: ${color.red[500]};
  font: ${font.b2};
  margin-top: 8px;
`;
