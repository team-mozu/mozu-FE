import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, SvgIcon } from "@mozu/ui";
import { useEffect, useRef, useState } from "react";
import { useGetArticleDetail } from "@/entities/article";

interface LessonArticle {
  articleId: string;
  title: string;
}

interface ClassArticle {
  investmentRound: number;
  articles: LessonArticle[];
}

interface IArticleInfoType {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  lessonArticles: ClassArticle[];
}

export const ArticleInfoModal = ({ isOpen, setIsOpen, lessonArticles }: IArticleInfoType) => {
  const [datas, setDatas] = useState<
    {
      isClicked: boolean;
      articleContent: LessonArticle[];
      investmentRound: number;
    }[]
  >([]);

  // 기사 상세 보기 상태 추가
  const [selectedArticle, setSelectedArticle] = useState<LessonArticle | null>(null);
  const [isDetailView, setIsDetailView] = useState<boolean>(false);

  const { data: articleDetailData } = useGetArticleDetail(selectedArticle?.articleId);

  const outSideRef = useRef<HTMLDivElement | null>(null);
  const outSideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (outSideRef.current === e.target && setIsOpen) {
      setIsOpen(false);
    }
  };

  const cancelClick = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const barClick = (index: number) => {
    setDatas(prev =>
      prev
        ? prev.map((data, idx) =>
          idx === index
            ? {
              ...data,
              isClicked: true,
            }
            : {
              ...data,
              isClicked: false,
            },
        )
        : [],
    );
    // 탭 변경시 상세 보기 해제
    setIsDetailView(false);
    setSelectedArticle(null);
  };

  // 기사 클릭 핸들러
  const handleArticleClick = (article: LessonArticle) => {
    setSelectedArticle(article);
    setIsDetailView(true);
  };

  // 뒤로가기 핸들러
  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedArticle(null);
  };

  useEffect(() => {
    if (lessonArticles && lessonArticles.length > 0) {
      // investmentRound 순으로 정렬
      const sortedArticles = [
        ...lessonArticles,
      ].sort((a, b) => a.investmentRound - b.investmentRound);

      const formatted = sortedArticles.map((item, index) => ({
        isClicked: index === 0,
        articleContent: item.articles,
        investmentRound: item.investmentRound,
      }));
      setDatas(formatted);
    }
  }, [
    lessonArticles,
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [
    isOpen,
  ]);

  // 모달이 닫힐 때 상세 보기 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setIsDetailView(false);
      setSelectedArticle(null);
    }
  }, [
    isOpen,
  ]);

  const selectedData = datas.find(data => data.isClicked);

  return (
    isOpen && (
      <BackgroundContainer
        onClick={outSideClick}
        ref={outSideRef}>
        <ModalContainer>
          <Header>
            <IconWrapper>
              <SvgIcon
                name="article-icon"
                size={28}
                color={color.zinc[800]}
              />
            </IconWrapper>
            <TitleSection>
              <Title>{isDetailView ? selectedArticle?.title : "기사 정보"}</Title>
              <Subtitle>{isDetailView ? "기사 내용을 확인하세요" : "차수별 기사 목록을 확인하세요"}</Subtitle>
            </TitleSection>
            {isDetailView && <BackButton onClick={handleBackToList}>← 목록으로</BackButton>}
          </Header>

          {!isDetailView && (
            <TabContainer>
              {datas.map((data, index) => (
                <TabButton
                  isActive={data.isClicked}
                  onClick={() => barClick(index)}
                  // biome-ignore lint/suspicious/noArrayIndexKey: <임시>
                  key={index}>
                  <TabNumber>{data.investmentRound}</TabNumber>
                  <TabLabel>차</TabLabel>
                  {data.isClicked && <ActiveIndicator />}
                </TabButton>
              ))}
            </TabContainer>
          )}

          <ContentWrapper>
            {isDetailView ? (
              // 기사 상세 보기
              <ArticleDetailContainer>
                <ArticleDetailContent>
                  {articleDetailData?.articleDesc || "기사 내용을 불러오는 중입니다..."}
                </ArticleDetailContent>
              </ArticleDetailContainer>
            ) : (
              // 기사 목록 보기
              <ArticleContainer>
                {selectedData?.articleContent.length ? (
                  selectedData.articleContent.map((content, idx) => (
                    <ArticleItem
                      key={content.articleId}
                      onClick={() => handleArticleClick(content)}>
                      <ArticleNumber>{idx + 1}</ArticleNumber>
                      <ArticleTitle>{content.title}</ArticleTitle>
                      <ClickIndicator className="click-indicator">클릭하여 보기 →</ClickIndicator>
                    </ArticleItem>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyIcon>📝</EmptyIcon>
                    <EmptyText>해당 차수에 등록된 기사가 없습니다</EmptyText>
                  </EmptyState>
                )}
              </ArticleContainer>
            )}
          </ContentWrapper>

          <FooterContainer>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              color={color.zinc[800]}
              onClick={cancelClick}
              hoverBackgroundColor={color.zinc[100]}>
              닫기
            </Button>
          </FooterContainer>
        </ModalContainer>
      </BackgroundContainer>
    )
  );
};

const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  width: 900px;
  max-width: 90vw;
  height: 600px;
  max-height: 90vh;
  border-radius: 24px;
  background: linear-gradient(135deg, ${color.white} 0%, ${color.zinc[50]} 100%);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid ${color.zinc[200]};
  position: relative;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, ${color.orange[100]} 0%, ${color.orange[50]} 100%);
  border: 2px solid ${color.orange[200]};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  flex-shrink: 0;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const Title = styled.h2`
  font: ${font.h2};
  color: ${color.zinc[900]};
  margin: 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font: ${font.b2};
  color: ${color.zinc[600]};
  margin: 0;
`;

