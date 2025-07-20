import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Trophy, Users } from "@mozu/ui";
import { useTeamRank } from "@/apis";

export const EndingPage = () => {
  const { data: rankings, isLoading } = useTeamRank();

  const sortedRankings = [
    ...(rankings ?? []),
  ].sort((a, b) => b.totalMoney - a.totalMoney);

  const myTeamRank = sortedRankings.findIndex(team => team.isMyTeam) + 1;
  const myTeam = sortedRankings.find(team => team.isMyTeam);

  const formatMoney = amount => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = rank => {
    switch (rank) {
      case 1:
        return (
          <Trophy
            size={32}
            color={color.yellow[500]}
          />
        );
      case 2:
        return (
          <Users
            size={32}
            color={color.zinc[400]}
          />
        );
      case 3:
        return (
          <Users
            size={32}
            color={color.orange[500]}
          />
        );
      default:
        return <RankNumber>{rank}</RankNumber>;
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Container>
      <InnerContainer>
        <Header>
          <HeaderIcon>
            <Trophy
              size={48}
              color={color.blue[500]}
            />
          </HeaderIcon>
          <Title>투자 결과</Title>
          <Subtitle>최종 순위가 발표되었습니다</Subtitle>
        </Header>

        {myTeam && (
          <MyTeamSection>
            <MyTeamCard>
              <MyRankContainer>
                {getRankIcon(myTeamRank)}
                <MyRankText>내 순위: {myTeamRank}위</MyRankText>
              </MyRankContainer>
              <MyTeamName>{myTeam.name}</MyTeamName>
              <MySchoolName>{myTeam.schoolName}</MySchoolName>
              <MyTotalMoney>{formatMoney(myTeam.totalMoney)}</MyTotalMoney>
              <MyMoneyLabel>
                <Trophy
                  size={20}
                  color={color.zinc[500]}
                />
                최종 투자 수익
              </MyMoneyLabel>
            </MyTeamCard>
          </MyTeamSection>
        )}

        <RankingSection>
          <RankingHeader>
            <Users
              size={32}
              color={color.zinc[700]}
            />
            <RankingTitle>전체 순위</RankingTitle>
          </RankingHeader>

          <RankingList>
            {sortedRankings.map((team, index) => {
              const rank = index + 1;
              const isMyTeam = team.isMyTeam;

              return (
                <RankingItem
                  key={team.id}
                  isMyTeam={isMyTeam}>
                  {isMyTeam && <MyTeamBadge>내 팀</MyTeamBadge>}

                  <RankingLeft>
                    <RankIconWrapper>{getRankIcon(rank)}</RankIconWrapper>

                    <div>
                      <TeamName>{team.name}</TeamName>
                      <SchoolName>{team.schoolName}</SchoolName>
                    </div>
                  </RankingLeft>

                  <RankingRight>
                    <TotalMoney>{formatMoney(team.totalMoney)}</TotalMoney>
                    <RankText>{rank === 1 ? "🏆 1등" : `${rank}위`}</RankText>
                  </RankingRight>
                </RankingItem>
              );
            })}
          </RankingList>
        </RankingSection>

        <Footer>
          <FooterText>수고하셨습니다! 🎉</FooterText>
          <FooterSubtext>모든 참가자들의 노력에 박수를 보냅니다</FooterSubtext>
        </Footer>
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: ${color.white};
  padding: 32px 16px;
`;

const InnerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  ${font.h1}
  color: ${color.zinc[900]};
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  ${font.t3}
  color: ${color.zinc[500]};
`;

const MyTeamSection = styled.div`
  max-width: 600px;
  margin: 0 auto 60px;
`;

const MyTeamCard = styled.div`
  background-color: ${color.blue[50]};
  border: 2px solid ${color.blue[200]};
  border-radius: 16px;
  padding: 40px;
  text-align: center;
`;

const MyRankContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const MyRankText = styled.span`
  ${font.h3}
  color: ${color.zinc[900]};
  margin-left: 16px;
`;

const MyTeamName = styled.h2`
  ${font.h4}
  color: ${color.zinc[900]};
  margin-bottom: 8px;
`;

const MySchoolName = styled.p`
  ${font.t4}
  color: ${color.zinc[500]};
  margin-bottom: 20px;
`;

const MyTotalMoney = styled.div`
  ${font.h2}
  color: ${color.blue[600]};
  margin-bottom: 16px;
`;

const MyMoneyLabel = styled.div`
  ${font.b2}
  color: ${color.zinc[500]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RankingSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const RankingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const RankingTitle = styled.h2`
  ${font.h3}
  color: ${color.zinc[900]};
  margin-left: 12px;
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RankingItem = styled.div<{
  isMyTeam: boolean;
}>`
  background-color: ${props => (props.isMyTeam ? color.blue[50] : color.zinc[50])};
  border: 1px solid ${props => (props.isMyTeam ? color.blue[200] : color.zinc[200])};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: between;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MyTeamBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${color.blue[500]};
  color: ${color.white};
  padding: 4px 12px;
  border-radius: 0 12px 0 12px;
  ${font.l1}
`;

const RankingLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const RankingRight = styled.div`
  text-align: right;
  margin-left: auto;
`;

const TeamName = styled.h3`
  ${font.t2}
  color: ${color.zinc[900]};
  margin-bottom: 4px;
`;

const SchoolName = styled.p`
  ${font.b2}
  color: ${color.zinc[500]};
`;

const TotalMoney = styled.div`
  ${font.t1}
  color: ${color.zinc[900]};
  margin-bottom: 4px;
`;

const RankText = styled.div`
  ${font.l2}
  color: ${color.zinc[500]};
`;

const RankIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
`;

const RankNumber = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${color.zinc[200]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${font.b1}
  color: ${color.zinc[700]};
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 80px;
`;

const FooterText = styled.p`
  ${font.t3}
  color: ${color.zinc[600]};
  margin-bottom: 8px;
`;

const FooterSubtext = styled.p`
  ${font.b2}
  color: ${color.zinc[400]};
`;
