import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useState, useRef } from 'react';
import { Button } from './Button';

export const ArticleInfo = () => {
  const [datas, setDatas] = useState<
    { isClicked: boolean; articleContent: [{ title: string }] }[]
  >([
    {
      isClicked: true,
      articleContent: [
        { title: '1' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
      ],
    },
    {
      isClicked: false,
      articleContent: [
        { title: '2' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
      ],
    },
    {
      isClicked: false,
      articleContent: [
        { title: '3' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
      ],
    },
    {
      isClicked: false,
      articleContent: [
        { title: '4' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
      ],
    },
    {
      isClicked: false,
      articleContent: [
        { title: '5' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
        { title: '윤 대통령 측 "탄핵소추 적법성 따질 것"...헌재 "협조해야"' },
      ],
    },
  ]);
  const [isClose, setIsClose] = useState<boolean>(false);

  const outSideRef = useRef();
  const outSideClick = (e: MouseEvent) => {
    if (outSideRef.current == e.target) setIsClose(true);
  };

  const cancelClick = () => {
    setIsClose(true);
  };

  const barClick = (index: number) => {
    setDatas((prev) =>
      prev.map((data, idx) =>
        idx === index
          ? { ...data, isClicked: true }
          : { ...data, isClicked: false },
      ),
    );
  };

  return (
    !isClose && (
      <BackgroundContainer onClick={outSideClick} ref={outSideRef}>
        <ModalContainer>
          <ContentContainer>
            <TitleContainer>
              <Title>기사 정보</Title>
            </TitleContainer>
            <BarContainer>
              {datas.map((data, index) => (
                <BarContent
                  isClicked={data.isClicked}
                  onClick={() => barClick(index)}
                >
                  {index + 1}차
                </BarContent>
              ))}
            </BarContainer>
            <ArticleContainer>
              {datas
                .filter((data) => data.isClicked)
                .map((data, index) =>
                  data.articleContent.map((content, idx) => (
                    <ArticleContent>{content.title}</ArticleContent>
                  )),
                )}
            </ArticleContainer>
            <FooterContainer>
              <Button
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                color={color.zinc[800]}
                onClick={cancelClick}
              >
                닫기
              </Button>
            </FooterContainer>
          </ContentContainer>
        </ModalContainer>
      </BackgroundContainer>
    )
  );
};

const FooterContainer = styled.div`
  width: 100%;
  border-top: 1px solid ${color.zinc[200]};
  display: flex;
  justify-content: end;
  padding: 12px 12px 12px 0;
`;

const TitleContainer = styled.div`
  padding: 24px 0 12px 24px;
  width: 100%;
`;
const ContentContainer = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font: ${font.t3};
  color: ${color.black};
`;

const ModalContainer = styled.div`
  width: 800px;
  height: 360px;
  border-radius: 16px;
  background-color: ${color.white};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BarContent = styled.button<{ isClicked: boolean }>`
  width: 80px;
  height: 40px;
  background-color: transparent;
  color: ${({ isClicked }) =>
    isClicked ? color.orange[500] : color.zinc[700]};
  border-bottom: 1px solid
    ${({ isClicked }) => (isClicked ? color.orange[500] : 'none')};
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font: ${font.t3};
  transition: border-bottom 0.5s ease;
`;

const BarContainer = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${color.zinc[200]};
`;

const ArticleContainer = styled.div`
  width: 100%;
  height: 200px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`;

const ArticleContent = styled.div`
  font: ${font.b2};
  color: ${color.black};
`;
