import { LogoWithText } from '@mozu/ui';
import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navegate = useNavigate();
  return (
    <HeaderContainer>
      <LogoContainer onClick={() => navegate('/class-management')}>
        <LogoWithText width={74} height={28} />
        <MozuTitle>모의주식투자</MozuTitle>
      </LogoContainer>
      <SchoolTag>© 대덕소프트웨어마이스터고등학교</SchoolTag>
    </HeaderContainer>
  );
};

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

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: calc(100% - 280px);
  z-index: 1;
  height: 64px;
  padding: 0 40px;
  margin-left: 280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.white};
  border-bottom: 1px solid ${color.zinc[200]};
`;
