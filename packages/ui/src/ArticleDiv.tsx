import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useLocation } from 'react-router-dom';

export const ArticleDiv = () => {
  const location = useLocation();

  return (
    <ArticleDivContiner>
      <ArticleTitle>목표가 떨어지며 새해 시작한 삼성전자</ArticleTitle>
      <Date>2024-12-12</Date>
    </ArticleDivContiner>
  );
};

const ArticleDivContiner = styled.div`
  width: 100%;
  padding: 11px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  ${location.pathname === '/f' &&
  `
    background-color: ${color.orange[50]};
  `}
  &:hover {
    background-color: ${color.zinc[100]};
  }
`;

const ArticleTitle = styled.p`
  max-width: 398px;
  font: ${font.b2};
  color: ${color.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${location.pathname === '/f' &&
  `
    color: ${color.orange[600]};
  `}
`;

const Date = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
  ${location.pathname === '/f' &&
  `
    color: ${color.orange[600]};
  `}
`;
