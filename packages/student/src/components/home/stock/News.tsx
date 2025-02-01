import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { NewsPost } from '@/components';

export const datas = [
  {
    // imgUrl: noImg,
    title: '삼성전자 XR헤드셋 공개 임박···스마트글라스 캐즘 뒤집는다',
    content:
      '애플 ‘비전프로’ 실패 이후 침체됐던 확장현실(XR) 기기 시장이 꿈틀거리고 있다. 삼성전자의 첫 XR 헤드셋 ‘프로젝트 무한’이 이번 주 베일을 벗으면서다. 메타와 소니 등 글로벌 빅테크들도 착용 편의성과 활용도를 대폭 높인 신제품 준비에 박차를 가하고 있다.',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
  {
    // imgUrl: noImg,
    title: '삼성전자, 넥슨 신작 "퍼스트 버서커: 카잔" 3D 구현 맞손',
    content:
      '삼성전자가 넥슨코리아(이하 넥슨)와 넥슨의 자회사 네오플과 함께 한 차원 높은 3D 게이밍 경험 제공을 위한 기술 개발에 나선다. 삼성전자와 넥슨',
  },
];

export const News = () => {
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
