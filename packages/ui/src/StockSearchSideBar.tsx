import { AddButton, SearchInput } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { StockDiv } from './StockDiv';

export const StockSearchSideBar = () => {
  return (
    <SideBarContainer>
      <UpperWrapper>
        <p>
          전체 <span>12</span>
        </p>
        <SearchInput inputText="종목 검색.." />
      </UpperWrapper>
      <ArticleWrapper>
        <StockDiv />
        <StockDiv />
        <StockDiv />
        <StockDiv />
        <StockDiv />
      </ArticleWrapper>
      <AddButton text="종목 추가하기" />
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  min-width: 280px;
  height: 100%;
  backgroundcolor: white;
  border-right: 1px solid ${color.zinc[200]};
  display: flex;
  flex-direction: column;
`;

const UpperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font: ${font.b1};
  padding: 12px;
  background-color: ${color.white};
  border-bottom: 1px solid ${color.zinc[200]};
  p > span {
    color: ${color.orange[600]};
  }
`;

const ArticleWrapper = styled.div`
  background-color: ${color.white};
  flex: 1;
  width: 100%;
  overflow-y: auto;
`;
