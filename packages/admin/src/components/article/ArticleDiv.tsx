import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useLocation } from 'react-router-dom';

interface IArticleType {
  title: string,
  date: string,
  onClick: () => void,
}

export const ArticleDiv = ({title, date, onClick}: IArticleType) => {
  const location = useLocation();

  return (
    <ArticleDivContiner onClick={onClick}>
      <ArticleTitle>
        {title}
      </ArticleTitle>
      <Date>{date}</Date>
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
