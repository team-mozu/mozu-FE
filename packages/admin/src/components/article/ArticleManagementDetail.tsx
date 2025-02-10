import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { ArticleMainData } from './ArticleMainData';
import { Button, Del, Edit } from '@mozu/ui';
import { useNavigate } from 'react-router';

interface IArticleManagementDetailProps {
  onClick?: () => void; // onClick을 옵션으로 추가
}

export const ArticleManagementDetail = ({
  onClick,
}: IArticleManagementDetailProps) => {
  const navigate = useNavigate();
  return (
    <Container>
      <UpperContainer>
        <p>등록일자 | 2024-12-12</p>
        <div>
          <div onClick={onClick}>
            <Button
              backgroundColor={color.zinc[50]}
              color={color.zinc[800]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[100]}
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
            onClick={() => navigate('1/edit')}
          >
            <p>수정하기</p>
            <Edit size={20} color={color.orange[500]} />
          </Button>
        </div>
      </UpperContainer>
      <MainArticle>
        <ArticleContainer>
          {/* <ArticleMainData Img={''} Title={''} Main={''} /> */}
          <ArticleMainData />
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
