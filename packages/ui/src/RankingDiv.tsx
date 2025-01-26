import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IRankingDivProp {
  rank: number;
  teamName: string;
  schoolName: string;
  price: number;
}

export const RankingDiv = ({
  rank,
  teamName,
  schoolName,
  price,
}: IRankingDivProp) => {
  return (
    <Wrapper rank={rank}>
      <Rank>
        <span>{rank}</span>등
      </Rank>
      <Team>
        <TeamName>{teamName}</TeamName>
        <School>{schoolName}</School>
      </Team>
      <Price>
        <span>{price}</span>원
      </Price>
    </Wrapper>
  );
};

// rank에 따라 border 색상을 변경
const Wrapper = styled.div<{ rank: number }>`
  width: 100%;
  height: 86px;
  padding: 20px;
  display: flex;
  gap: 8px;
  background-color: ${color.white};
  border-radius: 4px;
  align-items: center;
  border: 2px solid
    ${({ rank }) => {
      switch (rank) {
        case 1:
          return color.orange[500]; // 1등: 빨간색
        case 2:
          return color.orange[200]; // 2등: 주황색
        default:
          return color.zinc[100]; // 기타 등수: 기본 회색
      }
    }};
`;

const Rank = styled.p`
  font: ${font.t3};
  color: ${color.zinc[800]};
  min-width: 48px;
`;

const Team = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 326px;
`;

const TeamName = styled.p`
  font: ${font.t3};
  color: ${color.zinc[800]};
`;

const School = styled.p`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;

const Price = styled.p`
  font: ${font.t1};
  color: ${color.zinc[800]};
`;
