import { useAddStock } from '@/apis';
import { LogoUploader } from '@/components';
import { useForm, usePriceFormatter } from '@/hooks';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { EditDiv, Input, TextArea } from '@mozu/ui';

type FormState = {
  name: string;
  info: string;
  logo: File | null;
  money: string;
  debt: string;
  capital: string;
  profit: string;
  profitOG: string;
  profitBen: string;
  netProfit: string;
};

export const StockManagementAddPage = () => {
  const { state, onChangeInputValue, setState } = useForm<FormState>({
    name: '',
    info: '',
    logo: null,
    money: '',
    debt: '',
    capital: '',
    profit: '',
    profitOG: '',
    profitBen: '',
    netProfit: '',
  });

  const { prices: formattedPrices, priceChangeHandler } = usePriceFormatter(
    [
      state.money,
      state.debt,
      state.capital,
      state.profit,
      state.profitOG,
      state.profitBen,
      state.netProfit,
    ],
    (index, value) => {
      setState((prev) => {
        const newState = { ...prev };
        const keys = [
          'money',
          'debt',
          'capital',
          'profit',
          'profitOG',
          'profitBen',
          'netProfit',
        ];
        newState[keys[index]] = value;
        return newState;
      });
    },
  );

  const { mutate: apiData } = useAddStock();

  const addClick = () => {
    apiData({
      name: state.name,
      info: state.info,
      logo: state.logo,
      money: Number(state.money.replace(/,/g, '')),
      debt: Number(state.debt.replace(/,/g, '')),
      capital: Number(state.capital.replace(/,/g, '')),
      profit: Number(state.profit.replace(/,/g, '')),
      profitOG: Number(state.profitOG.replace(/,/g, '')),
      profitBen: Number(state.profitBen.replace(/,/g, '')),
      netProfit: Number(state.netProfit.replace(/,/g, '')),
    });
  };

  return (
    <Container>
      <EditDiv
        title={'종목 추가'}
        value1={'취소'}
        value2={'추가하기'}
        onClick={addClick}
      />
      <StockSetting>
        <InnerContainer>
          <div>
            <LogoUploader
              img={state.logo ? URL.createObjectURL(state.logo) : ''}
              onImageChange={(file) =>
                setState((prev) => ({ ...prev, logo: file }))
              }
            />
          </div>
          <div>
            <Input
              label={'회사 이름'}
              placeholder={'종목 이름을 입력해 주세요..'}
              width={'480px'}
              name="name"
              onChange={onChangeInputValue}
              value={state.name}
            />
          </div>
          <div>
            <TextArea
              placeholder={'회사 정보를 입력해 주세요..'}
              label={'회사 정보'}
              name="info"
              height={260}
              onChange={onChangeInputValue}
              value={state.info}
            ></TextArea>
          </div>
        </InnerContainer>
        <InnerContainer>
          <p>재무상태표 ∙ 손익계산서</p>
          {[
            { label: '자산', name: 'money', value: formattedPrices[0] || '' },
            { label: '부채', name: 'debt', value: formattedPrices[1] || '' },
            {
              label: '자본금',
              name: 'capital',
              value: formattedPrices[2] || '',
            },
            {
              label: '매출액',
              name: 'profit',
              value: formattedPrices[3] || '',
            },
            {
              label: '매출원가',
              name: 'profitOG',
              value: formattedPrices[4] || '',
            },
            {
              label: '매출이익',
              name: 'profitBen',
              value: formattedPrices[5] || '',
            },
            {
              label: '당기순이익',
              name: 'netProfit',
              value: formattedPrices[6] || '',
            },
          ].map((item, index) => (
            <div key={item.name}>
              <Input
                label={item.label}
                placeholder={`${item.label} 정보를 입력해 주세요.`}
                type={'text'}
                name={item.name}
                width={'480px'}
                text={'원'}
                onChange={priceChangeHandler(index)}
                value={item.value}
              />
            </div>
          ))}
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
  overflow: scroll;
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
