import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useRef, useCallback, useEffect } from 'react';
import { Button } from './Button';
import { InvestInfoTable } from './InvestInfoTable';

interface IClassInfoType {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ClassInfoModal = ({ isOpen, setIsOpen }: IClassInfoType) => {
  const outSideRef = useRef<HTMLDivElement>(null);

  const outSideClick = useCallback(
    (e: MouseEvent) => {
      if (outSideRef.current === e.target) {
        setIsOpen?.(false);
      }
    },
    [setIsOpen],
  );

  const cancelClick = useCallback(() => {
    setIsOpen?.(false);
  }, [setIsOpen]);

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

  if (!isOpen) return null;

  return (
    <BackgroundContainer onClick={outSideClick as any} ref={outSideRef}>
      <ModalContainer>
        <ContentContainer>
          <TitleContainer>
            <Title>투자 정보</Title>
          </TitleContainer>
          <InvestInfoTable />
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
  );
};

const FooterContainer = styled.div`
  width: 100%;
  height: 64px;
  border-top: 1px solid ${color.zinc[200]};
  display: flex;
  justify-content: end;
  padding: 12px 12px 12px 0;
`;

const TitleContainer = styled.div`
  padding: 16px 0 12px 16px;
  width: 100%;
  border-bottom: 1px solid ${color.zinc[200]};
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font: ${font.t3};
  color: ${color.black};
`;

const ModalContainer = styled.div`
  width: 1000px;
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
