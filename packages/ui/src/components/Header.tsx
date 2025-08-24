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
        <LogoWithText
          width={74}
          height={28}
        />
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
`;

const LogoContainer = styled.div<{ isClick: boolean }>`
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: ${({ isClick }) => isClick ? `default` : `pointer`}
`;

const MozuTitle = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};
`;

const NavContainer = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
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
  gap: 50px;
  align-items: center;
  > div {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
  }
`;

const InvestmentRoundExplain = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};
`;

const InvestmentRoundContent = styled.div`
  font: ${font.t2};
  color: ${color.orange[500]};
`;

const SchoolTag = styled.a`
  font: ${font.t4};
  color: ${color.zinc[500]};
`;