const BackButton = styled.button`
  background: ${color.orange[50]};
  color: ${color.orange[600]};
  border: 1px solid ${color.orange[200]};
  border-radius: 12px;
  padding: 8px 16px;
  font: ${font.b2};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${color.orange[100]};
    border-color: ${color.orange[300]};
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${color.zinc[100]};
  background: ${color.white};
  padding: 0 32px;
  gap: 8px;
`;

const TabButton = styled.button<{
  isActive: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 24px;
  background: ${({ isActive }) => (isActive ? color.orange[50] : "transparent")};
  color: ${({ isActive }) => (isActive ? color.orange[600] : color.zinc[600])};
  border: none;
  border-radius: 12px 12px 0 0;
  font: ${font.b2};
  font-weight: ${({ isActive }) => (isActive ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  outline: none;
  min-width: 80px;
  justify-content: center;
  
  &:hover {
    background: ${({ isActive }) => (isActive ? color.orange[100] : color.zinc[50])};
    color: ${({ isActive }) => (isActive ? color.orange[700] : color.zinc[700])};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const TabNumber = styled.span`
  font-weight: 700;
  font-size: 18px;
`;

const TabLabel = styled.span`
  font-size: 14px;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background: linear-gradient(90deg, ${color.orange[500]} 0%, ${color.orange[400]} 100%);
  border-radius: 2px 2px 0 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ArticleContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${color.zinc[100]};
    border-radius: 4px;
    margin: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${color.zinc[300]};
    border-radius: 4px;
    
    &:hover {
      background: ${color.zinc[400]};
    }
  }
`;

const ArticleItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border-color: ${color.orange[300]};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover .click-indicator {
    opacity: 1;
  }
`;

const ArticleNumber = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${color.orange[500]} 0%, ${color.orange[400]} 100%);
  color: ${color.white};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font: ${font.b2};
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
`;

const ArticleTitle = styled.div`
  font: ${font.t3};
  line-height: 1.8;
  color: ${color.zinc[800]};
  word-break: keep-all;
  flex: 1;
`;

const ClickIndicator = styled.div`
  font: ${font.b2};
  color: ${color.orange[500]};
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const ArticleDetailContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${color.zinc[100]};
    border-radius: 4px;
    margin: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${color.zinc[300]};
    border-radius: 4px;
    
    &:hover {
      background: ${color.zinc[400]};
    }
  }
`;

const ArticleDetailContent = styled.div`
  background: ${color.white};
  border-radius: 16px;
  padding: 32px;
  border: 1px solid ${color.zinc[200]};
  font: ${font.b1};
  line-height: 1.8;
  color: ${color.zinc[800]};
  white-space: pre-wrap;
  word-break: keep-all;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font: ${font.b2};
  color: ${color.zinc[500]};
  margin: 0;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 32px 32px 32px;
  border-top: 1px solid ${color.zinc[200]};
  background: ${color.white};
`;
