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
      <ArticleImg />
      {/* <ArticleImg src={img} alt="기사 이미지" /> */}

      <ContentWrapper>
        <ArticleTitle>
          <p>
            {title}
            목표가 떨어지며 새해 시작한 삼성전자…52층까지 내려갔다가 반등
          </p>
        </ArticleTitle>
        <ArticleMain>
          <p>
            {main}
            지난달 20일 이후 첫 5만2000원 선 추락 새해 첫 거래일 증권사들의
            <br />
            <br />
            목표가 하향 행진의 중심에 선 삼성전자가 장 중 5만2000원 선까지
            하락했다. 2일 한국거래소에 따르면 이날 삼성전자는 1% 안팎 하락한 채
            <br />
            <br />
            거래되다가 장 마감 30분 전에 반등, 전 거래일 대비 0.38% 상승한
            5만3400원에 거래를 마쳤다. 개장일부터 증권사들은 삼성전자를 향한
            눈높이
            <br />
            <br />
            를 낮추고 있다. 이날 삼성전자 관련 리포트를 낸 미래에셋증권,
            <br />
            <br />
            삼성증권, 대신증권, 한국투자증권 중에서 3개사가 목표가를 내렸다.
            <br />
            <br />
            삼성전자의 지난해 4분기 잠정실적 발표를 앞두고 실적에 대한 우려를
            표하면서 증권사들은 목표가를 하향조정했다. 삼성증권은 8만3000원에서
            <br />
            <br />
            <br />
            7만4000원으로, 대신증권은 8만5000원에서 7만8000원으로,
            한국투자증권은 8만3000원에서 7만7000원으로 내렸다. 신석환 대신증권
            <br />
            <br />
            연구원은 삼성전자의 작년 4분기 매출액을 76조6000억원, 영업이익을
            7조6000억원으로 예상했다. 영업이익 예상치의 경우 시장 컨센서스인
            <br />
            <br />
            8조9000억원을 하회하는 수치다. 신 연구원은 견조한 고대역폭
            <br />
            <br />
            메모리(HBM)/서버향 메모리 수요에도 불구하고 삼성전자의 HBM 양산
            일정이 기대보다 지연됐다며 스마트폰·PC 등 수요 둔화와 <br />
            <br />
            <br />
            거시 메모리 공급 과잉에 따른 반도체 가격 하락이 나타났다고 설명했다.
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

const ArticleImg = styled.div`
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
