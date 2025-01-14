import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IInputType {
  placeholder: string;
  label?: string;
  type?: string;
  width?: string;
  text?: string;
  value?: string;
  onChange?: () => void;
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
  const defaultValue = type === 'Number' ? 0 : undefined;

  return (
    <InputContainer>
      <Label>{label}</Label>
      <InputWrapper>
        <InputContent
          type={type}
          placeholder={placeholder}
          width={width}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
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
    font: ${font.b2};
  }
`;

const Text = styled.span`
  font: ${font.t4};
  color: ${color.black};
  margin-left: 8px;
`;
