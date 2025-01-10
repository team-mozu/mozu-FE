import { AddButton, SearchInput, ArticleDiv } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

export const ArticleSearchSideBar = () => {
  return (
    <SideBarContainer>
      <UpperWrapper>
        <p>전체 4</p>
        <SearchInput inputText="기사 검색.." />
      </UpperWrapper>
      <ArticleWrapper>
        <ArticleDiv />
        <ArticleDiv />
        <ArticleDiv />
        <ArticleDiv />
        <ArticleDiv />
      </ArticleWrapper>
      <AddButton text="기사 추가하기" />
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  width: 520px;
  height: 100%;
  backgroundcolor: white;
  border-right: 1px solid ${color.zinc[200]};
`;

const UpperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font: ${font.b1};
  padding: 12px;
  border-bottom: 1px solid ${color.zinc[200]};
`;

const ArticleWrapper = styled.div`
  width: 100%;
`;
