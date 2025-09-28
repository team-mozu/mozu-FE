import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LogoWithText } from "../assets";

interface IHeaderProps {
  isAdmin: boolean;
  invDeg?: number;
  showNav: boolean;
  showRound: boolean;
  isMargin?: boolean;
}

export const Header = ({ isAdmin, invDeg }: IHeaderProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { classId, newsId } = useParams();

  /** 📌 현재 페이지 상태를 useMemo로 계산 */
  const currentPage = useMemo(() => {
    if (pathname === `/${classId}`) return "home";
    if (pathname === `/${classId}/news`) return "news";
    if (pathname === `/${classId}/result`) return "result";
    if (pathname === "/signin/wait") return "wait";
    if (pathname === `/${classId}/ending`) return "ending";
    return "default";
  }, [
    pathname,
    classId,
  ]);

  const isNavHome = currentPage === "home";
  const isNavNews = currentPage === "news";
  const isResultPage = currentPage === "result";
  const isWaitPage = currentPage === "wait";
  const isEndingPage = currentPage === "ending";

  return (
    <HeaderContainer
      isAdmin={isAdmin}
      isMargin={
        !(
          pathname.split("/")[1] === "class-management" &&
          (pathname.split("/")[3] === "start" || pathname.split("/")[3] === "monitoring")
        )
      }>
      <LogoContainer
        isClick={isResultPage || isWaitPage}
        onClick={() => {
          if (isResultPage || isWaitPage) return;
          navigate(isAdmin ? "/class-management" : `/${classId}`);
        }}>
        <ResponsiveLogo>
          <LogoWithText
            width={74}
            height={28}
          />
        </ResponsiveLogo>
        <MozuTitle>모의주식투자</MozuTitle>
      </LogoContainer>

      {!isAdmin && !isResultPage && !isWaitPage && !isEndingPage && (
        <NavContainer>
          <Nav
            onClick={() => navigate(`/${classId}`)}
            isActive={isNavHome}>
            홈
          </Nav>
          <Nav
            onClick={() => navigate(`/${classId}/news`)}
            isActive={isNavNews}>
            뉴스
          </Nav>
        </NavContainer>
      )}

      {!isAdmin && !isResultPage && !isWaitPage && !isEndingPage && (
        <InvestmentRoundContainer>
          <div>
            <InvestmentRoundContent>{invDeg}차 투자</InvestmentRoundContent>
            <InvestmentRoundExplain>진행중</InvestmentRoundExplain>
          </div>
          <SchoolTag
            href="https://dsmhs.djsch.kr/main.do"
            target="_blank">
            © 대덕소프트웨어마이스터고등학교
          </SchoolTag>
        </InvestmentRoundContainer>
      )}

      {(isWaitPage || isAdmin || isResultPage || isEndingPage) && (
        <SchoolTag
          href="https://dsmhs.djsch.kr/main.do"
          target="_blank">
          © 대덕소프트웨어마이스터고등학교
        </SchoolTag>
      )}
    </HeaderContainer>
  );
};

/** 스타일 */
const HeaderContainer = styled.header<{
  isAdmin: boolean;
  isMargin: boolean;
}>`
  position: fixed;
  top: 0;
  z-index: 1;
  width: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "calc(100% - 280px)" : "100%")};
  margin-left: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "280px" : "0")};
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.white};
  border-bottom: 1px solid ${color.zinc[200]};
  box-shadow: 0 2px 4px rgba(93, 93, 93, 0.1);
  transition: all 0.3s ease;

  /* 데스크탑 반응형 - 사이드바 너비 변화에 맞춰 조정 */
  @media (max-width: 1440px) {
    width: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "calc(100% - 260px)" : "100%")};
    margin-left: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "260px" : "0")};
    padding: 0 32px;
  }

  @media (max-width: 1200px) {
    width: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "calc(100% - 240px)" : "100%")};
    margin-left: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "240px" : "0")};
    padding: 0 24px;
  }

  @media (max-width: 1024px) {
    width: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "calc(100% - 220px)" : "100%")};
    margin-left: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "220px" : "0")};
    padding: 0 20px;
    height: 56px;
  }

  @media (max-width: 900px) {
    width: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "calc(100% - 72px)" : "100%")};
    margin-left: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "72px" : "0")};
    padding: 0 16px;
    height: 52px;
  }
`;

