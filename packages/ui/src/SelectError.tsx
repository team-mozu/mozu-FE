import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Info } from "./assets";

interface IProp {
  isStock: boolean;
}

export const SelectError = ({ isStock }: IProp) => {
  return (
    <Container>
      <IconContainer>
        <Info
          size={32}
          color={color.orange[500]}
        />
      </IconContainer>
      <TitleText>선택 필요</TitleText>
      <SubText>
        관리하고자 하는 {isStock ? "종목을" : "기사를"} 선택하거나, {isStock ? "종목을" : "기사를"} 추가해 주세요.
      </SubText>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
`;

const TitleText = styled.p`
  font: ${font.h4};
  color: ${color.zinc[800]};
`;

const SubText = styled.p`
  width: 250px;
  font: ${font.b2};
  color: ${color.zinc[600]};
  white-space: normal;
  overflow-wrap: break-word;
  word-break: keep-all;
  text-align: center;
`;
