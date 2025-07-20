import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IAccountsType {
  title?: string;
  content: number | string;
}

export const Accounts = ({ title, content }: IAccountsType) => {
  const formattedContent = typeof content === 'number'
    ? content.toLocaleString('ko-KR')
    : content;

  return (
    <AccountsContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <Content>{formattedContent}원</Content>
      </ContentContainer>
    </AccountsContainer>
  );
};

// 스타일 컴포넌트들
const AccountsContainer = styled.div`
  width: 100%;
  min-height: 108px;
  border-radius: 12px;
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[100]};
  display: flex;
  align-items: center;
  padding: 24px;
  transition: all 0.2s ease;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font: ${font.h4};
  color: ${color.zinc[600]};
  white-space: nowrap;
`;

const Content = styled.div`
  font: ${font.h4};
  color: ${color.black};
  white-space: nowrap;
  font-weight: 600;
`;