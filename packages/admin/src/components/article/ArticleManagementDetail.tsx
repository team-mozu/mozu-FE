import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { ArticleMainData } from './ArticleMainData';
import { Button, Del, Edit } from '@mozu/ui';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { articleManagementDetail } from '../../apis/article/index';

interface IArticleManagementDetailProps {
  onClick?: () => void; // onClick을 옵션으로 추가
}

export const ArticleManagementDetail = ({
  onClick,
}: IArticleManagementDetailProps) => {
  const navigate = useNavigate();
  const {id} = useParams();
  const articleId = id? parseInt(id) : null;

  const [datas, setDatas] = useState<{title: string, description: string, image: File, createDate: string}>({title: '', description: '', image: '', createDate: ''})

  const {data: articleData, isLoading} = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => articleManagementDetail(articleId),
    enabled: !!articleId,
  })

  useEffect(() => {
    if(articleData?.data) {
      setDatas({
        title: articleData.data.title || '',
        description: articleData.data.description || '',
        image: articleData.data.image === "https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/내 로고.png" ? null : articleData.data.image,
      });
    }
  }, [articleData])

  return (
    <Container>
      <UpperContainer>
        <p>등록일자 | {datas.createDate}</p>
        <div>
          <div onClick={onClick}>
            <Button
              backgroundColor={color.zinc[50]}
              color={color.zinc[800]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[100]}
              onClick={onClick}
            >
              <p>삭제하기</p>
              <Del size={20} color={color.zinc[800]} />
            </Button>
          </div>
          <Button
            backgroundColor={color.orange[50]}
            color={color.orange[500]}
            borderColor={color.orange[200]}
            hoverBackgroundColor={color.orange[100]}
            onClick={() => navigate(`/article-management/${articleId}/edit`)}
          >
            수정하기
            <Edit size={20} color={color.orange[500]} />
          </Button>
        </div>
      </UpperContainer>
      <MainArticle>
        <ArticleContainer>
          <ArticleMainData img={datas.image} title={datas.title} main={datas.description} />
        </ArticleContainer>
      </MainArticle>
    </Container>
  );
};

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
