import React, { useState } from 'react';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Eye, EyeOff } from './assets';

interface IInputType {
  placeholder: string;
  label?: string;
  type?: string;
  width?: string;
  text?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  placeholder,
  label,
  type,
  width,
  text,
  value,
  onChange,
}: IInputType) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const inputType = type === 'password' && passwordVisible ? 'text' : type;

  return (
    <InputContainer>
      <Label>{label}</Label>
      <InputWrapper>
        <InputContent
          type={inputType}
          placeholder={placeholder}
          width={width}
          value={value}
          onChange={onChange}
        />
        {type === 'password' && (
          <PasswordToggle onClick={togglePasswordVisibility}>
            {passwordVisible ? (
              <Eye size={24} color={color.black} />
            ) : (
              <EyeOff size={24} color={color.black} />
            )}
          </PasswordToggle>
        )}
        {text && <Text>{text}</Text>} {/* 텍스트가 있으면 오른쪽에 표시 */}
      </InputWrapper>
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

const Label = styled.label`
  font: ${font.b1};
  color: ${color.zinc[800]};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
`;

const InputContent = styled.input<{ width?: string }>`
  width: ${(props) => props.width || '100%'};
  height: 48px;
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  padding-left: 16px;
  padding-right: 40px; /* 아이콘 공간 확보 */
  color: ${color.black};
  font: ${font.b2};
  :focus {
    font: ${font.b2};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${color.zinc[500]};
  &:hover {
    color: ${color.zinc[700]};
  }
`;

const Text = styled.span`
  font: ${font.t4};
  color: ${color.black};
  margin-left: 8px;
`;
