import styled from "@emotion/styled";
import { zodResolver } from "@hookform/resolvers/zod";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { useGetStockDetail, useStockUpdate } from "@/entities/stock";
import { LogoUploader } from "@/features/stockCRUD/ui";
import { usePriceFormatter } from "@/shared/lib/hooks";

const stockFormSchema = z.object({
  name: z.string().min(1, "회사 이름은 필수입니다.").min(1, "회사 이름은 1글자 이상이어야 합니다.").max(30, "회사 이름은 30글자 이하여야 합니다."),
  info: z.string().min(1, "회사 정보는 필수입니다.").min(1, "회사 정보는 1글자 이상이어야 합니다.").max(10000, "회사 정보는 10000글자 이하여야 합니다."),
  logo: z.union([
    z.string(),
    z.instanceof(File),
    z.null(),
    z.literal("DELETE"),
  ]),
  money: z
    .string()
    .min(1, "자산은 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "자산은 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "자산은 0 이상이어야 합니다."),
  debt: z
    .string()
    .min(1, "부채는 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "부채는 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "부채는 0 이상이어야 합니다."),
  capital: z
    .string()
    .min(1, "자본금은 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "자본금은 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "자본금은 0 이상이어야 합니다."),
  profit: z
    .string()
    .min(1, "매출액은 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "매출액은 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "매출액은 0 이상이어야 합니다."),
  profitOG: z
    .string()
    .min(1, "매출원가는 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "매출원가는 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "매출원가는 0 이상이어야 합니다."),
  profitBen: z
    .string()
    .min(1, "매출이익은 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "매출이익은 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "매출이익은 0 이상이어야 합니다."),
  netProfit: z
    .string()
    .min(1, "당기순이익은 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "당기순이익은 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "당기순이익은 0 이상이어야 합니다."),
});

type StockFormData = z.infer<typeof stockFormSchema>;

