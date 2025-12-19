import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTeamStore } from "@/app";
import { useGetCurrent } from "@/entities/monitoring";
import { TeamInvestStatusTable } from "@/shared/ui";

interface DegDealContent {
  id: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  orderCount: number;
  totalMoney: number;
  orderType: "BUY" | "SELL";
  invCount: number;
}

interface DegData {
  degNumber: number;
  teamName: string;
  deals: DegDealContent[];
}

interface IDegCurrentType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id: string;
}

export const DegCurrentModal = ({ isOpen, setIsOpen, id }: IDegCurrentType) => {
  const { data: degData, isLoading, isFetching } = useGetCurrent(id ?? "");
  const { teamInfoMap } = useTeamStore();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const degDataList: DegData[] = [];

  if (degData && degData.length > 0) {
    const grouped: Record<number, DegDealContent[]> = {};

    degData.forEach(deal => {
      if (!grouped[deal.invCount]) grouped[deal.invCount] = [];
      grouped[deal.invCount].push(deal);
    });

    const sortedDegNumbers = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    for (const degNumber of sortedDegNumbers) {
      degDataList.push({
        degNumber,
        teamName: teamInfoMap[id]?.teamName || "",
        deals: grouped[degNumber],
      });
    }
  }

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [
    setIsOpen,
  ]);

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (backgroundRef.current === e.target) {
        setIsOpen(false);
      }
    },
    [
      setIsOpen,
    ],
  );

  const handleTabClick = useCallback((index: number) => {
    setActiveTabIndex(index);
  }, []);

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

  useEffect(() => {
    if (isOpen && (degData?.length ?? 0) > 0) {
      setActiveTabIndex(0);
    }
  }, [
    isOpen,
    degData?.length,
  ]);

  const currentDegData = degDataList[activeTabIndex];
  const currentDeals = currentDegData?.deals || [];

  return (
    isOpen && (
      <BackgroundContainer
        ref={backgroundRef}
        onClick={handleBackgroundClick}>
        <ModalContainer>
          <ContentContainer>
            <TitleContainer>
              <TitleSection>
                <Title>
                  {currentDegData
                    ? `${currentDegData.degNumber}차 '${currentDegData.teamName}' 거래 내역`
                    : "거래 내역"}
                </Title>
                <Subtitle>차수별 투자 포트폴리오</Subtitle>
              </TitleSection>
              <CloseButton onClick={handleClose}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </CloseButton>
            </TitleContainer>

            {/* 로딩 중일 때 스켈레톤 탭 */}
            {(isLoading || isFetching) && (
              <TabContainer>
                <TabSkeleton>
                  <SkeletonBox width="20px" height="18px" />
                  <SkeletonBox width="14px" height="14px" />
                </TabSkeleton>
                <TabSkeleton>
                  <SkeletonBox width="20px" height="18px" />
                  <SkeletonBox width="14px" height="14px" />
                </TabSkeleton>
                <TabSkeleton>
                  <SkeletonBox width="20px" height="18px" />
                  <SkeletonBox width="14px" height="14px" />
                </TabSkeleton>
              </TabContainer>
            )}

            {/* 데이터가 있을 때 실제 탭 */}
            {!isLoading && !isFetching && degDataList.length > 0 && (
              <TabContainer>
                {degDataList.map((degData, index) => (
                  <TabButton
                    key={degData.degNumber}
                    isActive={index === activeTabIndex}
                    onClick={() => handleTabClick(index)}>
                    <TabNumber>{degData.degNumber}</TabNumber>
                    <TabLabel>차</TabLabel>
                    {index === activeTabIndex && <ActiveIndicator />}
                  </TabButton>
                ))}
              </TabContainer>
            )}

            <TableContainer>
              {/* 로딩 중일 때 스켈레톤 테이블 */}
              {(isLoading || isFetching) ? (
                <TableSkeleton>
                  {/* 테이블 헤더 스켈레톤 */}
                  <TableSkeletonHeader>
                    <SkeletonBox width="80px" height="20px" />
                    <SkeletonBox width="120px" height="20px" />
                    <SkeletonBox width="100px" height="20px" />
                    <SkeletonBox width="80px" height="20px" />
                    <SkeletonBox width="100px" height="20px" />
                    <SkeletonBox width="90px" height="20px" />
                  </TableSkeletonHeader>

                  {/* 테이블 로우 스켈레톤 */}
                  {Array.from({ length: 8 }).map((_, index) => (
                    <TableSkeletonRow key={index}>
                      <SkeletonBox width="60px" height="16px" />
                      <SkeletonBox width="100px" height="16px" />
                      <SkeletonBox width="80px" height="16px" />
                      <SkeletonBox width="60px" height="16px" />
                      <SkeletonBox width="90px" height="16px" />
                      <SkeletonBox width="70px" height="16px" />
                    </TableSkeletonRow>
                  ))}
                </TableSkeleton>
              ) : degDataList.length > 0 ? (
                <TeamInvestStatusTable contents={currentDeals} />
              ) : (
                <NoDataContainer>
                  <NoDataIcon>📊</NoDataIcon>
                  <NoDataTitle>거래 내역이 없습니다</NoDataTitle>
                  <NoDataDescription>아직 투자 거래가 진행되지 않았습니다.</NoDataDescription>
                </NoDataContainer>
              )}
            </TableContainer>

            <FooterContainer>
              {(isLoading || isFetching) ? (
                <FooterStats>
                  <StatItem>
                    <StatLabel>총 거래 건수</StatLabel>
                    <SkeletonBox width="40px" height="20px" />
                  </StatItem>
                  <StatDivider />
                  <StatItem>
                    <StatLabel>차수</StatLabel>
                    <SkeletonBox width="30px" height="20px" />
                  </StatItem>
                  <StatDivider />
                  <StatItem>
                    <StatLabel>현재 시각</StatLabel>
                    <SkeletonBox width="60px" height="20px" />
                  </StatItem>
                </FooterStats>
              ) : (
                <FooterStats>
                  <StatItem>
                    <StatLabel>총 거래 건수</StatLabel>
                    <StatValue>{currentDeals.length}건</StatValue>
                  </StatItem>
                  <StatDivider />
                  <StatItem>
                    <StatLabel>차수</StatLabel>
                    <StatValue>{currentDegData?.degNumber || 0}차</StatValue>
                  </StatItem>
                  <StatDivider />
                  <StatItem>
                    <StatLabel>현재 시각</StatLabel>
                    <StatValue>
                      {new Date().toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </StatValue>
                  </StatItem>
                </FooterStats>
              )}

              <FooterActions>
                <ActionButton
                  variant="secondary"
                  onClick={handleClose}>
                  닫기
                </ActionButton>
              </FooterActions>
            </FooterContainer>
          </ContentContainer>
        </ModalContainer>
      </BackgroundContainer>
    )
  );
};

