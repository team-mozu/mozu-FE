import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';
import { useRef, useCallback, useEffect } from 'react';
import { ClassIcon, InvestInfoTable, Button } from '@mozu/ui';

interface classItem {
  itemId: number;
  itemName: string;
  money: number[];
}

interface IClassInfoType {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  classItems: classItem[];
}

export const ClassInfoModal = ({ isOpen, setIsOpen, classItems }: IClassInfoType) => {
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
        <Header>
          <IconWrapper>
            <ClassIcon size={28} color={color.zinc[800]} />
          </IconWrapper>
          <TitleSection>
            <Title>투자 정보</Title>
            <Subtitle>차수별 투자 종목 정보를 확인하세요</Subtitle>
          </TitleSection>
        </Header>

        <ContentWrapper>
          <InvestInfoTable classItems={classItems} />
        </ContentWrapper>

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
      </ModalContainer>
    </BackgroundContainer>
  );
};

// Enhanced Modal Styled Components
const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  width: 1200px;
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 24px;
  background: linear-gradient(135deg, ${color.white} 0%, ${color.zinc[50]} 100%);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px 32px 24px 32px;
  border-bottom: 1px solid ${color.zinc[200]};
  background: ${color.white};
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, ${color.orange[100]} 0%, ${color.orange[50]} 100%);
  border: 2px solid ${color.orange[200]};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
  flex-shrink: 0;
`;

const InvestIcon = styled.span`
  font-size: 28px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h2`
  font: ${font.h2};
  color: ${color.zinc[900]};
  margin: 0;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font: ${font.b2};
  color: ${color.zinc[600]};
  margin: 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 32px 32px 32px;
  border-top: 1px solid ${color.zinc[200]};
  background: ${color.white};
`;