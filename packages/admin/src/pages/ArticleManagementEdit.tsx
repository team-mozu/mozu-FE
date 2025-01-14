import { color } from '@mozu/design-token';
import { EditDiv, ImgContainer, Input, TextArea } from '@mozu/ui';
import styled from '@emotion/styled';
import { useState, React } from 'react';

export const ArticleManagementEdit = () => {
  const [datas, setDatas] = useState<{
    title: string;
    content: string;
    imgUrl: string;
  }>({
    title: '목표가 떨어지며 새해 시작한 삼성전자…52층까지 내려갔다가 반등',
    content:
      '지난달 20일 이후 첫 5만2000원 선 추락 새해 첫 거래일 증권사들의 목표가 하향 행진의 중심에 선 삼성전자가 장 중 5만2000원 선까지 하락했다. 2일 한국거래소에 따르면 이날 삼성전자는 1% 안팎 하락한 채 거래되다가 장 마감 30분 전에 반등, 전 거래일 대비 0.38% 상승한 5만3400원에 거래를 마쳤다. 개장일부터 증권사들은 삼성전자를 향한 눈높이를 낮추고 있다. 이날 삼성전자 관련 리포트를 낸 미래에셋증권, 삼성증권, 대신증권, 한국투자증권 중에서 3개사가 목표가를 내렸다. 삼성전자의 지난해 4분기 잠정실적 발표를 앞두고 실적에 대한 우려를 표하면서 증권사들은 목표가를 하향조정했다. 삼성증권은 8만3000원에서 7만4000원으로, 대신증권은 8만5000원에서 7만8000원으로, 한국투자증권은 8만3000원에서 7만7000원으로 내렸다. 신석환 대신증권 연구원은 삼성전자의 작년 4분기 매출액을 76조6000억원, 영업이익을 7조6000억원으로 예상했다. 영업이익 예상치의 경우 시장 컨센서스인 8조9000억원을 하회하는 수치다. 신 연구원은 “견조한 고대역폭 메모리(HBM)/서버향 메모리 수요에도 불구하고 삼성전자의 HBM 양산 일정이 기대보다 지연됐다”며 “스마트폰·PC 등 수요 둔화와 레거시 메모리 공급 과잉에 따른 반도체 가격 하락이 나타났다”고 설명했다.',
    imgUrl: 'https://www.seoulfn.com/news/photo/202411/539160_293211_368.jpg',
  });

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatas((prev) => ({ ...prev, title: e.target.value }));
  };
  const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDatas((prev) => ({ ...prev, content: e.target.value }));
  };

  return (
    <AllContainer>
      <AddContainer>
        <EditDiv
          value1="취소"
          value2="저장하기"
          title="기사 수정"
          iconColor2={color.white}
          iconSize2={20}
          isIcon2={true}
          type2="saveImg"
        />
        <ContentContainer>
          <InputContainer>
            <Input
              placeholder="기사 제목을 입력해 주세요.."
              label="기사 제목"
              value={datas.title}
              onChange={titleChange}
            />
            <TextArea
              placeholder="기사 내용을 입력해 주세요.."
              label="기사 내용"
              height={480}
              value={datas.content}
              onChange={contentChange}
            />
            <ImgContainer label="기사 이미지" img={datas.imgUrl} />
          </InputContainer>
        </ContentContainer>
      </AddContainer>
    </AllContainer>
  );
};

const AllContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const InputContainer = styled.div`
  width: 1512px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1560px;
  gap: 8px;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 1028px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;
