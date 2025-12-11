import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { SvgIcon } from "./SvgIcon";

export const ExitBtn = () => {
  return (
    <Btn>
      <SvgIcon name="arrow-left" color={color.zinc[800]}></SvgIcon>
    </Btn>
  );
};

const Btn = styled.button`
  cursor: pointer;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    background-color: ${color.zinc[100]};
  }
`;
