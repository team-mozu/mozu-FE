import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
// import { Checkbox } from './Checkbox';

interface IItemType {
  isHeader?: boolean;
  title1?: string;
  title2?: string;
}

export const Item = ({ isHeader, title1, title2 }: IItemType) => {
  return (
    <TableContent isHeader={isHeader}>
      <ContentContainer>
        <Checkbox />
        <TitleContainer>
          <Title isHeader={isHeader}>{title1}</Title>
          <Title isHeader={isHeader}>{title2}</Title>
        </TitleContainer>
      </ContentContainer>
    </TableContent>
  );
};

const Title = styled.div<{ isHeader: boolean }>`
  font: ${({ isHeader }) => (isHeader ? font.b1 : font.b2)};
  color: ${color.black};
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
  gap: 64px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
`;
