import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IRankingDivProp {
  rank: number;
  teamName: string;
  schoolName: string;
  price: number;
  isOurTeam?: boolean;
}

export const RankingDiv = ({
  rank,
  teamName,
  schoolName,
  price,
  isOurTeam = false,
}: IRankingDivProp) => {
  return (
    <Wrapper rank={rank} isOurTeam={isOurTeam}>
      <Rank>
        <span>{rank}</span>등
      </Rank>
      <Team>
        <TeamNameContainer>
          <TeamName>{teamName}</TeamName>
          {isOurTeam && <OurTeamBadge>우리팀</OurTeamBadge>}
        </TeamNameContainer>
        <School>{schoolName}</School>
      </Team>
      <Price>
        <span>{price.toLocaleString()}</span>원
      </Price>
    </Wrapper>
  );
};

// RankingDiv 컴포넌트 스타일
const Wrapper = styled.div<{ rank: number; isOurTeam: boolean }>`
  width: 100%;
  padding: 16px 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  border-radius: 8px;
  background-color: ${({ isOurTeam }) => isOurTeam ? color.orange[50] : color.white};
  border: 2px solid ${({ isOurTeam }) => isOurTeam ? color.orange[300] : color.zinc[100]};
  box-sizing: border-box;
  flex-wrap: wrap;
`;

const Rank = styled.p`
  font: ${font.t3};
  color: ${color.zinc[800]};
  flex: 0 0 60px;
  text-align: left;
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-width: 150px;
`;

const TeamNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TeamName = styled.p`
  font: ${font.t3};
  color: ${color.zinc[800]};
  word-break: keep-all;
`;

const OurTeamBadge = styled.span`
  padding: 2px 8px;
  background-color: ${color.orange[100]};
  color: ${color.orange[700]};
  font: ${font.l1};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const School = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
  word-break: keep-all;
`;

const Price = styled.p`
  font: ${font.t1};
  color: ${color.zinc[800]};
  flex: 0 0 auto;
  white-space: nowrap;
  text-align: right;
  > span {
    display: inline-block;
    min-width: 80px;
  }
`;