const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 1080px;
  max-height: 90vh;
  border-radius: 24px;
  background: ${color.white};
  box-shadow: 
    0 32px 64px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  animation: modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  }
  
  @keyframes modalSlideIn {
    from { 
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    to { 
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  padding: 32px 32px 24px;
  border-bottom: 1px solid ${color.zinc[100]};
  background: linear-gradient(135deg, ${color.white} 0%, ${color.zinc[50]} 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font: ${font.t2};
  color: ${color.zinc[900]};
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  font: ${font.b2};
  color: ${color.zinc[500]};
  margin: 0;
  font-weight: 400;
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${color.zinc[600]};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.95);
    color: ${color.zinc[900]};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// ArticleInfoModal에서 가져온 탭 관련 스타일
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

const TableContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 24px 28px;
  background: ${color.zinc[50]};
  position: relative;
  
  > div {
    max-height: 100%;
    overflow-y: auto;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${color.zinc[100]};
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${color.zinc[300]};
      border-radius: 4px;
      
      &:hover {
        background: ${color.zinc[400]};
      }
    }
  }
`;

const FooterContainer = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${color.zinc[100]};
  background: ${color.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

const FooterStats = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  font: ${font.b2};
  color: ${color.zinc[500]};
  font-weight: 500;
`;

const StatValue = styled.span`
  font: ${font.b2};
  color: ${color.zinc[900]};
  font-weight: 600;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${color.zinc[200]};
`;

const FooterActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{
  variant: "primary" | "secondary";
}>`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.01em;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  position: relative;
  
  ${({ variant }) =>
    variant === "secondary" &&
    `
    background: ${color.zinc[50]};
    color: ${color.zinc[700]};
    border: 1px solid ${color.zinc[200]};
    
    &:hover {
      background: ${color.zinc[100]};
      border-color: ${color.zinc[300]};
      color: ${color.zinc[900]};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

// 스켈레톤 컴포넌트들
const TabSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 24px;
  background: ${color.zinc[50]};
  border-radius: 12px 12px 0 0;
  min-width: 80px;
  justify-content: center;
`;

const TableSkeleton = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${color.white};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const TableSkeletonHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr 1fr 1.5fr 1.2fr;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  background: ${color.zinc[50]};
  border-radius: 12px;
  border-bottom: 2px solid ${color.zinc[100]};
`;

const TableSkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr 1fr 1.5fr 1.2fr;
  gap: 16px;
  align-items: center;
  padding: 12px 20px;
  background: ${color.white};
  border-bottom: 1px solid ${color.zinc[100]};

  &:last-child {
    border-bottom: none;
  }
`;

// NoData 컴포넌트들
const NoDataContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: ${color.white};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 48px 24px;
`;

const NoDataIcon = styled.div`
  font-size: 48px;
  margin-bottom: 8px;
  opacity: 0.6;
`;

const NoDataTitle = styled.h3`
  font: ${font.t3};
  color: ${color.zinc[700]};
  margin: 0;
  font-weight: 600;
`;

const NoDataDescription = styled.p`
  font: ${font.b2};
  color: ${color.zinc[500]};
  margin: 0;
  text-align: center;
  line-height: 1.5;
`;

// 커스텀 스켈레톤 컴포넌트
const SkeletonBox = styled.div<{ width: string; height: string }>`
  width: ${props => props.width};
  height: ${props => props.height};
  background-color: ${color.zinc[100]};
  position: relative;
  overflow: hidden;
  border-radius: 6px;

  @keyframes skeleton-shimmer {
    0% {
      background-color: ${color.zinc[100]};
    }
    50% {
      background-color: ${color.zinc[200]};
    }
    100% {
      background-color: ${color.zinc[100]};
    }
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: skeleton-shimmer 1.5s infinite ease-in-out;
  }
`;
