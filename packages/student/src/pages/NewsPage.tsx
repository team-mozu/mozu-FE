import { datas, NewsPost } from '@/components';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useNavigate } from 'react-router-dom';

export const NewsPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Wrapper>
        <Container>
          <Label>전체 뉴스</Label>
          {datas.map((data) => {
            return (
              <NewsPost
                title={data.title}
                content={data.content}
                key={data.title}
                onClick={() => navigate('1')}
              />
            );
          })}
        </Container>
      </Wrapper>
    </div>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 32px;
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 24px;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Wrapper = styled.div`
  padding: 40px 0;
  display: flex;
`;

const Label = styled.label`
  font: ${font.t2};
  color: ${color.black};
`;
