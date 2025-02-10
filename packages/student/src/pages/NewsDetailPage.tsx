import { color } from '@mozu/design-token';
import styled from '@emotion/styled';
import { NewsDetail } from '@/components';
import { ExitBtn } from '@mozu/ui';
import { useNavigate } from 'react-router-dom';

export const NewsDetailPage = () => {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <Wrapper>
        <Container>
          <ArticleDiv>
            <NewsDetail />
          </ArticleDiv>
        </Container>
        <BtnWrapper onClick={() => navigate(-1)}>
          <ExitBtn />
        </BtnWrapper>
      </Wrapper>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled.div`
  padding: 40px;
  display: flex;
  width: 100%;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 1rem;
  height: calc(100vh - 144px);
  display: flex;
  overflow-y: auto;
`;

const ArticleDiv = styled.div`
  padding: 32px;
  height: 100%;
`;

const BtnWrapper = styled.div`
  position: absolute;
  transform: translate(24px, 24px);
  z-index: 100;
`;
