import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { desktopMediaQueries } from "../styles/breakpoints"; // Import desktopMediaQueries
import { SvgIcon } from "./SvgIcon";

interface IHeaderProps {
  isAdmin: boolean;
  invDeg?: number;
  showNav: boolean; // This prop is defined but not used in the Header component logic
  showRound: boolean; // This prop is defined but not used in the Header component logic
  isMargin?: boolean;
}

export const Header = ({ isAdmin, invDeg }: IHeaderProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { classId } = useParams();

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
          <SvgIcon
            name="logo-with-text"
            size={72}
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

  /* 데스크탑 반응형 - 중형 데스크탑 (1440px 이하, desktopBreakpoints.medium) */
  ${desktopMediaQueries.medium} {
    width: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "calc(100% - 260px)" : "100%")};
    margin-left: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "260px" : "0")};
    padding: 0 32px;
  }

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하, desktopBreakpoints.small) */
  ${desktopMediaQueries.small} {
    width: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "calc(100% - 240px)" : "100%")};
    margin-left: ${({ isAdmin, isMargin }) => (isAdmin && isMargin ? "240px" : "0")};
    padding: 0 24px;
    height: 60px; /* Slightly reduced height for smaller desktop screens */
  }

`;

const LogoContainer = styled.div<{
  isClick: boolean;
}>`
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: ${({ isClick }) => (isClick ? `default` : `pointer`)};

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    gap: 10px;
  }
`;

const ResponsiveLogo = styled.div`
  display: flex;
  align-items: center;

  /* 데스크탑 반응형 - 로고 크기 조정 */
  & > svg {
    transition: all 0.3s ease;
  }

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    & > svg {
      width: 66px !important;
      height: 25px !important;
    }
  }
`;

const MozuTitle = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    font: ${font.b2};
  }
`;

const NavContainer = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    gap: 4px;
  }
`;

const Nav = styled.div<{
  isActive: boolean;
}>`
  font: ${font.h4};
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

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    font: ${font.b2};
    padding: 8px 12px;
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

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    gap: 32px;
    > div {
      gap: 6px;
    }
  }
`;

const InvestmentRoundExplain = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    font: ${font.l1};
  }
`;

const InvestmentRoundContent = styled.div`
  font: ${font.t2};
  color: ${color.orange[500]};

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    font: ${font.t3};
  }
`;

const SchoolTag = styled.a`
  font: ${font.l1};
  color: ${color.zinc[400]};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${color.zinc[600]};
  }

  /* 데스크탑 반응형 - 소형 데스크탑 (1366px 이하) */
  ${desktopMediaQueries.small} {
    font: ${font.l2};
  }
`;
