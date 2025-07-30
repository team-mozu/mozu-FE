import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Del, Edit } from "@mozu/ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetArticleDetail } from "@/apis";
import { FullPageLoader } from "@/components";
import { Skeleton } from "../../../../design-token/src/theme/Skeleton";
import { ArticleMainData } from "./ArticleMainData";
import { ArticleMainDataSkeleton } from "./ArticleMainDataSkeleton";

interface IArticleManagementDetailProps {
  onClick?: () => void;
}

export const ArticleManagementDetail = ({ onClick }: IArticleManagementDetailProps) => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();
  const articleId = id ? parseInt(id, 10) : null;

  const [datas, setDatas] = useState<{
    title: string;
    description: string;
    image: string | null | undefined;
    createDate: string;
  }>({
    title: "",
    description: "",
    image: null,
    createDate: "",
  });

  const { data: articleData, isLoading: apiLoading } = useGetArticleDetail(articleId);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!apiLoading && articleData) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [
    apiLoading,
    articleData,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    setIsLoading(true);
  }, [
    articleId,
  ]);

  useEffect(() => {
    if (articleData) {
      setDatas({
        title: articleData.title || "",
        description: articleData.description || "",
        image:
          articleData.image === "https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/기사 기본 이미지.svg"
            ? null
            : articleData.image,
        createDate: articleData.createDate || "",
      });
    }
  }, [
    articleData,
  ]);

  if (apiLoading) {
    return <FullPageLoader />;
  }
  return (
    <Container>
      <UpperContainer>
        {isLoading ? <DateDiv>등록일자 | {datas.createDate}</DateDiv> : <p>등록일자 | {datas.createDate}</p>}
        <div>
          <div onClick={onClick}>
            <Button
              backgroundColor={color.zinc[50]}
              color={color.zinc[800]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[100]}
              onClick={onClick}>
              삭제하기
              <Del
                size={20}
                color={color.zinc[800]}
              />
            </Button>
          </div>
          <Button
            backgroundColor={color.orange[50]}
            color={color.orange[500]}
            borderColor={color.orange[200]}
            hoverBackgroundColor={color.orange[100]}
            onClick={() => navigate(`/article-management/${articleId}/edit`)}>
            수정하기
            <Edit
              size={20}
              color={color.orange[500]}
            />
          </Button>
        </div>
      </UpperContainer>
      <MainArticle>
        {isLoading ? (
          <ArticleContainer>
            <ArticleMainDataSkeleton
              title={datas.title}
              main={datas.description}
            />
          </ArticleContainer>
        ) : (
          <ArticleContainer>
            <ArticleMainData
              img={datas.image}
              title={datas.title}
              main={datas.description}
            />
          </ArticleContainer>
        )}
      </MainArticle>
    </Container>
  );
};

const DateDiv = styled(Skeleton)`
  color: transparent;
  width: fit-content;
`;

const Container = styled.div`
  padding: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UpperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > p {
    color: ${color.zinc[600]};
    font: ${font.t4};
  }
  > div {
    display: flex;
    gap: 12px;
  }
`;

const MainArticle = styled.div`
  width: 100%;
  height: calc(100% - 40px);

  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 1rem;
  display: flex;
  justify-content: center;
`;

const ArticleContainer = styled.div`
  width: 644px;
  padding: 32px;
  overflow-y: auto;
`;
