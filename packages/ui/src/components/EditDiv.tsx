import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

interface IEditType {
  title?: string;
  value1?: string;
  value2?: string;
  type1?:
    | "startImg"
    | "delImg"
    | "editImg"
    | "plusImg"
    | "saveImg"
    | "cancelImg"
    | "logOutImg"
    | "articleImg"
    | "classImg";
  type2?:
    | "startImg"
    | "delImg"
    | "editImg"
    | "plusImg"
    | "saveImg"
    | "cancelImg"
    | "logOutImg"
    | "articleImg"
    | "classImg";
  iconSize1?: number;
  iconSize2?: number;
  iconColor1?: string;
  iconColor2?: string;
  isIcon1?: boolean;
  isIcon2?: boolean;
  onClick?: () => void;
}

export const EditDiv = ({
  title,
  value1,
  value2,
  type1,
  type2,
  iconSize1,
  iconSize2,
  iconColor1,
  iconColor2,
  isIcon1,
  isIcon2,
  onClick,
}: IEditType) => {
  const navigate = useNavigate();
  return (
    <EditContainer>
      <Title>{title}</Title>
      <BtnContainer>
        <Button
          backgroundColor={color.zinc[50]}
          color={color.zinc[800]}
          borderColor={color.zinc[200]}
          type={type1}
          iconSize={iconSize1}
          iconColor={iconColor1}
          isIcon={isIcon1}
          onClick={() => navigate(-1)}
          hoverBackgroundColor={color.zinc[100]}>
          {value1}
        </Button>
        <Button
          backgroundColor={color.orange[500]}
          color={color.white}
          borderColor={color.orange[500]}
          type={type2}
          iconSize={iconSize2}
          iconColor={iconColor2}
          isIcon={isIcon2}
          hoverBackgroundColor={color.orange[600]}
          onClick={onClick}>
          {value2}
        </Button>
      </BtnContainer>
    </EditContainer>
  );
};

const EditContainer = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: space-between;
  padding: 12px 12px 12px 24px;
  align-items: center;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
`;

const Title = styled.div`
  font: ${font.t1};
  color: ${color.black};
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 12px;
`;
