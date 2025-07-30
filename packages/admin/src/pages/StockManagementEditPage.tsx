import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useEditStock, useGetStockDetail } from "@/apis";
import { LogoUploader, MoneyInput } from "@/components";
import { useForm, usePriceFormatter } from "@/hooks";

type FormState = {
  name: string;
  info: string;
  logo: string | File | null;
  money: string;
  debt: string;
  capital: string;
  profit: string;
  profitOG: string;
  profitBen: string;
  netProfit: string;
};

export const StockManagementEditPage = () => {
  const { id } = useParams();
  const stockId = id ? parseInt(id) : null;
  const navigate = useNavigate();

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

  const { mutate: apiData } = useEditStock();
  const { data: stockData, isLoading } = useGetStockDetail(stockId);
  const handlePriceChange = (index: number, value: number) => {
    const fieldMap = [
      "money",
      "debt",
      "capital",
      "profit",
      "profitOG",
      "profitBen",
      "netProfit",
    ];
    setState(prev => ({
      ...prev,
      [fieldMap[index]]: value,
    }));
  };

  const { priceChangeHandler } = usePriceFormatter([], handlePriceChange); // 수정
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    if (stockData) {
      const newState: FormState = {
        name: stockData.name || "",
        info: stockData.info || "",
        logo: stockData.logo || null,
        money: String(stockData.money || 0),
        debt: String(stockData.debt || 0),
        capital: String(stockData.capital || 0),
        profit: String(stockData.profit || 0),
        profitOG: String(stockData.profitOG || 0),
        profitBen: String(stockData.profitBen || 0),
        netProfit: String(stockData.netProfit || 0),
      };
      setState(newState);
    }
  }, [
    stockData,
  ]);

  const editClick = () => {
    apiData({
      name: state.name,
      info: state.info,
      logo: state.logo,
      money: Number(state.money),
      debt: Number(state.debt),
      capital: Number(state.capital),
      profit: Number(state.profit),
      profitOG: Number(state.profitOG),
      profitBen: Number(state.profitBen),
      netProfit: Number(state.netProfit),
      stockId: stockId ?? 0,
    });
  };

  return (
    <Container>
      <EditDiv
        title={"종목 수정"}
        value1={"취소"}
        value2={"저장하기"}
        type2={"saveImg"}
        isIcon2={true}
        iconSize2={20}
        iconColor2={color.white}
        onClick={editClick}
      />
      <StockSetting>
        <LeftContainer>
          <div>
            <LogoUploader
              img={typeof state.logo === "string" ? state.logo : state.logo ? URL.createObjectURL(state.logo) : ""}
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
              width={"480px"}
              onChange={onChangeInputValue}
              value={state.name}
            />
          </div>
          <div>
            <TextArea
              placeholder={"회사 정보를 입력해 주세요.."}
              label={"회사 정보"}
              name="info"
              height={320}
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
              value: state.money,
            },
            {
              label: "부채",
              name: "debt",
              value: state.debt,
            },
            {
              label: "자본금",
              name: "capital",
              value: state.capital,
            },
            {
              label: "매출액",
              name: "profit",
              value: state.profit,
            },
            {
              label: "매출원가",
              name: "profitOG",
              value: state.profitOG,
            },
            {
              label: "매출이익",
              name: "profitBen",
              value: state.profitBen,
            },
            {
              label: "당기순이익",
              name: "netProfit",
              value: state.netProfit,
            },
          ].map((item, index) => (
            <div key={item.name}>
              <MoneyInput
                label={item.label}
                placeholder={`${item.label} 정보를 입력해 주세요.`}
                type={"text"}
                name={item.name}
                value={item.value ? Number(item.value).toLocaleString("ko-KR") : ""}
                onChange={priceChangeHandler(index)}
                width={"480px"}
                text={"원"}
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
