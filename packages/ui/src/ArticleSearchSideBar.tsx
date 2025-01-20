import { AddButton, SearchInput, ArticleDiv } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useNavigate } from 'react-router-dom';

export const ArticleSearchSideBar = () => {
  const navigate = useNavigate();
  return (
    <SideBarContainer>
      <UpperWrapper>
        <p>
          전체 <span>4</span>
        </p>
        <SearchInput inputText="기사 검색.." />
      </UpperWrapper>
      <ArticleWrapper>
        <ArticleDiv />
        <ArticleDiv />
        <ArticleDiv />
        <ArticleDiv />
        <ArticleDiv />
      </ArticleWrapper>
      <AddButton text="기사 추가하기" onClick={() => navigate('add')} />
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  min-width: 520px;
  height: 100%;
  background-color: ${color.white};
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
  border-bottom: 1px solid ${color.zinc[200]};
  p > span {
    color: ${color.orange[600]};
  }
`;

const ArticleWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;
