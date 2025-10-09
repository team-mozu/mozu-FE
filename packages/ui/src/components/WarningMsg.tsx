import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Warning } from "../assets";

interface IWarningMsgType {
  message: string;
}

export const WarningMsg = ({ message }: IWarningMsgType) => {
  return (
    <MsgContainer>
      <Warning />
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
