import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button } from "@mozu/ui";

interface EmptyStateProps {
  title: string;
  subTitle: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title,
  subTitle,
  buttonText,
  onButtonClick,
  icon
}: EmptyStateProps) => {
  return (
    <EmptyStateContainer>
      <EmptyStateContent>
        {icon && <IconContainer>{icon}</IconContainer>}
        <EmptyStateText>{title}</EmptyStateText>
        <EmptyStateSubText>{subTitle}</EmptyStateSubText>
        <EmptyStateButton
          type="plusImg"
          backgroundColor={color.orange[500]}
          color={color.white}
          isIcon
          iconSize={24}
          iconColor={color.white}
          onClick={onButtonClick}
          hoverBackgroundColor={color.orange[600]}>
          {buttonText}
        </EmptyStateButton>
      </EmptyStateContent>
    </EmptyStateContainer>
  );
}

const EmptyStateContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const EmptyStateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const IconContainer = styled.div`
  margin-bottom: 8px;
`;

const EmptyStateText = styled.div`
  font: ${font.t1};
  color: ${color.zinc[800]};
  text-align: center;
`;

const EmptyStateSubText = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};
  text-align: center;
  margin-bottom: 8px;
`;

const EmptyStateButton = styled(Button)`
  margin-top: 8px;
`;
