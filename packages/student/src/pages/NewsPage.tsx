import { useGetArticleList } from "@/apis";
import { NewsPost } from "@/components";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useNavigate } from "react-router-dom";

export const NewsPage = () => {
  const navigate = useNavigate();
  const { data: articleData, isLoading } = useGetArticleList();
  if (isLoading) return <div>로딩 중...</div>;
  if (!articleData[0]) return <div>데이터가 없습니다.</div>;

  return (
    <div
    // style={{
    //   width: '100%',
    //   display: 'flex',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // }}
    >
      <Wrapper>
        <Container>
          <Label>전체 뉴스</Label>
          <NewsContainer>
            {articleData.map((data) => {
              return (
                <NewsPost
                  imgUrl={data?.image ?? ""}
                  title={data?.title ?? ""}
                  content={data?.description ?? ""}
                  key={data?.articleId ?? 0}
                  onClick={() => navigate(`${data.articleId}`)}
                />
              );
            })}
          </NewsContainer>
        </Container>
      </Wrapper>
    </div>
  );
};

const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

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
  padding: 40px;
  display: flex;
`;

const Label = styled.label`
  font: ${font.t2};
  color: ${color.black};
`;
