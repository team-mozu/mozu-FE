import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { useCreateStock } from "@/entities/stock";
import { LogoUploader } from "@/features/stockCRUD/ui";
import { useForm, usePriceFormatter } from "@/shared/lib/hooks";

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
    name: "",
    info: "",
    logo: null,
    money: "",
    debt: "",
    capital: "",
    profit: "",
    profitOG: "",
    profitBen: "",
    netProfit: "",
  });

  const { prices: formattedPrices, priceChangeHandler } = usePriceFormatter(
    [
      Number(state.money.replace(/,/g, "")),
      Number(state.debt.replace(/,/g, "")),
      Number(state.capital.replace(/,/g, "")),
      Number(state.profit.replace(/,/g, "")),
      Number(state.profitOG.replace(/,/g, "")),
      Number(state.profitBen.replace(/,/g, "")),
      Number(state.netProfit.replace(/,/g, "")),
    ],
    (index, value) => {
      setState(prev => {
        const newState = {
          ...prev,
        };
        const keys: (keyof Omit<FormState, "logo">)[] = [
          "money",
          "debt",
          "capital",
          "profit",
          "profitOG",
          "profitBen",
          "netProfit",
        ];
        newState[keys[index]] = value.toString();
        return newState;
      });
    },
  );

  const { mutate: apiData } = useCreateStock();

  const addClick = () => {
    apiData({
      itemName: state.name,
      itemInfo: state.info,
      itemLogo: state.logo || "",
      money: Number(state.money.replace(/,/g, "")),
      debt: Number(state.debt.replace(/,/g, "")),
      capital: Number(state.capital.replace(/,/g, "")),
      profit: Number(state.profit.replace(/,/g, "")),
      profitOg: Number(state.profitOG.replace(/,/g, "")),
      profitBenefit: Number(state.profitBen.replace(/,/g, "")),
      netProfit: Number(state.netProfit.replace(/,/g, "")),
    });
  };

  return (
    <Container>
      <EditDiv
        title={"종목 추가"}
        value1={"취소"}
        value2={"추가하기"}
        onClick={addClick}
      />
      <StockSetting>
        <LeftContainer>
          <div>
            <LogoUploader
              img={state.logo ? URL.createObjectURL(state.logo) : ""}
              onImageChange={file =>
                setState(prev => ({
                  ...prev,
                  logo: file,
                }))
              }
            />
          </div>
          <div>
            <Input
              label={"회사 이름"}
              placeholder={"종목 이름을 입력해 주세요.."}
              name="name"
              onChange={onChangeInputValue}
              value={state.name}
            />
          </div>
          <div>
            <TextArea
              placeholder={"회사 정보를 입력해 주세요.."}
              label={"회사 정보"}
              name="info"
              height={260}
              onChange={onChangeInputValue}
              value={state.info}></TextArea>
          </div>
        </LeftContainer>
        <RightContainer>
          <p>재무상태표 ∙ 손익계산서</p>
          {[
            {
              label: "자산",
              name: "money",
              value: formattedPrices[0] === "0" ? "" : formattedPrices[0],
            },
            {
              label: "부채",
              name: "debt",
              value: formattedPrices[1] === "0" ? "" : formattedPrices[1],
            },
            {
              label: "자본금",
              name: "capital",
              value: formattedPrices[2] === "0" ? "" : formattedPrices[2],
            },
            {
              label: "매출액",
              name: "profit",
              value: formattedPrices[3] === "0" ? "" : formattedPrices[3],
            },
            {
              label: "매출원가",
              name: "profitOG",
              value: formattedPrices[4] === "0" ? "" : formattedPrices[4],
            },
            {
              label: "매출이익",
              name: "profitBen",
              value: formattedPrices[5] === "0" ? "" : formattedPrices[5],
            },
            {
              label: "당기순이익",
              name: "netProfit",
              value: formattedPrices[6] === "0" ? "" : formattedPrices[6],
            },
          ].map((item, index) => (
            <div key={item.name}>
              <Input
                label={item.label}
                placeholder={`${item.label} 정보를 입력해 주세요..`}
                type="money"
                name={item.name}
                rightText="원"
                onChange={priceChangeHandler(index)}
                value={item.value}
              />
            </div>
          ))}
        </RightContainer>
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

const LeftContainer = styled.div`
  overflow: scroll;
  width: 95%;
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

const RightContainer = styled.div`
  overflow: scroll;
  width: 40%;
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