export const StockManagementEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const stockId = Number(id);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockFormData>({
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

  const { mutate: stockUpdate, isPending } = useStockUpdate(id);
  const { data: stockData } = useGetStockDetail(stockId);

  const handlePriceChange = (fieldName: keyof StockFormData) => (index: number, value: number) => {
    setValue(fieldName, String(value), {
      shouldValidate: true,
    });
  };

  const { priceChangeHandler: moneyHandler } = usePriceFormatter([], handlePriceChange("money"));
  const { priceChangeHandler: debtHandler } = usePriceFormatter([], handlePriceChange("debt"));
  const { priceChangeHandler: capitalHandler } = usePriceFormatter([], handlePriceChange("capital"));
  const { priceChangeHandler: profitHandler } = usePriceFormatter([], handlePriceChange("profit"));
  const { priceChangeHandler: profitOGHandler } = usePriceFormatter([], handlePriceChange("profitOG"));
  const { priceChangeHandler: profitBenHandler } = usePriceFormatter([], handlePriceChange("profitBen"));
  const { priceChangeHandler: netProfitHandler } = usePriceFormatter([], handlePriceChange("netProfit"));

  useEffect(() => {
    if (id && stockData) {
      setValue("name", stockData.itemName || "");
      setValue("info", stockData.itemInfo || "");
      setValue("logo", stockData.itemLogo || null);
      setValue("money", stockData.money ? String(stockData.money) : "");
      setValue("debt", stockData.debt ? String(stockData.debt) : "");
      setValue("capital", stockData.capital ? String(stockData.capital) : "");
      setValue("profit", stockData.profit ? String(stockData.profit) : "");
      setValue("profitOG", stockData.profitOg ? String(stockData.profitOg) : "");
      setValue("profitBen", stockData.profitBenefit ? String(stockData.profitBenefit) : "");
      setValue("netProfit", stockData.netProfit ? String(stockData.netProfit) : "");
    }
  }, [
    stockData,
    id,
    setValue,
  ]);

  const onSubmit = (data: StockFormData) => {
    if (id) {
      let logoToSend: File | null | "" = null;

      if (data.logo === "DELETE") {
        logoToSend = "";
      } else if (data.logo instanceof File) {
        logoToSend = data.logo;
      } else if (typeof data.logo === "string") {
        logoToSend = null;
      }

      stockUpdate({
        itemName: data.name,
        itemInfo: data.info,
        itemLogo: logoToSend,
        money: Number(data.money.toString().replace(/,/g, "")),
        debt: Number(data.debt.toString().replace(/,/g, "")),
        capital: Number(data.capital.toString().replace(/,/g, "")),
        profit: Number(data.profit.toString().replace(/,/g, "")),
        profitOg: Number(data.profitOG.toString().replace(/,/g, "")),
        profitBenefit: Number(data.profitBen.toString().replace(/,/g, "")),
        netProfit: Number(data.netProfit.toString().replace(/,/g, "")),
      });
    }
  };

  const handleCancel = () => {
    navigate(`/stock-management/${id}`);
  };

  const logoValue = watch("logo");

  return (
    <Container>
      <EditDiv
        title={"종목 수정"}
        value1={"취소"}
        value2={isPending ? "저장 중..." : "저장하기"}
        type2={"saveImg"}
        isIcon2={true}
        iconSize2={20}
        iconColor2={color.white}
        onClick={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        disabled={isPending}
      />
      <StockSetting>
        <LeftContainer>
          <div>
            <LogoUploader
              img={
                typeof logoValue === "string" && logoValue !== "DELETE"
                  ? logoValue
                  : logoValue instanceof File
                    ? URL.createObjectURL(logoValue)
                    : ""
              }
              onImageChange={file => {
                if (file === "DELETE") {
                  setValue("logo", null);
                } else {
                  setValue("logo", file);
                }
              }}
            />
          </div>
          <div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputWrapper hasError={!!errors.name}>
                  <Input
                    label={"회사 이름"}
                    placeholder={"종목 이름을 입력해 주세요.."}
                    {...field}
                    state={errors.name ? "error" : "default"}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <ErrorMessage
                      id="name-error"
                      role="alert">
                      {errors.name.message}
                    </ErrorMessage>
                  )}
                </InputWrapper>
              )}
            />
          </div>
          <div>
            <Controller
              name="info"
              control={control}
              render={({ field }) => (
                <InputWrapper hasError={!!errors.info}>
                  <TextArea
                    placeholder={"회사 정보를 입력해 주세요.."}
                    label={"회사 정보"}
                    height={320}
                    {...field}
                    state={errors.info ? "error" : "default"}
                    aria-invalid={!!errors.info}
                    aria-describedby={errors.info ? "info-error" : undefined}
                  />
                  {errors.info && (
                    <ErrorMessage
                      id="info-error"
                      role="alert">
                      {errors.info.message}
                    </ErrorMessage>
                  )}
                </InputWrapper>
              )}
            />
          </div>
        </LeftContainer>
        <RightContainer>
          <p>재무상태표 ∙ 손익계산서</p>
          {[
            {
              label: "자산",
              name: "money" as const,
              handler: moneyHandler,
            },
            {
              label: "부채",
              name: "debt" as const,
              handler: debtHandler,
            },
            {
              label: "자본금",
              name: "capital" as const,
              handler: capitalHandler,
            },
            {
              label: "매출액",
              name: "profit" as const,
              handler: profitHandler,
            },
            {
              label: "매출원가",
              name: "profitOG" as const,
              handler: profitOGHandler,
            },
            {
              label: "매출이익",
              name: "profitBen" as const,
              handler: profitBenHandler,
            },
            {
              label: "당기순이익",
              name: "netProfit" as const,
              handler: netProfitHandler,
            },
          ].map((item, index) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field }) => (
                <InputWrapper hasError={!!errors[item.name]}>
                  <Input
                    label={item.label}
                    placeholder={`${item.label} 정보를 입력해 주세요.`}
                    type={"money"}
                    value={field.value ? Number(field.value).toLocaleString("ko-KR") : ""}
                    onChange={item.handler(index)}
                    rightText="원"
                    state={errors[item.name] ? "error" : "default"}
                    aria-invalid={!!errors[item.name]}
                    aria-describedby={errors[item.name] ? `${item.name}-error` : undefined}
                  />
                  {errors[item.name] && (
                    <ErrorMessage
                      id={`${item.name}-error`}
                      role="alert">
                      {errors[item.name]?.message}
                    </ErrorMessage>
                  )}
                </InputWrapper>
              )}
            />
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

const InputWrapper = styled.div<{
  hasError?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ErrorMessage = styled.div`
  font: ${font.b2};
  color: ${color.red[500]};
  margin-top: 4px;
`;
