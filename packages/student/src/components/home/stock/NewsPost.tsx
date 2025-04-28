import styled from "@emotion/styled";
import { noImg, noImgIcon } from "@mozu/ui";
import { font, color } from "@mozu/design-token";

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
      <NewsImg
        src={imgUrl}
        alt={title}
        hasImage={!!imgUrl}
        onError={(e) => {
          e.currentTarget.src = noImgIcon;
        }}
      />
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
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
  :hover {
    background-color: ${color.zinc[50]};
    transition: 0.35s ease-in-out;
    transform: translateY(-5px);
  }
  transition: 0.35s ease-in-out;
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
  width: 100%;
`;

const NewsImg = styled.img<{ hasImage: boolean }>`
  width: 160px;
  height: 90px;
  border-radius: 12px;
  border: 1px solid
    ${({ hasImage }) => (hasImage ? "transparent" : color.zinc[200])};

  background-color: ${color.zinc[50]};
`;
