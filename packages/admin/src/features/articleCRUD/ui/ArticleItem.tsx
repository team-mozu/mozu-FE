import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { CheckBox } from "@mozu/ui";

// 데스크탑 반응형 브레이크포인트
const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

interface IArticleItemType {
  isHeader?: boolean;
  title1?: string;
  title2?: string;
  onChange?: () => void;
  checked?: boolean;
  id?: string;
  onClick?: () => void;
}

export const ArticleItem = ({ isHeader = false, title1, title2, onChange, checked, id }: IArticleItemType) => {
  return (
    <TableContent onClick={!isHeader ? onChange : undefined} isHeader={isHeader}>
      <CheckBoxContainer>
        <CheckBox
          id={id}
          onChange={onChange}
          checked={checked}
        />
      </CheckBoxContainer>
      <Title1 isHeader={isHeader}>{title1}</Title1>
      <Title2 isHeader={isHeader}>{title2}</Title2>
    </TableContent>
  );
};

const CheckBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title1 = styled.div<{
  isHeader: boolean;
}>`
  font: ${({ isHeader }) => (isHeader ? font.b2 : font.b2)};
  color: ${color.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const Title2 = styled.div<{
  isHeader: boolean;
}>`
  font: ${({ isHeader }) => (isHeader ? font.b2 : font.b2)};
  color: ${color.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const TableContent = styled.div<{
  isHeader: boolean;
}>`
  width: 100%;
  height: 48px;
  display: grid;
  grid-template-columns: 48px 1fr 180px;
  gap: 16px;
  padding: 0 32px;
  align-items: center;
  background-color: ${({ isHeader }) => (isHeader ? color.zinc[50] : "transparent")};
  border-bottom: 1px solid ${color.zinc[100]};

  ${({ isHeader }) =>
    !isHeader &&
    `
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${color.zinc[50]};
    }
  `}
`;
