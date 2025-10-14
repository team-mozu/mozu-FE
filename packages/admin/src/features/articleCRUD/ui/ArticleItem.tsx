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
      <ContentContainer>
        <CheckBox
          id={id}
          onChange={onChange}
          checked={checked}
        />
        <TitleContainer>
          <Title1 isHeader={isHeader}>{title1}</Title1>
          <Title2 isHeader={isHeader}>{title2}</Title2>
        </TitleContainer>
      </ContentContainer>
    </TableContent>
  );
};

const Title1 = styled.div<{
  isHeader: boolean;
}>`
  font: ${({ isHeader }) => (isHeader ? font.b1 : font.b2)};
  color: ${color.black};
  width: 100%;
  max-width: 560px;
  min-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    max-width: 400px;
    min-width: 150px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    max-width: 480px;
  }
`;

const Title2 = styled(Title1)`
  width: 120px;
  max-width: 120px;
  min-width: 80px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    width: 100px;
    max-width: 100px;
    min-width: 60px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    width: 110px;
    max-width: 110px;
  }
`;

const TableContent = styled.div<{
  isHeader: boolean;
}>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 46px;
  background-color: ${({ isHeader }) => (isHeader ? color.zinc[50] : "transparent")};
  border-bottom: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : "transparent")};
  border-top: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : "transparent")};

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

const TitleContainer = styled.div`
  display: flex;
  gap: 24px;
  cursor: pointer;
  flex: 1;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
`;
