import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import mozuQR from "@mozu/ui/assets/common/mozuQR.png";
import { useTeamRank } from "@/apis";

export const EndingPage = () => {
  const { data: rankings, isLoading } = useTeamRank();

  const sortedRankings = [
    ...(rankings ?? []),
  ].sort((a, b) => b.totalMoney - a.totalMoney);

  const myTeamRank = sortedRankings.findIndex(team => team.isMyTeam) + 1;
  const myTeam = sortedRankings.find(team => team.isMyTeam);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>🎊</LoadingSpinner>
        <LoadingText>결과를 준비하고 있어요...</LoadingText>
      </LoadingContainer>
    );
  }

  // Get top 3 for podium display
  const topThree = sortedRankings.slice(0, 3);

  return (
    <Container>
      <FloatingElements>
        {Array.from({
          length: 15,
        }).map((_, i) => (
          <FloatingEmoji
            key={i}
            delay={Math.random() * 5}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}>
            {
              [
                "🎉",
                "✨",
                "🌟",
                "🎊",
                "🏆",
              ][Math.floor(Math.random() * 5)]
            }
          </FloatingEmoji>
        ))}
      </FloatingElements>

      <InnerContainer>
        <Header>
          <CelebrationTitle>
            <TitleEmoji>🎉</TitleEmoji>
            <MainTitle>투자 게임 결과</MainTitle>
            <TitleEmoji>🎉</TitleEmoji>
          </CelebrationTitle>
          <Subtitle>여러분 모두 정말 수고하셨어요! 👏</Subtitle>
        </Header>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <PodiumSection>
            <PodiumTitle>🏆 TOP 3 🏆</PodiumTitle>
            <PodiumContainer>
              {topThree.map((team, index) => {
                const rank = index + 1;
                return (
                  <PodiumCard
                    key={team.id}
                    rank={rank}
                    isMyTeam={team.isMyTeam}>
                    <RankBadge rank={rank}>
                      <RankEmoji>{getRankEmoji(rank)}</RankEmoji>
                      <RankNumber>{rank}</RankNumber>
                    </RankBadge>

                    <TeamInfo>
                      <TeamName isMyTeam={team.isMyTeam}>{team.teamName}</TeamName>
                      <SchoolName isMyTeam={team.isMyTeam}>{team.schoolName}</SchoolName>
                      <MoneyAmount isMyTeam={team.isMyTeam}>{formatMoney(team.totalMoney)}</MoneyAmount>
                    </TeamInfo>

                    {team.isMyTeam && <MyTeamBadge>내 팀! 🎯</MyTeamBadge>}
                  </PodiumCard>
                );
              })}
            </PodiumContainer>
          </PodiumSection>
        )}

        {/* My Team Highlight (if not in top 3) */}
        {myTeam && myTeamRank > 3 && (
          <MyTeamSection>
            <MyTeamCard>
              <MyTeamHeader>
                <HeaderEmoji>🎯</HeaderEmoji>
                <HeaderText>우리 팀 결과</HeaderText>
                <HeaderEmoji>🎯</HeaderEmoji>
              </MyTeamHeader>
              <MyRankDisplay>
                <RankNumber>{myTeamRank}위</RankNumber>
                <RankEmoji>{getRankEmoji(myTeamRank)}</RankEmoji>
              </MyRankDisplay>
              <TeamName isMyTeam={true}>{myTeam.teamName}</TeamName>
              <SchoolName isMyTeam={true}>{myTeam.schoolName}</SchoolName>
              <MoneyAmount isMyTeam={true}>{formatMoney(myTeam.totalMoney)}</MoneyAmount>
            </MyTeamCard>
          </MyTeamSection>
        )}

        {/* All Rankings */}
        <RankingSection>
          <SectionTitle>📊 전체 순위 📊</SectionTitle>
          <RankingGrid>
            {sortedRankings.map((team, index) => {
              const rank = index + 1;
              return (
                <RankingCard
                  key={team.id}
                  isMyTeam={team.isMyTeam}
                  rank={rank}>
                  <CardHeader>
                    <RankDisplay rank={rank}>
                      <RankEmoji>{getRankEmoji(rank)}</RankEmoji>
                      <RankText>{rank}위</RankText>
                    </RankDisplay>
                    {team.isMyTeam && <MyTeamTag>우리팀</MyTeamTag>}
                  </CardHeader>

                  <CardContent>
                    <TeamName isMyTeam={team.isMyTeam}>{team.teamName}</TeamName>
                    <SchoolName isMyTeam={team.isMyTeam}>{team.schoolName}</SchoolName>
                    <MoneyAmount isMyTeam={team.isMyTeam}>{formatMoney(team.totalMoney)}</MoneyAmount>
                  </CardContent>
                </RankingCard>
              );
            })}
          </RankingGrid>
        </RankingSection>

        {/* Survey Section */}
        <SurveySection>
          <SurveyCard>
            <SurveyHeader>
              <SurveyEmoji>📝</SurveyEmoji>
              <SurveyTitle>수업 만족도 설문조사</SurveyTitle>
              <SurveyEmoji>📝</SurveyEmoji>
            </SurveyHeader>

            <SurveyContent>
              <SurveyMessage>
                오늘 수업은 어떠셨나요?
                <br />
                여러분의 소중한 의견을 들려주세요! 🎯
              </SurveyMessage>

              <QRContainer>
                <QRImage
                  src={mozuQR}
                  alt="설문조사 QR코드"
                />
                <QRText>
                  QR코드를 스캔하여
                  <br />
                  설문조사에 참여해주세요!
                </QRText>
              </QRContainer>

              <SurveyFooter>
                <SurveyFooterText>설문조사는 익명으로 진행되며, 향후 수업 개선에 활용됩니다 💭</SurveyFooterText>
              </SurveyFooter>
            </SurveyContent>
          </SurveyCard>
        </SurveySection>

        <Footer>
          <FooterContent>
            <FooterTitle>🎊 축하합니다! 🎊</FooterTitle>
            <FooterMessage>모든 팀이 최선을 다해 참여해주셔서 감사합니다!</FooterMessage>
            <FooterEmojis>🌟 ✨ 🎉 ✨ 🌟</FooterEmojis>
          </FooterContent>
        </Footer>
      </InnerContainer>
    </Container>
  );
};

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const slideUp = keyframes`
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Loading
const LoadingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCCBC 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  font-size: 60px;
  animation: ${spin} 2s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #E65100;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

// Container & Layout
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE8CC 30%, #FFDAB9 70%, #FFCCBC 100%);
  position: relative;
  overflow-x: hidden;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
`;

const FloatingElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const FloatingEmoji = styled.div<{
  delay: number;
}>`
  position: absolute;
  font-size: 24px;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.8;
`;

const InnerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
  position: relative;
  z-index: 0;
`;

// Header
const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  animation: ${slideUp} 0.8s ease-out;
`;

const CelebrationTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const TitleEmoji = styled.span`
  font-size: 40px;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const MainTitle = styled.h1`
  font-size: 48px;
  font-weight: 900;
  color: #BF360C;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #D84315;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

// Podium Section
const PodiumSection = styled.div`
  margin-bottom: 48px;
  animation: ${slideUp} 1s ease-out 0.2s both;
`;

const PodiumTitle = styled.h2`
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  color: #BF360C;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.5);
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const PodiumContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const PodiumCard = styled.div<{
  rank: number;
  isMyTeam: boolean;
}>`
  background: ${props =>
    props.isMyTeam
      ? "linear-gradient(135deg, #FF8A50 0%, #FFAB91 100%)"
      : "linear-gradient(135deg, white 0%, #FFF8E1 100%)"};
  border: ${props => (props.isMyTeam ? "2px solid #FF7043" : "2px solid #FFE0B2")};
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  position: relative;
  box-shadow: 
    0 4px 20px rgba(255, 87, 34, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  transform: ${props => (props.rank === 1 ? "scale(1.05)" : "scale(1)")};
  
  &:hover {
    transform: ${props => (props.rank === 1 ? "scale(1.1)" : "scale(1.05)")};
    box-shadow: 0 8px 30px rgba(255, 87, 34, 0.18);
  }
`;

const RankBadge = styled.div<{
  rank: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const RankEmoji = styled.span`
  font-size: 48px;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const RankNumber = styled.span`
  font-size: 32px;
  font-weight: 900;
  color: #E65100;
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TeamName = styled.h3<{
  isMyTeam: boolean;
}>`
  font-size: 24px;
  font-weight: 800;
  color: ${props => (props.isMyTeam ? "white" : "#BF360C")};
  margin: 0;
  text-shadow: ${props => (props.isMyTeam ? "1px 1px 3px rgba(0, 0, 0, 0.2)" : "none")};
`;

const SchoolName = styled.p<{
  isMyTeam?: boolean;
}>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => (props.isMyTeam ? "rgba(255, 255, 255, 0.9)" : "#FF7043")};
  margin: 0;
`;

const MoneyAmount = styled.div<{
  isMyTeam?: boolean;
}>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => (props.isMyTeam ? "white" : "#E65100")};
  text-shadow: ${props => (props.isMyTeam ? "1px 1px 2px rgba(0, 0, 0, 0.2)" : "none")};
