import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import type { InputHTMLAttributes } from "react";
import { Check } from "../assets";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

export const CheckBox = ({ checked, id, ...rest }: IProps) => {
  return (
    <CheckboxLabel htmlFor={id}>
      <HiddenInput
        type="checkbox"
        id={id}
        checked={checked}
        {...rest}
      />
      <StyledCheckbox checked={checked}>{checked && <Check />}</StyledCheckbox>
    </CheckboxLabel>
  );
};

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  line-height: 0;
`;

const HiddenInput = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<{
  checked?: boolean;
}>`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  border-radius: 4px;
  line-height: 0;
  transition: background-color 150ms, border-color 150ms;

  background-color: ${p => (p.checked ? color.orange[500] : color.white)};
  border: 1px solid ${p => (p.checked ? color.orange[500] : color.zinc[500])};

  & > svg { display: block; }

  input[type="checkbox"]:focus + & {
    box-shadow: 0 0 0 3px ${color.orange[200]};
  }
`;
