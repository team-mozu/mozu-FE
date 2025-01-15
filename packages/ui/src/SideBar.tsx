import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { ManagerLogo } from './assets';
import { NavBtn } from './NavBtn';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface ISideBarType {
  name?: string;
  role?: string;
  navTitle?: string;
}

export const SideBar = ({ name, role, navTitle }: ISideBarType) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isClassColor, setIsClassColor] = useState<boolean>(false);
  const [isStockColor, setIsStockColor] = useState<boolean>(false);
  const [isArticleColor, setIsArticleColor] = useState<boolean>(false);

  useEffect(() => {
    if (pathname.includes('/class-management')) {
      setIsClassColor(true);
      setIsStockColor(false);
      setIsArticleColor(false);
    } else if (pathname.includes('/stock-management')) {
      setIsClassColor(false);
      setIsStockColor(true);
      setIsArticleColor(false);
    } else if (pathname.includes('/article-management')) {
      setIsClassColor(false);
      setIsStockColor(false);
      setIsArticleColor(true);
    }
  }, [pathname]);

  return (
    <>
      <SideBarContainer>
        <ProfileContainer>
          <LogoContainer>
            <ManagerLogo />
          </LogoContainer>
          <ProfileContents>
            <Name>{name}</Name>
            <RoleType>{role}</RoleType>
          </ProfileContents>
        </ProfileContainer>
        <Line />
        <ContentContainer>
          <NavTitle>{navTitle}</NavTitle>
          <BtnContainer>
            <NavBtn
              type={'classIcon'}
              isColor={isClassColor}
              onClick={() => navigate('/class-management')}
            >
              수업 관리
            </NavBtn>
            <NavBtn
              type={'stockIcon'}
              isColor={isStockColor}
              onClick={() => navigate('/stock-management')}
            >
              종목 관리
            </NavBtn>
            <NavBtn
              type={'articleIcon'}
              isColor={isArticleColor}
              onClick={() => navigate('/article-management')}
            >
              기사 관리
            </NavBtn>
          </BtnContainer>
        </ContentContainer>
      </SideBarContainer>
    </>
  );
};

const BtnContainer = styled.div`
  width: 100%;
`;

const LogoContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[100]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Name = styled.div`
  font: ${font.t1};
  color: ${color.black};
`;

const RoleType = styled.div`
  font: ${font.b2};
  color: ${color.orange[600]};
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: start;
  margin-top: 20px;
`;

const ProfileContents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

const Line = styled.line`
  width: 240px;
  height: 1px;
  border: none;
  background-color: ${color.zinc[200]};
`;

const NavTitle = styled.div`
  margin-left: 20px;
  font: ${font.b1};
  color: ${color.zinc[600]};
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

const SideBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: ${color.white};
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  border-right: 1px solid ${color.zinc[200]};
  justify-content: start;
`;
