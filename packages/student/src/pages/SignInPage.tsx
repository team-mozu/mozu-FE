import React, { useState } from 'react';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, Input, LogoWithText } from '@mozu/ui';

export const SignInPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Container>
      <LogoWrapper>
        <LogoWithText width={74} height={28} />
        모의주식투자
      </LogoWrapper>
      <SigninContainer>
        <p>관리자 로그인</p>
        <div>
          <Input
            placeholder={'기관 코드를 입력해 주세요..'}
            label={'기관 코드'}
          />

          <Input
            type={passwordVisible ? 'text' : 'password'}
            placeholder={'비밀번호를 입력해 주세요..'}
            label={'비밀번호'}
          />
        </div>
        <LoginButton>로그인</LoginButton>
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
  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: ${color.orange[500]};
  color: ${color.white};
  font: ${font.b1};
  border: none;
  border-radius: 8px;
`;
