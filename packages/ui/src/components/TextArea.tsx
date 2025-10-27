import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { forwardRef } from "react";

interface ITextAreaType {
  placeholder: string;
  label?: string;
  height?: number;
  disabled?: boolean;
  value?: string;
  name?: string;
  state?: "default" | "error";
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, ITextAreaType>(
  (
    {
      placeholder,
      label,
      disabled,
      height,
      value,
      onChange,
      name,
      state = "default",
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) => {
    return (
      <TextAreaContainer>
        <Label>{label}</Label>
        <TextAreaContent
          ref={ref}
          value={value}
          placeholder={placeholder}
          height={height}
          name={name}
          state={state}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}></TextAreaContent>
      </TextAreaContainer>
    );
  },
);

TextArea.displayName = "TextArea";

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

const TextAreaContent = styled.textarea<Pick<ITextAreaType, "height" | "state">>`
  width: 100%;
  height: ${({ height }) => height}px;
  padding: 14px 16px;
  font: ${font.b2};
  border: 1px solid ${({ state }) => (state === "error" ? color.red[500] : color.zinc[200])};
  background-color: ${({ state }) => (state === "error" ? color.red[50] : color.zinc[50])};
  border-radius: 8px;
  resize: none;
  font-family: 'Pretendard', sans-serif;
  ::placeholder {
    color: ${color.zinc[500]};
    font: ${font.b2};
  }
  :focus {
    outline: 1px solid ${({ state }) => (state === "error" ? color.red[500] : color.orange[300])};
  }
  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: ${color.zinc[50]};
  }
`;
