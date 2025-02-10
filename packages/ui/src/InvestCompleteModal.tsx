import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Check } from './assets';
import { Button } from './Button';
import { useRef, useEffect } from 'react';

interface IInvestCompleteType {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InvestCompleteModal = ({
  isOpen,
  setIsOpen,
}: IInvestCompleteType) => {
  const outSideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outSideClick = (e: MouseEvent) => {
      if (outSideRef.current && outSideRef.current === e.target) {
        setIsOpen?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', outSideClick);
    }

    return () => {
      document.removeEventListener('click', outSideClick);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <BackgroundContainer ref={outSideRef}>
      <ModalContainer>
        <Header>
          <CheckDiv>
            <Check color={color.orange[500]} size={24} />
          </CheckDiv>
          <TitleContainer>
            <Title>투자를 완료하실 건가요?</Title>
            <Text>투자를 완료하면 주문을 변경할 수 없어요.</Text>
          </TitleContainer>
        </Header>
        <Footer>
          <ButtonDiv>
            <Button
              borderColor={color.zinc[200]}
              backgroundColor={color.zinc[50]}
              color={color.zinc[800]}
              onClick={() => setIsOpen?.(false)}
              hoverBackgroundColor={color.zinc[100]}
            >
              취소
            </Button>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
              hoverBackgroundColor={color.orange[600]}
            >
              투자 완료하기
            </Button>
          </ButtonDiv>
        </Footer>
      </ModalContainer>
    </BackgroundContainer>
  );
};

const ButtonDiv = styled.div`
  display: flex;
  gap: 10px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: right;
  border-top: 1px solid ${color.zinc[200]};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 12px 12px 12px 0px;
`;

const CheckDiv = styled.div`
  background-color: ${color.orange[50]};
  border: 1px solid ${color.orange[200]};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0px 0px 24px 24px;
`;

const Title = styled.div`
  font: ${font.h4};
`;

const Text = styled.div`
  font: ${font.l2};
  color: ${color.zinc[600]};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const ModalContainer = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  width: 480px;
  padding-top: 24px;
  border-radius: 16px;
`;
