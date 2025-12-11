import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { SvgIcon } from "./SvgIcon";

interface IWarningMsgType {
  message: string;
}

export const WarningMsg = ({ message }: IWarningMsgType) => {
  return (
    <MsgContainer>
      <SvgIcon name="info" size={20} color={color.orange[600]} />
      <Msg>{message}</Msg>
    </MsgContainer>
  );
};

const MsgContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Msg = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};
`;
