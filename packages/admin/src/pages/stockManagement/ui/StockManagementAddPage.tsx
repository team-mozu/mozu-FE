import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { useCreateStock } from "@/entities/stock";
import { LogoUploader } from "@/features/stockCRUD/ui";
import { usePriceFormatter } from "@/shared/lib/hooks";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const stockFormSchema = z.object({
  name: z
    .string()
    .min(1, "회사 이름은 필수입니다.")
    .min(1, "회사 이름은 1글자 이상이어야 합니다.")
    .max(30, "회사 이름은 30글자 이하여야 합니다."),
  info: z
    .string()
    .min(1, "회사 정보는 필수입니다.")
    .min(1, "회사 정보는 1글자 이상이어야 합니다.")
    .max(10000, "회사 정보는 10000글자 이하여야 합니다."),
  logo: z.union([
    z.string(),
    z.instanceof(File),
    z.null(),
    z.literal("DELETE"),
  ]),
  money: z
    .string()
    .min(1, "자산은 필수입니다.")
    .refine(
      (val) => !Number.isNaN(Number(val.replace(/,/g, ""))),
      "자산은 숫자여야 합니다."
    )
    .refine(
      (val) => Number(val.replace(/,/g, "")) >= 0,
      "자산은 0 이상이어야 합니다."
    ),
  debt: z
    .string()
    .min(1, "부채는 필수입니다.")
    .refine(
      (val) => !Number.isNaN(Number(val.replace(/,/g, ""))),
      "부채는 숫자여야 합니다."
    )
    .refine(
      (val) => Number(val.replace(/,/g, "")) >= 0,
      "부채는 0 이상이어야 합니다."
    ),
  capital: z
    .string()
    .min(1, "자본금은 필수입니다.")
    .refine(
      (val) => !Number.isNaN(Number(val.replace(/,/g, ""))),
      "자본금은 숫자여야 합니다."
    )
    .refine(
      (val) => Number(val.replace(/,/g, "")) >= 0,
      "자본금은 0 이상이어야 합니다."
    ),
  profit: z
    .string()
    .min(1, "매출액은 필수입니다.")
    .refine(
      (val) => !Number.isNaN(Number(val.replace(/,/g, ""))),
      "매출액은 숫자여야 합니다."
    )
    .refine(
      (val) => Number(val.replace(/,/g, "")) >= 0,
      "매출액은 0 이상이어야 합니다."
    ),
  profitOG: z
    .string()
    .min(1, "매출원가는 필수입니다.")
    .refine(
      (val) => !Number.isNaN(Number(val.replace(/,/g, ""))),
      "매출원가는 숫자여야 합니다."
    )
    .refine(
      (val) => Number(val.replace(/,/g, "")) >= 0,
      "매출원가는 0 이상이어야 합니다."
    ),
  profitBen: z
    .string()
    .min(1, "매출이익은 필수입니다.")
    .refine(
      (val) => !Number.isNaN(Number(val.replace(/,/g, ""))),
      "매출이익은 숫자여야 합니다."
    )
    .refine(
      (val) => Number(val.replace(/,/g, "")) >= 0,
      "매출이익은 0 이상이어야 합니다."
    ),
  netProfit: z
    .string()
    .min(1, "당기순이익은 필수입니다.")
    .refine(
      (val) => !Number.isNaN(Number(val.replace(/,/g, ""))),
      "당기순이익은 숫자여야 합니다."
    )
    .refine(
      (val) => Number(val.replace(/,/g, "")) >= 0,
      "당기순이익은 0 이상이어야 합니다."
    ),
});

type StockFormData = z.infer<typeof stockFormSchema>;

const financialFields = [
  { label: "자산", name: "money" },
  { label: "부채", name: "debt" },
  { label: "자본금", name: "capital" },
  { label: "매출액", name: "profit" },
  { label: "매출원가", name: "profitOG" },
  { label: "매출이익", name: "profitBen" },
  { label: "당기순이익", name: "netProfit" },
] as const;

export const StockManagementAddPage = () => {
  const methods = useForm<StockFormData>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
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
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const { mutate: apiData } = useCreateStock();

  const values = watch();

  const { prices: formattedPrices, priceChangeHandler } = usePriceFormatter(
    [
      Number(values.money.replace(/,/g, "")),
      Number(values.debt.replace(/,/g, "")),
      Number(values.capital.replace(/,/g, "")),
      Number(values.profit.replace(/,/g, "")),
      Number(values.profitOG.replace(/,/g, "")),
      Number(values.profitBen.replace(/,/g, "")),
      Number(values.netProfit.replace(/,/g, "")),
    ],
    (index, value) => {
      const key = financialFields[index].name;
      setValue(key, value.toString());
    }
  );

  const onSubmit = (data: StockFormData) => {
    apiData({
      itemName: data.name,
      itemInfo: data.info,
      itemLogo: data.logo || "",
      money: Number(data.money.replace(/,/g, "")),
      debt: Number(data.debt.replace(/,/g, "")),
      capital: Number(data.capital.replace(/,/g, "")),
      profit: Number(data.profit.replace(/,/g, "")),
      profitOg: Number(data.profitOG.replace(/,/g, "")),
      profitBenefit: Number(data.profitBen.replace(/,/g, "")),
      netProfit: Number(data.netProfit.replace(/,/g, "")),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <EditDiv title="종목 추가" value1="취소" value2="추가하기" />
          <StockSetting>
            <LeftContainer>
              <div>
                <LogoUploader
                  img={
                    values.logo instanceof File
                      ? URL.createObjectURL(values.logo)
                      : ""
                  }
                  onImageChange={(file) => setValue("logo", file)}
                />
              </div>
              <div>
                <Input
                  label="회사 이름"
                  placeholder="종목 이름을 입력해 주세요.."
                  {...register("name")}
                />
                {errors.name && (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
              </div>
              <div>
                <TextArea
                  label="회사 정보"
                  placeholder="회사 정보를 입력해 주세요.."
                  height={260}
                  {...register("info")}
                />
                {errors.info && (
                  <ErrorMessage>{errors.info.message}</ErrorMessage>
                )}
              </div>
            </LeftContainer>

            <RightContainer>
              <p>재무상태표 ∙ 손익계산서</p>
              {financialFields.map((item, index) => {
                const value = formattedPrices[index];
                const error = errors[item.name];
                return (
                  <div key={item.name}>
                    <Input
                      label={item.label}
                      placeholder={`${item.label} 정보를 입력해 주세요..`}
                      type="money"
                      rightText="원"
                      {...register(item.name, {
                        onChange: priceChangeHandler(index),
                      })}
                      value={value === "0" ? "" : value}
                    />
                    {error && <ErrorMessage>{error.message}</ErrorMessage>}
                  </div>
                );
              })}
            </RightContainer>
          </StockSetting>
        </Container>
      </form>
    </FormProvider>
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

const ErrorMessage = styled.div`
  font: ${font.b2};
  color: ${color.red[500]};
  margin-top: 4px;
`;
