import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { SearchInput } from './SearchInput';
import { Item } from './Item';
import { Button } from './Button';

export const AddInvestItemModal = () => {
  return (
    <ModalBackground>
      <InvestItemContainer>
        <SearchContainer>
          <Title>투자종목 추가</Title>
          <SearchInput inputText="종목 검색.." />
        </SearchContainer>
        <TableContainer>
          <Item isHeader={true} title1="종목 코드" title2="종목 이름" />
          <ItemContents>
            <Item title1="035720" title2="카카오" />
            <Item title1="005380" title2="현대차" />
            <Item title1="000270" title2="기아" />
            <Item title1="035420" title2="NAVER" />
            <Item title1="259960" title2="크래프톤" />
            <Item title1="247540" title2="에코프로비엠" />
            <Item title1="068270" title2="셀트리온" />
            <Item title1="006400" title2="삼성SDI" />
            <Item title1="373220" title2="LG에너지솔루션" />
          </ItemContents>
        </TableContainer>
        <FooterContainer>
          <BtnContainer>
            <Button
              backgroundColor={color.zinc[50]}
              borderColor={color.zinc[200]}
              color={color.zinc[800]}
            >
              취소
            </Button>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
            >
              선택 종목 추가
            </Button>
          </BtnContainer>
        </FooterContainer>
      </InvestItemContainer>
    </ModalBackground>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 12px;
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${color.zinc[200]};
`;

const SearchContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: start;
  width: 456px;
  margin-bottom: 12px;
`;

const InvestItemContainer = styled.div`
  width: 480px;
  height: 640px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${color.white};
  padding-top: 12px;
`;

const ModalBackground = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemContents = styled.div`
  overflow: scroll;
  height: 432px;
`;

const Title = styled.div<{ isHeader: boolean }>`
  font: ${font.b1};
  color: ${color.black};
  margin-left: 4px;
`;

const TableContent = styled.div<{ isHeader: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  background-color: ${({ isHeader }) =>
    isHeader ? color.zinc[50] : 'transparent'};
  border-bottom: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : 'transparent')};
  border-top: 1px solid
    ${({ isHeader }) => (isHeader ? color.zinc[200] : 'transparent')};
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 64px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
`;
