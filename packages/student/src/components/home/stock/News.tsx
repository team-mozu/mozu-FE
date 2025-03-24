import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { NewsPost } from '@/components';
import { useNavigate } from 'react-router-dom';

export const datas = [
  {
    imgUrl:
      'https://flexible.img.hani.co.kr/flexible/normal/970/582/imgdb/child/2025/0108/53_17362935638033_20250108500307.jpg',
    title: '삼성전자, 차세대 메모리 반도체 개발 성공... 업계 판도 바꿀 전망',
    content:
      '삼성전자가 기존 대비 처리 속도 2배, 전력 소모량 30% 감소된 차세대 메모리 반도체 개발에 성공했다고 발표했다. 업계 전문가들은 이번 기술 혁신이 반도체 시장의 판도를 크게 바꿀 것으로 전망하고 있다.',
  },
  {
    imgUrl:
      'https://cdn.sisajournal.com/news/photo/202503/326152_330075_423.jpg',
    title: 'SK하이닉스, 인공지능 특화 반도체 생산라인 증설 계획 발표',
    content:
      'SK하이닉스가 급증하는 AI 수요에 대응하기 위해 인공지능 특화 반도체 생산라인 증설 계획을 발표했다. 약 10조원 규모의 투자를 통해 2025년까지 생산능력을 2배 확대할 예정이다.',
  },
  {
    imgUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeEwcHXhquZx_RsG89l8f-5q1rNU84w-a1Nw&s',
    title: '현대자동차, 완전 자율주행 전기차 프로토타입 공개',
    content:
      '현대자동차가 레벨 4 수준의 완전 자율주행 기능을 탑재한 전기차 프로토타입을 공개했다. 2026년 상용화를 목표로 하며, 도심 환경에서의 자율주행 성능이 특히 뛰어나다는 평가를 받고 있다.',
  },
  {
    imgUrl:
      'https://www.shinailbo.co.kr/news/photo/202201/1510816_697578_87.png',
    title:
      '네이버, 차세대 대규모 언어모델 개발 완료... 한국어 성능 세계 최고 수준',
    content:
      '네이버가 한국어 처리 능력이 세계 최고 수준인 차세대 대규모 언어모델(LLM) 개발을 완료했다고 밝혔다. 이번 모델은 기존 GPT-4 대비 한국어 이해 및 생성 능력이 30% 이상 향상된 것으로 나타났다.',
  },
  {
    imgUrl:
      'https://www.lgensol.com/upload/file/press-release/20231208_news_2.jpg',
    title: 'LG에너지솔루션, 차세대 전고체 배터리 상용화 앞당긴다',
    content:
      'LG에너지솔루션이 차세대 전고체 배터리 상용화 일정을 당초 계획보다 1년 앞당긴 2025년으로 발표했다. 에너지 밀도가 기존 리튬이온 배터리 대비 70% 향상되고 화재 위험이 크게 감소한 것이 특징이다.',
  },
  {
    imgUrl: 'https://cdn.sisain.co.kr/news/photo/202311/51643_95909_4741.jpg',
    title: '카카오, 메타버스 플랫폼 카카오버스 글로벌 출시',
    content:
      '카카오가 자체 개발한 메타버스 플랫폼 카카오버스를 글로벌 시장에 출시한다고 발표했다. 독자적인 AI 기술과 카카오의 다양한 서비스를 연동한 차별화된 경험을 제공할 예정이다.',
  },
  {
    imgUrl:
      'https://img.khan.co.kr/news/2024/04/25/news-p.v1.20240425.79f7016a639d4ae2a82c97fc661f44dc.jpg',
    title: '한화솔루션, 차세대 태양광 패널 효율 신기록 달성',
    content:
      '한화솔루션이 개발한 차세대 페로브스카이트-실리콘 탠덤 태양광 패널이 변환 효율 29.8%를 달성하며 세계 신기록을 세웠다. 이는 기존 상용 태양광 패널 대비 약 50% 향상된 수치다.',
  },
  {
    imgUrl:
      'https://biz.chosun.com/resizer/v2/E5FWLZNFZ3KECPUYQXCHTLKPR4.jpg?auth=41c14aaa1bc306c71c9cbf566107a4c0ad58db47cb20400fe2a6020d92740151&width=616',
    title: '셀트리온, 알츠하이머 치료제 임상 3상 성공... FDA 승인 신청 예정',
    content:
      '셀트리온이 개발 중인 알츠하이머 치료제가 임상 3상에서 인지 기능 개선에 유의미한 효과를 보였다고 발표했다. 회사 측은 올해 안에 미국 FDA에 승인 신청을 할 계획이라고 밝혔다.',
  },
  {
    imgUrl: 'https://image.lawtimes.co.kr/images/186732.jpg',
    title: '포스코, 친환경 수소환원제철 기술 상용화 앞당긴다',
    content:
      '포스코가 탄소 배출을 획기적으로 줄이는 수소환원제철 기술의 상용화 시점을 2030년으로 앞당긴다고 발표했다. 이 기술이 도입되면 제철 과정에서 발생하는 탄소 배출량을 최대 97%까지 감축할 수 있을 전망이다.',
  },
];

export const News = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Label>관련 뉴스</Label>
      <NewsContainer>
        {datas.map((data) => {
          return (
            <NewsPost
              title={data.title}
              content={data.content}
              key={data.title}
              onClick={() => navigate('/news/1')}
            />
          );
        })}
      </NewsContainer>
    </Container>
  );
};

const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-grow: 1;
  height: 100%:
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 600px;
  overflow-y: auto;
  flex: 1;
`;

const Label = styled.label`
  font: ${font.t2};
  color: ${color.black};
`;
