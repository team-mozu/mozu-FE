import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { ManagerLogo } from './assets';
import { NavBtn } from './NavBtn';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

type SideBarType = {
  name?: string;
  role?: string;
  navTitle?: string;
};

export const SideBar = ({ name, role, navTitle }: SideBarType) => {
  const { pathname } = useLocation();
  const [isClassColor, setIsClassColor] = useState<boolean>(false);
  const [isStockColor, setIsStockColor] = useState<boolean>(false);
  const [isArticleColor, setIsArticleColor] = useState<boolean>(false);

  useEffect(() => {
    if (pathname === '/') {
      //pathname이 수업관리일 때 (path 나오면 수정)
      setIsClassColor(true);
      setIsStockColor(false);
      setIsArticleColor(false);
    } else if (pathname === '/a') {
      //pathname이 종목관리일 때 (path 나오면 수정)
      setIsClassColor(false);
      setIsStockColor(true);
      setIsArticleColor(false);
    } else {
      //pathname이 기사관리일 때
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
            <NavBtn type={'classIcon'} isColor={isClassColor}>
              수업 관리
            </NavBtn>
            <NavBtn type={'stockIcon'} isColor={isStockColor}>
              종목 관리
            </NavBtn>
            <NavBtn type={'articleIcon'} isColor={isArticleColor}>
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
  height: 100vh;
  width: 280px;
  background-color: ${color.white};
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: start;
`;
