import { RankingDiv } from "../components/RankingDiv";

export default {
  "Default Ranking Div": (
    <RankingDiv
      rank={1}
      teamName="최강팀"
      schoolName="모의고등학교"
      price={1000000000}
    />
  ),
  "Our Team Ranking Div": (
    <RankingDiv
      rank={2}
      teamName="우리팀"
      schoolName="우리학교"
      price={987654321}
      isOurTeam={true}
    />
  ),
  "Lower Rank Ranking Div": (
    <RankingDiv
      rank={10}
      teamName="평범한팀"
      schoolName="일반고등학교"
      price={123456789}
    />
  ),
};
