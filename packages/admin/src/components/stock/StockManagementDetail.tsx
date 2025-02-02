import { Del, Edit, Button, Accounts } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useNavigate } from 'react-router';

interface IStockManagementDetailProps {
  onClick?: () => void; // onClick을 옵션으로 추가
}

export const StockManagementDetail = ({
  onClick,
}: IStockManagementDetailProps) => {
  const navigate = useNavigate();
  return (
    <Container>
      <UpperContainer>
        <div>
          <Logo>
            <img src="" alt="로고" />
          </Logo>
          <Text>
            <Title>삼성전자</Title>
            <Number>005930</Number>
          </Text>
        </div>
        <ButtonContainer>
          <div onClick={onClick}>
            <Button
              backgroundColor={color.zinc[50]}
              color={color.zinc[800]}
              borderColor={color.zinc[200]}
              hoverBackgroundColor={color.zinc[100]}
            >
              삭제하기
              <Del size={20} color={color.zinc[800]} />
            </Button>
          </div>
          <Button
            backgroundColor={color.orange[50]}
            color={color.orange[500]}
            borderColor={color.orange[200]}
            hoverBackgroundColor={color.orange[100]}
            onClick={() => navigate('1/edit')}
          >
            수정하기
            <Edit size={20} color={color.orange[500]} />
          </Button>
        </ButtonContainer>
      </UpperContainer>
      <UnderContainer>
        <CompanyInfo>
          <Label>회사 정보</Label>
          <div>
            <p>
              한국 및 DX부문 해외 9개 지역총괄과 DS부문 해외 5개 지역총괄, SDC,
              Harman 등 229개의 종속기업으로 구성된 글로벌 전자기업이다.
            </p>
          </div>
        </CompanyInfo>
        <CompanyMain>
          <LeftSection>
            <Label>재무상태표</Label>
            <ContentWrapper>
              <Accounts title={'부채'} content={'1,050,259억'} />
              <Accounts title={'자본금'} content={'1,050,259억'} />
            </ContentWrapper>
          </LeftSection>

          <RightSection>
            <Label>손익계산서</Label>
            <ContentWrapper>
              <Accounts title={'매출액'} content={'1,050,259억'} />
              <Accounts title={'매출원가'} content={'1,050,259억'} />
              <Accounts title={'매출이익'} content={'1,050,259억'} />
              <Accounts title={'당기순이익'} content={'1,050,259억'} />
            </ContentWrapper>
          </RightSection>
        </CompanyMain>
      </UnderContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const UpperContainer = styled.div`
  & > div:first-of-type {
    display: flex;
    gap: 12px;
  }

  display: flex;
  justify-content: space-between;
`;

const Logo = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: blue;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const Title = styled.p`
  font: ${font.h3};
  color: ${color.black};
`;

const Number = styled.p`
  font: ${font.b2};
  color: ${color.zinc[600]};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: end;
`;

const UnderContainer = styled.div`
  padding: 32px;
  background-color: ${color.white};
  width: 100%;
  height: 95%;
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 52px;
`;

const CompanyInfo = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  & > div {
    width: 100%;
    padding: 16px;
    background-color: ${color.zinc[50]};
    font: ${font.b2};
    color: ${color.black};
    border-radius: 12px;
  }
`;

const CompanyMain = styled.div`
  display: flex;
  gap: 24px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const RightSection = styled.div`
  flex: 2;
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(596px, 1fr));
  }
`;

const Label = styled.label`
  color: ${color.black};
  font: ${font.t3};
`;
