import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IArticleType {
  title: string;
  date: string;
  onClick: () => void | boolean;
  selected: boolean;
}

export const ArticleDiv = ({
  title,
  date,
  onClick,
  selected,
}: IArticleType) => {
  return (
    <ArticleDivContiner onClick={onClick} selected={selected}>
      <ArticleTitle selected={selected}>{title}</ArticleTitle>
      <Date selected={selected}>{date}</Date>
    </ArticleDivContiner>
  );
};

const ArticleDivContiner = styled.div<{ selected: boolean }>`
  width: 100%;
  padding: 11px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background-color: ${({ selected }) =>
    selected ? color.orange[50] : 'transparent'};
  ${({ selected }) =>
    !selected &&
    `
  &:hover {
    background-color: ${color.zinc[100]};
  }
  `}
`;

const ArticleTitle = styled.p<{ selected: boolean }>`
  max-width: 398px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: ${font.b2};
  color: ${({ selected }) => (selected ? color.orange[600] : color.black)};
`;

const Date = styled.p<{ selected: boolean }>`
  font: ${font.l2};
  color: ${({ selected }) => (selected ? color.orange[600] : color.zinc[600])};
`;
