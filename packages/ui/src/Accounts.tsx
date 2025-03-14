import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IAccountsType {
  title?: string;
  content: number | string;
}

export const Accounts = ({ title, content }: IAccountsType) => {
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
  flex-grow: 1; /* 부모 요소 내에서 동일한 비율로 차지 */
  width: 100%;
  height: 108px;
  border-radius: 12px;
  background-color: ${color.zinc[50]};
  display: flex;
  align-items: center;
  justify-content: space-between; /* 내용 정렬 */
  padding: 24px;
`;

const Content = styled.div`
  font: ${font.h4};
  color: ${color.black};
`;
