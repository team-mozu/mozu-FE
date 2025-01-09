import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

type AccountsType = {
  title?: string;
  content: string;
};

export const Accounts = ({ title, content }: AccountsType) => {
  return (
    <AccountsContainer>
      <ContentContainer>
        <Tilte>{title}</Tilte>
        <Content>{content}</Content>
      </ContentContainer>
    </AccountsContainer>
  );
};
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

const Tilte = styled.div`
  font: ${font.t3};
  color: ${color.zinc[600]};
`;
const AccountsContainer = styled.div`
  width: 596px;
  height: 108px;
  border-radius: 12px;
  background-color: ${color.zinc[50]};
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 24px;
`;

const Content = styled.div`
  font: ${font.h4};
  color: ${color.black};
`;
