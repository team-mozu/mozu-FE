import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Skeleton } from "../../design-token/src/theme/Skeleton";

interface IAccountsType {
  title?: string;
  content: number | string;
}

export const AccountsSkeleton = ({ title, content }: IAccountsType) => {
  const formattedContent =
    typeof content === "number" ? content.toLocaleString("ko-KR") : content;

  return (
    <AccountsContainer>
      <ContentContainer>
        <Title>{title}</Title>
      </ContentContainer>
      <Content>{formattedContent}원</Content>
    </AccountsContainer>
  );
};

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

const Title = styled.div`
  font: ${font.h4};
  color: ${color.zinc[600]};
`;
const AccountsContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 108px;
  border-radius: 12px;
  background-color: ${color.zinc[50]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
`;

const Content = styled(Skeleton)`
  color: transparent;
  margin-left: auto;
  width: fit-content;
`;
