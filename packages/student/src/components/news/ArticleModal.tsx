import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewsDetail } from "./NewsDetail";

// 데스크탑 반응형 브레이크포인트
const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

// 기사 데이터 타입
interface Article {
  articleId?: number;
  title?: string;
  description?: string;
  image?: string;
}

interface ArticleModalProps {
  article: Article;
  total: number;
  current: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ArticleModal({ article, total, current, onPrev, onNext, onClose, isFirst, isLast }: ArticleModalProps) {
  const MAX_CONTENT_LENGTH = 300;
  const navigate = useNavigate();
  const description = article.description || "";
  const isTruncated = description.length > MAX_CONTENT_LENGTH;
  const truncatedDescription = isTruncated ? `${description.substring(0, MAX_CONTENT_LENGTH)}...` : description;

  // 스켈레톤 UI 상태 관리 - 최초 로드시에만 표시
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // 모달이 처음 열릴 때만 스켈레톤 UI 표시
  useEffect(() => {
    if (isFirstLoad) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsFirstLoad(false);
      }, 1500); // 1.5초간 스켈레톤 UI 표시

      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  const handleViewFullArticle = useCallback(() => {
    if (article.articleId) {
      navigate(`news/${article.articleId}`);
    }
  }, [article.articleId, navigate]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (!isFirst) onPrev();
          break;
        case "ArrowRight":
          if (!isLast) onNext();
          break;
        case "Enter":
          if (event.shiftKey && isTruncated) {
            handleViewFullArticle();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, isFirst, isLast, isTruncated, handleViewFullArticle]);

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        tabIndex={-1}
      >
        {isLoading ? (
          <ArticleSkeleton />
        ) : (
          <>
            <NewsDetail
              img={article.image || ""}
              title={article.title || ""}
              main={truncatedDescription}
            />

            {isTruncated && (
              <ViewFullArticleButton onClick={handleViewFullArticle}>해당 기사 보러가기</ViewFullArticleButton>
            )}
          </>
        )}

        <StepperWrapper>
          {Array.from({
            length: total,
          }).map((_, idx) => (
            <StepCircle
              key={idx}
              active={idx === current}
            />
          ))}
        </StepperWrapper>

        <ModalButtonRow>
          <ModalButton
            onClick={onPrev}
            disabled={isFirst}>
            이전
          </ModalButton>
          {!isLast ? (
            <ModalButton onClick={onNext}>다음</ModalButton>
          ) : (
            <ModalButton onClick={onClose}>마침</ModalButton>
          )}
        </ModalButtonRow>
      </ModalContainer>
    </ModalBackdrop>
  );
}

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: ${color.white};
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 40px 32px 32px 32px;
  width: 90vw;
  max-width: 800px;
  min-width: 400px;
  max-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    width: 85vw;
    max-width: 600px;
    padding: 32px 24px 24px 24px;
    max-height: 85vh;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    width: 88vw;
    max-width: 700px;
    padding: 36px 28px 28px 28px;
  }

  /* 깔끔한 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${color.zinc[50]};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${color.zinc[300]};
    border-radius: 3px;
    transition: all 0.2s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${color.zinc[400]};
    transform: scale(1.05);
  }
  
  /* Firefox 스크롤바 */
  scrollbar-width: thin;
  scrollbar-color: ${color.zinc[300]} ${color.zinc[50]};
`;

const ViewFullArticleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  margin-top: 16px;
  border: 1px solid ${color.blue[300]};
  border-radius: 8px;
  background: ${color.blue[50]};
  color: ${color.blue[600]};
  font: ${font.b2};
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  width: 100%;
  max-width: 280px;
  
  &:hover {
    background: ${color.blue[100]};
    border-color: ${color.blue[400]};
    color: ${color.blue[700]};
  }
  
  &:active {
    transform: translateY(1px);
  }

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    padding: 10px 20px;
    font-size: 14px;
    max-width: 240px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    padding: 11px 22px;
    max-width: 260px;
  }
`;

const ModalButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
  width: 100%;
  max-width: 400px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    gap: 12px;
    margin-top: 24px;
    max-width: 300px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    gap: 14px;
    margin-top: 28px;
    max-width: 350px;
  }
`;

const ModalButton = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  font: ${font.b1};
  background: ${color.zinc[100]};
  color: ${color.zinc[800]};
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;
  min-width: 120px;
  max-width: 180px;
  
  &:hover:not(:disabled) {
    background: ${color.zinc[200]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    padding: 10px 24px;
    font-size: 14px;
    min-width: 100px;
    max-width: 140px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    padding: 11px 28px;
    min-width: 110px;
    max-width: 160px;
  }
`;

const StepperWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
  max-width: 100%;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    gap: 6px;
    margin-top: 20px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    gap: 7px;
    margin-top: 22px;
  }
`;

const StepCircle = styled.div<{
  active: boolean;
}>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ active }) => (active ? color.blue[500] : color.zinc[200])};
  border: 2px solid ${({ active }) => (active ? color.blue[500] : color.zinc[200])};
  transition: background 0.2s, border 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    width: 12px;
    height: 12px;
    border-width: 1.5px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    width: 13px;
    height: 13px;
  }
`;

// 스켈레톤 UI 컴포넌트
const ArticleSkeleton = () => (
  <SkeletonContainer>
    <SkeletonImage />
    <SkeletonContent>
      <SkeletonTitle />
      <SkeletonText />
      <SkeletonText width="80%" />
      <SkeletonText width="60%" />
    </SkeletonContent>
  </SkeletonContainer>
);

// 스켈레톤 애니메이션
const skeletonPulse = `
  @keyframes skeleton-pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
`;

const SkeletonContainer = styled.div`
  ${skeletonPulse}
  display: flex;
  gap: 24px;
  flex-direction: column;
  width: 100%;
  max-width: 580px;
  min-width: 300px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    gap: 20px;
    max-width: 480px;
    min-width: 280px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    gap: 22px;
    max-width: 530px;
  }
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 320px;
  background: linear-gradient(90deg, ${color.zinc[200]} 25%, ${color.zinc[100]} 50%, ${color.zinc[200]} 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 16px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    height: 260px;
    border-radius: 12px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    height: 290px;
    border-radius: 14px;
  }
`;

const SkeletonContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SkeletonTitle = styled.div`
  width: 100%;
  height: 24px;
  background: linear-gradient(90deg, ${color.zinc[200]} 25%, ${color.zinc[100]} 50%, ${color.zinc[200]} 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 4px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    height: 20px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    height: 22px;
  }
`;

const SkeletonText = styled.div<{ width?: string }>`
  width: ${({ width }) => width || "100%"};
  height: 16px;
  background: linear-gradient(90deg, ${color.zinc[200]} 25%, ${color.zinc[100]} 50%, ${color.zinc[200]} 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 4px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    height: 14px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    height: 15px;
  }
`;
