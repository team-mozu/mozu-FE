import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ManagerLogo } from "../assets";
import { NavBtn } from "./NavBtn";

interface ISideBarType {
  name?: string;
  role?: string;
  navTitle?: string;
}

export const SideBar = ({ name, role, navTitle }: ISideBarType) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [nav, setIsNav] = useState<string>("class");

  useEffect(() => {
    if (pathname.includes("stock-management")) {
      setIsNav("stock");
    } else if (pathname.includes("article-management")) {
      setIsNav("article");
    } else {
      setIsNav("class");
    }
  }, [
    pathname,
  ]);

  if (
    pathname.split("/")[1] === "class-management" &&
    (pathname.split("/")[3] === "start" || pathname.split("/")[3] === "monitoring")
  )
    return null;

  return (
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
      <Divider />
      <ContentContainer>
        <NavTitle>{navTitle}</NavTitle>
        <BtnContainer>
          <NavBtn
            type={"classIcon"}
            isColor={nav === "class"}
            onClick={() => navigate("/class-management")}>
            수업 관리
          </NavBtn>
          <NavBtn
            type={"stockIcon"}
            isColor={nav === "stock"}
            onClick={() => navigate("/stock-management")}>
            종목 관리
          </NavBtn>
          <NavBtn
            type={"articleIcon"}
            isColor={nav === "article"}
            onClick={() => navigate("/article-management")}>
            기사 관리
          </NavBtn>
        </BtnContainer>
      </ContentContainer>
    </SideBarContainer>
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

const Divider = styled.div`
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
  z-index: 1;
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
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
`;
