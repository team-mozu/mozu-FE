import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useRef, useCallback, useEffect } from 'react';
import { Button } from '@mozu/ui';
import { TeamInvestStatusTable } from './TeamInvestStatusTable';

interface ITeamCurrentType {
  teamName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const TeamCurrentModal = ({
  teamName,
  isOpen,
  setIsOpen,
}: ITeamCurrentType) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      if (backgroundRef.current === e.target) {
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

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
      <BackgroundContainer ref={backgroundRef} onClick={handleBackgroundClick}>
        <ModalContainer>
          <ContentContainer>
            <TitleContainer>
              <Title>‘{teamName}’ 팀 거래 현황</Title>
            </TitleContainer>
            <TeamInvestStatusTable />
            <FooterContainer>
              <Button
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                color={color.zinc[800]}
                onClick={handleClose}
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
