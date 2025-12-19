import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { Button, PageTitle } from "@mozu/ui";

interface ClassManagementTitleBarProps {
  title: string;
  subTitle: string;
  buttonText: string;
  buttonClick: () => void;
}

export const ClassManagementTitleBar = ({ title, subTitle, buttonText, buttonClick }: ClassManagementTitleBarProps) => {
  return (
    <TitleContainer>
      <PageTitle
        mainTitle={title}
        subTitle={subTitle}
      />
      <Button
        type="plusImg"
        backgroundColor={color.orange[500]}
        color={color.white}
        isIcon
        iconSize={24}
        iconColor={color.white}
        onClick={buttonClick}
        hoverBackgroundColor={color.orange[600]}>
        {buttonText}
      </Button>
    </TitleContainer>
  )
}

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;