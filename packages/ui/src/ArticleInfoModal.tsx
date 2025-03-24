import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';

interface IArticleInfoType {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ArticleInfoModal = ({ isOpen, setIsOpen }: IArticleInfoType) => {
  const [datas, setDatas] = useState<
    { isClicked: boolean; articleContent: { title: string }[] }[]
  >([]);

  const outSideRef = useRef<HTMLDivElement | null>(null);
  const outSideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (outSideRef.current === e.target && setIsOpen) {
      setIsOpen(false);
    }
  };

  const cancelClick = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const barClick = (index: number) => {
    setDatas((prev) =>
      prev
        ? prev.map((data, idx) =>
            idx === index
              ? { ...data, isClicked: true }
              : { ...data, isClicked: false },
          )
        : [],
    );
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    isOpen && (
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
                  key={index}
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
                    <ArticleContent key={idx}>{content.title}</ArticleContent>
                  )),
                )}
            </ArticleContainer>
            <FooterContainer>
              <Button
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                color={color.zinc[800]}
                onClick={cancelClick}
                hoverBackgroundColor={color.zinc[100]}
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
  left: 0;
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
    ${({ isClicked }) => (isClicked ? color.orange[500] : 'transparent')};
  border-top: none;
  border-right: none;
  border-left: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font: ${font.t3};
  transition: border-bottom 0.5s ease;
  cursor: pointer;
  :hover {
    background-color: ${color.zinc[50]};
  }
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
