import styled from '@emotion/styled';
import { noImg } from './assets';
import { font, color } from '@mozu/design-token';

interface INewsPostType {
  imgUrl?: string;
  title: string;
  content: string;
}

export const NewsPost = ({ imgUrl, title, content }: INewsPostType) => {
  return (
    <PostContainer>
      <NewsImg src={imgUrl ? imgUrl : noImg} alt={title} imgUrl={imgUrl} />
      <TitleContainer>
        <Title>{title}</Title>
        <Content>{content}</Content>
      </TitleContainer>
    </PostContainer>
  );
};

const PostContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 1096px;
  height: 90px;
`;

const Title = styled.div`
  font: ${font.t1};
  color: ${color.black};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
`;

const Content = styled.div`
  font: ${font.t4};
  color: ${color.zinc[600]};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: start;
  width: 912px;
`;

const NewsImg = styled.img<Pick<INewsPostType, 'imgUrl'>>`
  width: 160px;
  height: 90px;
  border-radius: 12px;
  border: 1px solid
    ${({ imgUrl }) => (imgUrl ? 'transparent' : color.zinc[200])};
`;
