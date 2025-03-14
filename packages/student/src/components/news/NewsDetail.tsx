import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IArticleMainDataType {
  img?: string;
  title?: string;
  main?: string;
}

export const NewsDetail = ({ img, title, main }: IArticleMainDataType) => {
  return (
    <Container>
      <ArticleImg src={img} alt="기사 이미지" />

      <ContentWrapper>
        <ArticleTitle>
          <p>
            {title}
            포스코그룹, 2차전지 소재 사업 확대로 주가 상승세
          </p>
        </ArticleTitle>
        <ArticleMain>
          <p>
            {main}
            포스코그룹이 2차전지 소재 사업 확대에 따른 실적 개선 기대감으로
            주가가 상승세를 보이고 있다. 포스코홀딩스는 전일 대비 3.2% 상승한
            38만 5천원에 거래를 마쳤다.
            <br />
            <br />
            포스코퓨처엠은 양극재 생산능력 확대와 함께 글로벌 전기차
            제조사들과의 공급계약 체결로 시장에서 긍정적인 평가를 받고 있다.
            증권가에서는 포스코그룹의 2차전지 소재 밸류체인 완성에 주목하며
            투자의견 '매수'를 유지하고 있다.
            <br />
            <br />
            한편, 포스코케미칼은 하이니켈 양극재 생산 확대와 함께 미국과 유럽
            시장 진출을 가속화하고 있어 글로벌 경쟁력 강화가 기대된다. 업계
            관계자는 "포스코그룹의 2차전지 소재 사업은 향후 5년간 연평균 30%
            이상의 성장이 예상된다"며 "특히 리튬, 니켈 등 원재료 확보를 위한
            선제적 투자가 실적 개선으로 이어질 것"이라고 전망했다.
            <br />
            <br />
            포스코그룹은 올해 2차전지 소재 사업에 약 1조 5천억원을 투자할
            계획이며, 2030년까지 글로벌 시장점유율 20% 달성을 목표로 하고 있다.
            특히 아르헨티나와 칠레 등 남미 지역의 리튬 광산 투자를 통해 원재료
            수급 안정화에 나서고 있다.
            <br />
            <br />
            증권사들은 포스코그룹의 2차전지 소재 사업 확대에 긍정적인 평가를
            내놓고 있다. 한국투자증권은 포스코홀딩스의 목표주가를 45만원으로
            상향 조정했으며, 미래에셋증권도 "2차전지 소재 사업의 성장성을 고려할
            때 현재 주가는 저평가됐다"며 투자의견 '매수'를 유지했다.
            <br />
            <br />
            포스코퓨처엠의 경우 올해 매출액이 전년 대비 40% 이상 증가할 것으로
            전망되며, 포스코케미칼도 하이니켈 양극재 판매 확대로 20% 이상의 매출
            성장이 예상된다.
            <br />
            <br />
            한편, 포스코그룹은 철강 사업의 경쟁력 강화를 위한 투자도 병행하고
            있다. 친환경 제철 공법인 수소환원제철 기술 개발에 약 1조원을 투자할
            계획이며, 2050년 탄소중립 달성을 목표로 하고 있다.
            <br />
            <br />
            업계 관계자는 "포스코그룹이 전통적인 철강 사업과 함께 2차전지 소재
            사업을 양대 축으로 성장하고 있다"며 "특히 2차전지 소재 사업은 글로벌
            전기차 시장 확대에 따라 장기적인 성장이 기대된다"고 말했다.
          </p>
        </ArticleMain>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
  width: 580px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ArticleImg = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 16px;
  background-color: orange;
  border: 1px solid ${color.zinc[200]};
`;

const ArticleTitle = styled.div`
  color: ${color.black};
  font: ${font.h4};
  width: 70%;
  white-space: normal;
  word-wrap: break-word;
  word-break: keep-all;
`;

const ArticleMain = styled.div`
  p {
    font: ${font.b2};
    color: ${color.zinc[800]};
    font: ${font.b2};
    color: ${color.zinc[800]};
    white-space: pre-wrap; // 줄바꿈 유지
    word-wrap: break-word; // 단어 단위로 줄바꿈
    overflow-wrap: break-word; // 긴 단어 처리
    word-break: keep-all; // 한글 줄바꿈
  }
`;
