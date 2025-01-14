import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface ITextAreaType {
  placeholder: string;
  label?: string;
  height?: number;
}

export const TextArea = ({ placeholder, label, height }: ITextAreaType) => {
  return (
    <TextAreaContainer>
      <Label>{label}</Label>
      <TextAreaContent
        placeholder={placeholder}
        height={height}
      ></TextAreaContent>
    </TextAreaContainer>
  );
};

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

const Label = styled.label`
  font: ${font.b1};
  color: ${color.zinc[800]};
`;

const TextAreaContent = styled.textarea<Pick<ITextAreaType, 'height'>>`
  width: 100%;
  height: ${({ height }) => height}px;
  padding: 14px 16px;
  font: ${font.b2};
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  border-radius: 8px;
  resize: none;
  ::placeholder {
    color: ${color.zinc[500]};
    font: ${font.b2};
  }
  :focus {
    outline: 1px solid ${color.zinc[200]};
  }
`;
