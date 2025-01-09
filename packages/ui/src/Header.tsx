import { LogoWithText } from './assets';
import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';

export const Header = () => {
  return (
    <HeaderContainer>
      <LogoContainer>
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
  width: 100%;
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${color.zinc[200]};
`;
