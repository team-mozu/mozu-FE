import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { SvgIcon } from "@mozu/ui";
import { useCallback, useState } from "react";

interface INewsPostType {
  imgUrl?: string;
  title: string;
  content: string;
  onClick?: () => void;
}

export const NewsPost = ({ imgUrl, title, content, onClick }: INewsPostType) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsImageLoading(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [
    onClick,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    },
    [
      onClick,
    ],
  );

  return (
    <PostContainer
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`뉴스 기사: ${title}`}>
      <ImageContainer>
        {isImageLoading && <ImageSkeleton />}
        {imgUrl && !imageError ? (
          <NewsImg
            src={imgUrl}
            alt={title}
            hasImage={true}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          <NoImageContainer>
            <SvgIcon name="no-img-icon" size={40} color="#9CA3AF" />
          </NoImageContainer>
        )}
      </ImageContainer>

      <ContentContainer>
        <Title title={title}>{title}</Title>
        <Content title={content}>{content}</Content>
      </ContentContainer>
    </PostContainer>
  );
};

// 스타일 컴포넌트들
const PostContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${color.zinc[50]};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: ${color.blue[500]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const ImageSkeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 160px;
  height: 90px;
  background: linear-gradient(
    90deg,
    ${color.zinc[200]} 25%,
    ${color.zinc[100]} 50%,
    ${color.zinc[200]} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 12px;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    height: 169px;
  }
`;

const NewsImg = styled.img<{
  hasImage: boolean;
}>`
  width: 160px;
  height: 90px;
  border-radius: 12px;
  border: 1px solid
    ${({ hasImage }) => (hasImage ? "transparent" : color.zinc[200])};
  background-color: ${color.zinc[50]};
  object-fit: cover;
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    height: 169px;
  }
`;

const NoImageContainer = styled.div`
  width: 160px;
  height: 90px;
  border-radius: 12px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    height: 169px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0; /* flexbox에서 텍스트 오버플로우 처리를 위해 필요 */
`;

const Title = styled.h3`
  font: ${font.t1};
  color: ${color.black};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  word-break: break-word;

  @media (max-width: 768px) {
    -webkit-line-clamp: 3;
  }
`;

const Content = styled.p`
  font: ${font.t4};
  color: ${color.zinc[600]};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  word-break: break-word;

  @media (max-width: 768px) {
    -webkit-line-clamp: 3;
  }
`;
