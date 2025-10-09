import styled from "@emotion/styled";
import { color, font, Skeleton } from "@mozu/design-token";
import { Button } from "@mozu/ui";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetArticleDetail } from "@/entities/article";
import { FullPageLoader } from "@/shared/ui";
import { ArticleMainData } from "./ArticleMainData";
import { ArticleMainDataSkeleton } from "./ArticleMainDataSkeleton";

interface IArticleManagementDetailProps {
  onClick?: () => void;
}

export const ArticleManagementDetail = memo(({ onClick }: IArticleManagementDetailProps) => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  //버튼 props 메모이제이션
  const deleteButtonProps = useMemo(
    () => ({
      backgroundColor: color.zinc[50],
      color: color.zinc[800],
      borderColor: color.zinc[200],
      hoverBackgroundColor: color.zinc[100],
      type: "delImg" as const,
      isIcon: true,
      iconSize: 20,
      iconColor: color.zinc[800],
    }),
    [],
  );

  const editButtonProps = useMemo(
    () => ({
      backgroundColor: color.orange[50],
      color: color.orange[500],
      borderColor: color.orange[200],
      hoverBackgroundColor: color.orange[100],
      type: "editImg" as const,
      isIcon: true,
      iconSize: 20,
      iconColor: color.orange[500],
    }),
    [],
  );

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

  const { data: articleData, isLoading: apiLoading } = useGetArticleDetail(id);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!apiLoading && articleData) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    apiLoading,
    articleData,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    setIsLoading(true);
  }, [
    id,
  ]);

  const handleEditClick = useCallback(() => {
    navigate(`/article-management/${id}/edit`);
  }, [
    navigate,
    id,
  ]);

  useEffect(() => {
    if (articleData) {
      setDatas({
        title: articleData.articleName || "",
        description: articleData.articleDesc || "",
        image:
          articleData.articleImg === "https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/기사 기본 이미지.svg"
            ? null
            : articleData.articleImg,
        createDate: articleData.createdAt || "",
      });
    }
  }, [
    articleData,
  ]);

  const dateText = useMemo(
    () => `등록일자 | ${datas.createDate}`,
    [
      datas.createDate,
    ],
  );

  const articleMainDataProps = useMemo(
    () => ({
      img: datas.image,
      title: datas.title,
      main: datas.description,
    }),
    [
      datas.image,
      datas.title,
      datas.description,
    ],
  );

  const articleSkeletonProps = useMemo(
    () => ({
      title: datas.title,
      main: datas.description,
    }),
    [
      datas.title,
      datas.description,
    ],
  );

  if (apiLoading) {
    return <FullPageLoader />;
  }
  return (
    <Container>
      <UpperContainer>
        {isLoading ? <DateDiv>{dateText}</DateDiv> : <p>{dateText}</p>}
        <div>
          <Button
            {...deleteButtonProps}
            onClick={onClick}>
            삭제하기
          </Button>
          <Button
            {...editButtonProps}
            onClick={handleEditClick}>
            수정하기
          </Button>
        </div>
      </UpperContainer>
      <MainArticle>
        {isLoading ? (
          <ArticleContainer>
            <ArticleMainDataSkeleton {...articleSkeletonProps} />
          </ArticleContainer>
        ) : (
          <ArticleContainer>
            <ArticleMainData {...articleMainDataProps} />
          </ArticleContainer>
        )}
      </MainArticle>
    </Container>
  );
});

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
