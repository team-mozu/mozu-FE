import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface IArticleType {
  title: string;
  date: string;
  onClick: () => void | boolean;
  selected: boolean;
  articleNumber: number;
}

export const ArticleDiv = ({ title, date, onClick, selected, articleNumber }: IArticleType) => {
  return (
    <ArticleDivContiner
      onClick={onClick}
      selected={selected}>
      <div>
        <ArticleNumber>{articleNumber}</ArticleNumber>
        <ArticleTitle selected={selected}>{title}</ArticleTitle>
      </div>
      <DateDiv selected={selected}>{date}</DateDiv>
    </ArticleDivContiner>
  );
};

const ArticleDivContiner = styled.div<{
  selected: boolean;
}>`
  width: 100%;
  padding: 11px 16px;
  display: flex;
  border-bottom: 1px solid #e4e4e7;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  > div {
    display: flex;
    gap: 20px;
  }
  background-color: ${({ selected }) => (selected ? color.orange[50] : "transparent")};
  ${({ selected }) =>
    !selected &&
    `
  &:hover {
    background-color: ${color.zinc[100]};
  }
  `}
`;

const ArticleTitle = styled.p<{
  selected: boolean;
}>`
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: ${font.b2};
  color: ${({ selected }) => (selected ? color.orange[600] : color.black)};
`;

const DateDiv = styled.p<{
  selected: boolean;
}>`
  font: ${font.l2};
  color: ${({ selected }) => (selected ? color.orange[600] : color.zinc[600])};
`;

const ArticleNumber = styled.p`
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #52525b;
`;
