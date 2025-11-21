import styled from "@emotion/styled";
import { zodResolver } from "@hookform/resolvers/zod";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useCreateStock } from "@/entities/stock";
import { LogoUploader } from "@/features/stockCRUD/ui";
import { usePriceFormatter } from "@/shared/lib/hooks";

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
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, "").replace(/^-/, ""))), "매출액은 숫자여야 합니다."),
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
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, "").replace(/^-/, ""))), "당기순이익은 숫자여야 합니다."),
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

  const { mutate: apiData, isPending } = useCreateStock();

  const navigate = useNavigate();

  const values = watch();

  // 가격 포매팅 함수
  const formatPrice = (value: string) => {
    if (value === "" || value === undefined || value === null) return "";
    const numValue = Number(value.replace(/,/g, ""));
    if (isNaN(numValue)) return "";
    return numValue.toLocaleString();
  };

  // 가격 입력 핸들러
  const handlePriceChange = (fieldName: keyof StockFormData, onChange: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // 매출과 당기순이익은 마이너스 허용, 다른 필드는 양수만
      if (fieldName === "profit" || fieldName === "netProfit") {
        // 마이너스, 숫자만 허용 (마이너스는 맨 앞에만)
        const cleanValue = inputValue.replace(/[^0-9-]/g, "").replace(/(?!^)-/g, "");
        onChange(cleanValue);
      } else {
        // 숫자만 허용
        const cleanValue = inputValue.replace(/[^0-9]/g, "");
        onChange(cleanValue);
      }
    };

  const onSubmit = (data: StockFormData) => {
    // 빈 문자열을 0으로 변환하여 전송
    const transformEmptyToZero = (value: string) =>
      value === "" ? "0" : value;

    apiData({
      itemName: data.name,
      itemInfo: data.info,
      itemLogo: data.logo || "",
      money: Number(transformEmptyToZero(data.money).replace(/,/g, "")),
      debt: Number(transformEmptyToZero(data.debt).replace(/,/g, "")),
      capital: Number(transformEmptyToZero(data.capital).replace(/,/g, "")),
      profit: Number(transformEmptyToZero(data.profit).replace(/,/g, "")),
      profitOg: Number(transformEmptyToZero(data.profitOG).replace(/,/g, "")),
      profitBenefit: Number(transformEmptyToZero(data.profitBen).replace(/,/g, "")),
      netProfit: Number(transformEmptyToZero(data.netProfit).replace(/,/g, "")),
    });
  };

  return (
    <Container>
      <EditDiv
        title={"종목 추가"}
        value1={"취소"}
        value2={isPending ? "저장 중..." : "추가하기"}
        onCancel={() => navigate("/stock-management")}
        onClick={handleSubmit(onSubmit)}
        disabled={isPending}
      />
      <StockSetting>
        <LeftContainer>
          <div>
            <LogoUploader
              img={values.logo instanceof File ? URL.createObjectURL(values.logo) : ""}
              onImageChange={file => setValue("logo", file)}
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
          {financialFields.map((item, index) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field }) => (
                <InputWrapper hasError={!!errors[item.name]}>
                  <InputWithToggle>
                    <Input
                      label={item.label}
                      placeholder={`${item.label} 정보를 입력해 주세요.`}
                      type={"money"}
                      value={formatPrice(field.value)}
                      onChange={handlePriceChange(item.name, field.onChange)}
                      rightText="억원"
                      state={errors[item.name] ? "error" : "default"}
                      aria-invalid={!!errors[item.name]}
                      aria-describedby={errors[item.name] ? `${item.name}-error` : undefined}
                    />
                    {(item.name === "profit" || item.name === "netProfit") && (
                      <ToggleButton
                        type="button"
                        onClick={() => {
                          const currentValue = field.value;
                          if (currentValue.startsWith("-")) {
                            field.onChange(currentValue.substring(1));
                          } else if (currentValue !== "" && currentValue !== "0") {
                            field.onChange(`-${currentValue}`);
                          }
                        }}
                        isNegative={field.value.startsWith("-")}
                      >
                        {field.value.startsWith("-") ? "+" : "−"}
                      </ToggleButton>
                    )}
                  </InputWithToggle>
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

const InputWithToggle = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const ToggleButton = styled.button<{
  isNegative: boolean;
}>`
  width: 32px;
  height: 32px;
  border: 1px solid ${color.zinc[300]};
  border-radius: 6px;
  background-color: ${({ isNegative }) => isNegative ? color.red[50] : color.zinc[50]};
  color: ${({ isNegative }) => isNegative ? color.red[600] : color.zinc[600]};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background-color: ${({ isNegative }) => isNegative ? color.red[100] : color.zinc[100]};
    border-color: ${({ isNegative }) => isNegative ? color.red[400] : color.zinc[400]};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ErrorMessage = styled.div`
  font: ${font.b2};
  color: ${color.red[500]};
  margin-top: 4px;
`;
