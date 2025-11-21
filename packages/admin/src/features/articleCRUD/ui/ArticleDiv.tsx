import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";

interface IArticleType {
  title: string;
  date: string;
  onClick: () => void | boolean;
  selected: boolean;
  articleNumber: number;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '/').replace(/\s/g, '').slice(0, -1);
};

export const ArticleDiv = ({ title, date, onClick, selected, articleNumber }: IArticleType) => {
  return (
    <ArticleDivContainer
      onClick={onClick}
      selected={selected}>
      <div>
        <ArticleNumber>{articleNumber}</ArticleNumber>
        <ArticleTitle selected={selected}>{title}</ArticleTitle>
      </div>
      <DateDiv selected={selected}>{formatDate(date)}</DateDiv>
    </ArticleDivContainer>
  );
};

const ArticleDivContainer = styled.div<{
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
  max-width: 350px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font: ${font.b2};
  color: ${({ selected }) => (selected ? color.orange[600] : color.black)};

  /* 반응형 조정 */
  @media (max-width: 1440px) {
    max-width: 240px;
  }

  @media (max-width: 1200px) {
    max-width: 200px;
  }

  @media (max-width: 1024px) {
    max-width: 160px;
  }

  @media (max-width: 900px) {
    max-width: 120px;
  }
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