const LogoContainer = styled.div<{ isClick: boolean }>`
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: ${({ isClick }) => isClick ? `default` : `pointer`};

  /* 데스크탑 반응형 - 작은 화면에서 간격 조정 */
  @media (max-width: 1200px) {
    gap: 10px;
  }

  @media (max-width: 1024px) {
    gap: 8px;
  }

  @media (max-width: 900px) {
    gap: 6px;
  }
`;

const ResponsiveLogo = styled.div`
  display: flex;
  align-items: center;

  /* 데스크탑 반응형 - 작은 화면에서 로고 크기 조정 */
  & > svg {
    transition: all 0.3s ease;
  }

  @media (max-width: 1200px) {
    & > svg {
      width: 66px !important;
      height: 25px !important;
    }
  }

  @media (max-width: 1024px) {
    & > svg {
      width: 58px !important;
      height: 22px !important;
    }
  }

  @media (max-width: 900px) {
    & > svg {
      width: 50px !important;
      height: 19px !important;
    }
  }
`;

const MozuTitle = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};

  /* 데스크탑 반응형 - 작은 화면에서 폰트 크기 조정 */
  @media (max-width: 1200px) {
    font: ${font.b2};
  }

  @media (max-width: 1024px) {
    font: ${font.l1};
  }

  /* 매우 작은 화면에서 타이틀 숨기기 */
  @media (max-width: 900px) {
    display: none;
  }
`;

const NavContainer = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;

  /* 데스크탑 반응형 - 작은 화면에서 간격 조정 */
  @media (max-width: 1200px) {
    gap: 4px;
  }

  @media (max-width: 1024px) {
    gap: 2px;
  }

  /* 매우 작은 화면에서 내비게이션 숨기기 */
  @media (max-width: 900px) {
    display: none;
  }
`;

const Nav = styled.div<{
  isActive: boolean;
}>`
  font: ${font.b1};
  color: ${({ isActive }) => (isActive ? color.zinc[800] : color.zinc[500])};
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ isActive }) =>
    !isActive &&
    `
    :hover {
      color: ${color.zinc[600]};
    }
  `}

  /* 데스크탑 반응형 - 작은 화면에서 패딩 조정 */
  @media (max-width: 1200px) {
    font: ${font.b2};
    padding: 8px 12px;
  }

  @media (max-width: 1024px) {
    font: ${font.l1};
    padding: 6px 10px;
  }
`;

const InvestmentRoundContainer = styled.div`
  display: flex;
  gap: 50px;
  align-items: center;
  > div {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
  }

  /* 데스크탑 반응형 - 작은 화면에서 간격 조정 */
  @media (max-width: 1200px) {
    gap: 32px;
    > div {
      gap: 6px;
    }
  }

  @media (max-width: 1024px) {
    gap: 24px;
    > div {
      gap: 4px;
    }
  }

  @media (max-width: 900px) {
    gap: 16px;
    > div {
      gap: 2px;
    }
  }
`;

const InvestmentRoundExplain = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};

  /* 데스크탑 반응형 - 작은 화면에서 폰트 크기 조정 */
  @media (max-width: 1200px) {
    font: ${font.l1};
  }

  @media (max-width: 1024px) {
    font: ${font.l2};
  }

  /* 매우 작은 화면에서 숨기기 */
  @media (max-width: 900px) {
    display: none;
  }
`;

const InvestmentRoundContent = styled.div`
  font: ${font.t2};
  color: ${color.orange[500]};

  /* 데스크탑 반응형 - 작은 화면에서 폰트 크기 조정 */
  @media (max-width: 1200px) {
    font: ${font.t3};
  }

  @media (max-width: 1024px) {
    font: ${font.t4};
  }

  @media (max-width: 900px) {
    font: ${font.b1};
  }
`;

const SchoolTag = styled.a`
  font: ${font.t4};
  color: ${color.zinc[500]};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${color.zinc[700]};
  }

  /* 데스크탑 반응형 - 작은 화면에서 폰트 크기 조정 */
  @media (max-width: 1200px) {
    font: ${font.b2};
  }

  @media (max-width: 1024px) {
    font: ${font.l1};
  }

  @media (max-width: 900px) {
    font: ${font.l2};
  }
`;