`;

const MyTeamBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.25);
  animation: ${pulse} 2s ease-in-out infinite;
`;

// My Team Section (for ranks > 3)
const MyTeamSection = styled.div`
  margin-bottom: 48px;
  animation: ${slideUp} 1s ease-out 0.4s both;
`;

const MyTeamCard = styled.div`
  background: linear-gradient(135deg, #FF8A50 0%, #FFAB91 100%);
  border: 2px solid #FF7043;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 8px 30px rgba(255, 87, 34, 0.2);
  color: white;
`;

const MyTeamHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const HeaderEmoji = styled.span`
  font-size: 24px;
`;

const HeaderText = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const MyRankDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 36px;
  font-weight: 900;
`;

// Rankings Section
const RankingSection = styled.div`
  margin-bottom: 48px;
  animation: ${slideUp} 1s ease-out 0.6s both;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: #BF360C;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.5);
  margin-bottom: 32px;
`;

const RankingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RankingCard = styled.div<{
  isMyTeam: boolean;
  rank: number;
}>`
  background: ${props =>
    props.isMyTeam
      ? "linear-gradient(135deg, #FF8A50 0%, #FFAB91 100%)"
      : "linear-gradient(135deg, white 0%, #FFF8E1 100%)"};
  border: ${props => (props.isMyTeam ? "2px solid #FF7043" : "1px solid #FFE0B2")};
  border-radius: 16px;
  padding: 20px;
  position: relative;
  box-shadow: 0 3px 15px rgba(255, 87, 34, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 25px rgba(255, 87, 34, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const RankDisplay = styled.div<{
  rank: number;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RankText = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #E65100;
`;

const MyTeamTag = styled.div`
  background: #FF5722;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

// Footer
const Footer = styled.div`
  text-align: center;
  animation: ${slideUp} 1s ease-out 0.8s both;
`;

const FooterContent = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 224, 178, 0.5);
  border-radius: 20px;
  padding: 32px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(255, 87, 34, 0.1);
`;

const FooterTitle = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: #BF360C;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const FooterMessage = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #D84315;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const FooterEmojis = styled.div`
  font-size: 24px;
  letter-spacing: 8px;
`;

// Survey Section Styles
const SurveySection = styled.section`
  width: 100%;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  animation: ${slideUp} 0.8s ease-out 0.6s both;
`;

const SurveyCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 248, 235, 0.95), rgba(255, 236, 179, 0.95));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 183, 77, 0.4);
  border-radius: 24px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(255, 87, 34, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 87, 34, 0.2);
  }
  
  @media (max-width: 768px) {
    margin: 0 16px;
    padding: 24px;
  }
`;

const SurveyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const SurveyEmoji = styled.span`
  font-size: 28px;
  animation: ${bounce} 2s infinite;
`;

const SurveyTitle = styled.h3`
  font-size: 28px;
  font-weight: 900;
  color: #BF360C;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SurveyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const SurveyMessage = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #D84315;
  text-align: center;
  line-height: 1.6;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 2px dashed #FF7043;
`;

const QRImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const QRText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #FF7043;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SurveyFooter = styled.div`
  text-align: center;
  margin-top: 8px;
`;

const SurveyFooterText = styled.p`
  font-size: 14px;
  color: #8D6E63;
  margin: 0;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;
