import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface ITextAreaType {
  placeholder: string;
}

export const TextArea = ({ placeholder }: ITextAreaType) => {
  return <TextAreaContainer placeholder={placeholder}></TextAreaContainer>;
};

const TextAreaContainer = styled.textarea`
  width: 100%;
  height: 100%;
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
