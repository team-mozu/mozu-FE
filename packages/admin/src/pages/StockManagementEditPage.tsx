import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { EditDiv, Input, LogoUploader, TextArea } from '@mozu/ui';

export const StockManagementEditPage = () => {
  return (
    <Container>
      <EditDiv
        title={'종목 수정'}
        value1={'취소'}
        value2={'저장하기'}
        type2={'saveImg'}
        isIcon2={true}
        iconSize2={20}
        iconColor2={color.white}
      />
      <StockSetting>
        <InnerContainer>
          <div>
            <LogoUploader />
          </div>
          <div>
            <Input
              label={'회사 이름'}
              placeholder={'종목 이름을 입력해 주세요..'}
              width={'480px'}
            />
          </div>
          <div>
            <Input
              label={'종목 코드'}
              placeholder={'종목 코드를 입력해 주세요..'}
              width={'480px'}
            />
          </div>
          <div>
            <TextArea
              placeholder={'회사 정보를 입력해 주세요..'}
              label={'회사 정보'}
              height={260}
            ></TextArea>
          </div>
        </InnerContainer>
        <InnerContainer>
          <p>재무상태표 ∙ 손익계산서</p>
          <div>
            <Input
              label={'자산'}
              placeholder={'자산 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
            />
          </div>
          <div>
            <Input
              label={'부채'}
              placeholder={'부채 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
            />
          </div>
          <div>
            <Input
              label={'자본금'}
              placeholder={'자본금 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
            />
          </div>
          <div>
            <Input
              label={'매출액'}
              placeholder={'매출액 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
            />
          </div>
          <div>
            <Input
              label={'매출원가'}
              placeholder={'매출원가 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
            />
          </div>
          <div>
            <Input
              label={'매출이익'}
              placeholder={'매출이익 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
            />
          </div>
          <div>
            <Input
              label={'당기순이익'}
              placeholder={'당기순이익 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
            />
          </div>
        </InnerContainer>
      </StockSetting>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StockSetting = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 8px;
`;

const InnerContainer = styled.div`
  width: 50%;
  height: 100%;
  padding: 24px;
  background-color: ${color.white};
  border-radius: 1rem;
  border: 1px solid ${color.zinc[200]};
  display: flex;
  flex-direction: column;
  gap: 24px;
  > p {
    color: ${color.black};
    font: ${font.t1};
  }
`;
