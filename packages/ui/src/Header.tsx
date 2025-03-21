import { LogoWithText } from '@mozu/ui';
import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface IHeaderProps {
  isAdmin: boolean;
}

export const Header = ({ isAdmin }: IHeaderProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  /** 📌 현재 페이지 상태를 useMemo로 계산 */
  const currentPage = useMemo(() => {
    if (pathname.startsWith('/:id/home')) return 'home';
    if (pathname.startsWith('/:id/news')) return 'news';
    if (pathname === '/:id/result') return 'result';
    if (pathname === '/signin/wait') return 'wait';
    return 'default';
  }, [pathname]);

  const isNavHome = currentPage === 'home';
  const isNavNews = currentPage === 'news';
  const isResultPage = currentPage === 'result';
  const isWaitPage = currentPage === 'wait';

  const datas = { investmentRound: 3 };

  return (
    <HeaderContainer isAdmin={isAdmin}>
      <LogoContainer
        onClick={() => navigate(isAdmin ? '/class-management' : '/home')}
      >
        <LogoWithText width={74} height={28} />
        <MozuTitle>모의주식투자</MozuTitle>
      </LogoContainer>

      {!isAdmin && !isResultPage && !isWaitPage && (
        <NavContainer>
          <Nav onClick={() => navigate('/home')} isActive={isNavHome}>
            홈
          </Nav>
          <Nav onClick={() => navigate('/news')} isActive={isNavNews}>
            뉴스
          </Nav>
        </NavContainer>
      )}

      {!isAdmin && !isResultPage && !isWaitPage && (
        <InvestmentRoundContainer>
          <InvestmentRoundContent>
            {datas.investmentRound}차 투자
          </InvestmentRoundContent>
          <InvestmentRoundExplain>진행중</InvestmentRoundExplain>
        </InvestmentRoundContainer>
      )}

      {(isWaitPage || isAdmin || isResultPage) && (
        <SchoolTag href="https://dsmhs.djsch.kr/main.do" target="_blank">
          © 대덕소프트웨어마이스터고등학교
        </SchoolTag>
      )}
    </HeaderContainer>
  );
};

/** 스타일 */
const HeaderContainer = styled.header<{ isAdmin: boolean }>`
  position: fixed;
  top: 0;
  width: ${({ isAdmin }) => (isAdmin ? 'calc(100% - 280px)' : '100%')};
  margin-left: ${({ isAdmin }) => (isAdmin ? '280px' : '0')};
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.white};
  border-bottom: 1px solid ${color.zinc[200]};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const NavContainer = styled.nav`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Nav = styled.div<{ isActive: boolean }>`
  font: ${font.b1};
  color: ${({ isActive }) => (isActive ? color.zinc[800] : color.zinc[500])};
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${({ isActive }) =>
    !isActive &&
    `
    :hover {
      color: ${color.zinc[600]};
    }
  `}
`;

const InvestmentRoundContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const InvestmentRoundExplain = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};
`;

const InvestmentRoundContent = styled.div`
  font: ${font.t1};
  color: ${color.orange[500]};
`;

const SchoolTag = styled.a`
  font: ${font.t4};
  color: ${color.zinc[500]};
`;
