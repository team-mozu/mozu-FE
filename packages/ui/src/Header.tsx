import { LogoWithText } from '@mozu/ui';
import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface IHeaderType {
  isAdmin: boolean;
}

export const Header = ({ isAdmin }: IHeaderType) => {
  const [isNavHome, setIsNavHome] = useState<boolean>(false);
  const [isNavNews, setIsNavNews] = useState<boolean>(false);
  const [isResultPage, setIsResultPage] = useState<boolean>(false);

  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/news' || pathname === '/news/1') {
      setIsNavHome(false);
      setIsNavNews(true);
      setIsResultPage(false);
    } else if (pathname.includes('/home')) {
      setIsNavHome(true);
      setIsNavNews(false);
      setIsResultPage(false);
    } else if (pathname === '/result') {
      setIsNavHome(false);
      setIsNavNews(false);
      setIsResultPage(true);
    } else {
      setIsNavHome(false);
      setIsNavNews(false);
      setIsResultPage(false);
    }
  }, [pathname]);

  const datas = {
    investmentRound: 3,
  };

  const navegate = useNavigate();
  return (
    <HeaderContainer isAdmin={isAdmin}>
      <LogoContainer
        onClick={
          isAdmin
            ? () => navegate('/class-management')
            : () => navegate('/home')
        }
      >
        <LogoWithText width={74} height={28} />
        <MozuTitle>모의주식투자</MozuTitle>
      </LogoContainer>
      {!isAdmin && !isResultPage && (
        <NavContainer>
          <Nav onClick={() => navegate('/home')} isColor={isNavHome}>
            홈
          </Nav>
          <Nav onClick={() => navegate('/news')} isColor={isNavNews}>
            뉴스
          </Nav>
        </NavContainer>
      )}
      {!isAdmin && !isResultPage && (
        <InvestmentRoundContainer>
          <InvestmentRoundContent>
            {datas.investmentRound}차 투자
          </InvestmentRoundContent>
          <InvestmentRoundExplane>진행중</InvestmentRoundExplane>
        </InvestmentRoundContainer>
      )}
      {isAdmin && <SchoolTag>© 대덕소프트웨어마이스터고등학교</SchoolTag>}
      {isResultPage && <SchoolTag>© 대덕소프트웨어마이스터고등학교</SchoolTag>}
    </HeaderContainer>
  );
};

const InvestmentRoundContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const InvestmentRoundExplane = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};
`;

const InvestmentRoundContent = styled.div`
  font: ${font.t1};
  color: ${color.orange[500]};
`;

const Nav = styled.div<{ isColor: boolean }>`
  font: ${font.b1};
  color: ${({ isColor }) => (isColor ? color.zinc[800] : color.zinc[500])};
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const NavContainer = styled.nav`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
`;

const MozuTitle = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};
`;

const SchoolTag = styled.div`
  font: ${font.l2};
  color: ${color.zinc[500]};
`;

const HeaderContainer = styled.header<Pick<IHeaderType, 'isAdmin'>>`
  position: fixed;
  top: 0;
  width: ${({ isAdmin }) => (isAdmin ? 'calc(100% - 280px)' : '100%')};
  z-index: 1;
  height: 64px;
  padding: 0 40px;
  margin-left: ${({ isAdmin }) => (isAdmin ? '280px' : '0')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.white};
  border-bottom: 1px solid ${color.zinc[200]};
`;
