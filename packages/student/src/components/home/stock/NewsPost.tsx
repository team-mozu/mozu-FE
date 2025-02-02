import styled from '@emotion/styled';
import { noImg } from '@mozu/ui';
import { font, color } from '@mozu/design-token';

interface INewsPostType {
  imgUrl?: string;
  title: string;
  content: string;
  onClick?: () => void;
}

export const NewsPost = ({
  imgUrl = noImg,
  title,
  content,
  onClick,
}: INewsPostType) => {
  return (
    <PostContainer onClick={onClick}>
      <NewsImg src={imgUrl} alt={title} hasImage={!!imgUrl} />
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
  width: 100%;
  height: 90px;
  cursor: pointer;
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

const NewsImg = styled.img<{ hasImage: boolean }>`
  width: 160px;
  height: 90px;
  border-radius: 12px;
  border: 1px solid
    ${({ hasImage }) => (hasImage ? 'transparent' : color.zinc[200])};
`;
