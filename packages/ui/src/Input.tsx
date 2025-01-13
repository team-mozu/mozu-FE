import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IInputType {
  placeholder: string;
  label: string;
}

export const Input = ({ placeholder, label }: IInputType) => {
  return (
    <InputContainer>
      <Label>{label}</Label>
      <InputContent placeholder={placeholder} />
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

const InputContent = styled.input`
  width: 100%;
  height: 48px;
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  padding-left: 16px;
  width: 100%;
  color: ${color.black};
  font: ${font.b2};
  :focus {
    outline: none;
  }
  ::placeholder {
    color: ${color.zinc[500]};
    font: ${font.b2};
  }
`;
