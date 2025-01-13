import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { CheckBox } from './CheckBox';

interface IArticleItemType {
  isHeader?: boolean;
  title1?: string;
  title2?: string;
  onChange?: () => void;
  checked?: boolean;
  id?: string;
}

export const ArticleItem = ({
  isHeader = false,
  title1,
  title2,
  onChange,
  checked,
  id,
}: IArticleItemType) => {
  return (
    <TableContent isHeader={isHeader}>
      <ContentContainer>
        <CheckBox id={id} onChange={onChange} checked={checked} />
        <TitleContainer>
          <Title1 isHeader={isHeader}>{title1}</Title1>
          <Title2 isHeader={isHeader}>{title2}</Title2>
        </TitleContainer>
      </ContentContainer>
    </TableContent>
  );
};

const Title1 = styled.div<{ isHeader: boolean }>`
  font: ${({ isHeader }) => (isHeader ? font.b1 : font.b2)};
  color: ${color.black};
  width: 580px;
`;

const Title2 = styled(Title1)`
  width: 120px;
`;

const TableContent = styled.div<{ isHeader: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  background-color: ${({ isHeader }) =>
    isHeader ? color.zinc[50] : 'transparent'};
  border-bottom: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : 'transparent')};
  border-top: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : 'transparent')};
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 24px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
`;
