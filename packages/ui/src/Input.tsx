import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IInputType {
  placeholder: string;
  label: string;
  type?: string;
  width?: string;
}

export const Input = ({ placeholder, label, type, width }: IInputType) => {
  const defaultValue = type === 'Number' ? 0 : undefined; // type이 number일 경우 0을 기본값으로 설정

  return (
    <InputContainer>
      <Label>{label}</Label>
      <InputContent
        type={type}
        placeholder={placeholder}
        width={width}
        defaultValue={defaultValue}
      />
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

const InputContent = styled.input<{ width?: string }>`
  width: ${(props) => props.width || '100%'};
  height: 48px;
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  padding-left: 16px;
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
