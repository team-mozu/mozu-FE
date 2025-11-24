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
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "매출액은 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "매출액은 0 이상이어야 합니다."),
  profitOG: z
    .string()
    .min(1, "매출원가는 필수입니다.")
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, ""))), "매출원가는 숫자여야 합니다.")
    .refine(val => Number(val.replace(/,/g, "")) >= 0, "매출원가는 0 이상이어야 합니다."),
  profitBen: z
    .string()
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, "").replace(/^-/, ""))), "매출이익은 숫자여야 합니다."),
  netProfit: z
    .string()
    .refine(val => !Number.isNaN(Number(val.replace(/,/g, "").replace(/^-/, ""))), "당기순이익은 숫자여야 합니다."),
});

type StockFormData = z.infer<typeof stockFormSchema>;

const financialFields = [
  {
    label: "자산",
    name: "money",
    allowNegative: false,
  },
  {
    label: "부채",
    name: "debt",
    allowNegative: false,
  },
  {
    label: "자본금",
    name: "capital",
    allowNegative: false,
  },
  {
    label: "매출액",
    name: "profit",
    allowNegative: false,
  },
  {
    label: "매출원가",
    name: "profitOG",
    allowNegative: false,
  },
  {
    label: "매출이익",
    name: "profitBen",
    allowNegative: true,
  },
  {
    label: "당기순이익",
    name: "netProfit",
    allowNegative: true,
  },
] as const;

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

  // 가격 포매팅 함수 (마이너스 지원)
  const formatPrice = (value: string, allowNegative: boolean = false) => {
    if (value === "" || value === undefined || value === null) return "";

    // 마이너스 기호 분리
    const isNegative = allowNegative && value.startsWith("-");
    const numericValue = isNegative ? value.substring(1) : value;

    const numValue = Number(numericValue.replace(/,/g, ""));
    if (isNaN(numValue)) return isNegative ? "-" : "";

    const formatted = numValue.toLocaleString();
    return isNegative ? `-${formatted}` : formatted;
  };

  // 가격 입력 핸들러 (개선된 버전)
  const handlePriceChange =
    (_: keyof StockFormData, allowNegative: boolean, onChange: (value: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/,/g, "");

        if (allowNegative) {
          // 마이너스 허용 필드: 마이너스 기호는 맨 앞에만, 숫자와 마이너스만 허용
          const hasMinus = inputValue.startsWith("-");
          const cleanValue = inputValue.replace(/[^0-9]/g, "");

          if (hasMinus && cleanValue === "") {
            onChange("-");
          } else if (hasMinus) {
            onChange(`-${cleanValue}`);
          } else {
            onChange(cleanValue);
          }
        } else {
          // 마이너스 비허용 필드: 숫자만 허용
          const cleanValue = inputValue.replace(/[^0-9]/g, "");
          onChange(cleanValue);
        }
      };

  // 마이너스 토글 핸들러 (필요시 사용)
  const toggleNegative = (
    _: "profitBen" | "netProfit",
    currentValue: string,
    onChange: (value: string) => void,
  ) => {
    if (currentValue.startsWith("-")) {
      // 현재 마이너스면 플러스로 변경
      onChange(currentValue.substring(1));
    } else if (currentValue && currentValue !== "" && currentValue !== "0") {
      // 현재 플러스면 마이너스로 변경
      onChange(`-${currentValue}`);
    }
  };

  useEffect(() => {
    if (id && stockData) {
      // 숫자 필드 설정 함수 - 0인 경우도 "0"으로 설정, 마이너스 값도 처리
      const setNumericField = (fieldName: keyof StockFormData, value: number | null | undefined) => {
        if (value === 0) {
          setValue(fieldName, "0");
        } else if (value !== null && value !== undefined) {
          // 마이너스 값인 경우 마이너스 기호 포함
          setValue(fieldName, value < 0 ? `-${Math.abs(value)}` : String(value));
        } else {
          setValue(fieldName, "");
        }
      };

      setValue("name", stockData.itemName || "");
      setValue("info", stockData.itemInfo || "");
      setValue("logo", stockData.itemLogo || null);
      setNumericField("money", stockData.money);
      setNumericField("debt", stockData.debt);
      setNumericField("capital", stockData.capital);
      setNumericField("profit", stockData.profit);
      setNumericField("profitOG", stockData.profitOg);
      setNumericField("profitBen", stockData.profitBenefit);
      setNumericField("netProfit", stockData.netProfit);
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

      // 빈 문자열을 0으로 변환하는 함수 (마이너스 값 유지)
      const transformEmptyToZero = (value: string, allowNegative: boolean = false) => {
        if (value === "") return "0";
        if (allowNegative && value.startsWith("-")) {
          return value === "-" ? "0" : value;
        }
        return value;
      };

      stockUpdate({
        itemName: data.name,
        itemInfo: data.info,
        itemLogo: logoToSend,
        money: Number(transformEmptyToZero(data.money).replace(/,/g, "")),
        debt: Number(transformEmptyToZero(data.debt).replace(/,/g, "")),
        capital: Number(transformEmptyToZero(data.capital).replace(/,/g, "")),
        profit: Number(transformEmptyToZero(data.profit).replace(/,/g, "")),
        profitOg: Number(transformEmptyToZero(data.profitOG).replace(/,/g, "")),
        profitBenefit: Number(transformEmptyToZero(data.profitBen, true).replace(/,/g, "")),
        netProfit: Number(transformEmptyToZero(data.netProfit, true).replace(/,/g, "")),
      });
    }
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
        onCancel={() => navigate(`/stock-management/${id}`)}
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
          {financialFields.map(item => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field }) => (
                <InputWrapper hasError={!!errors[item.name]}>
                  <FieldContainer>
                    <Input
                      label={item.label}
                      placeholder={`${item.label} 정보를 입력해 주세요.`}
                      type={"money"}
                      value={formatPrice(field.value, item.allowNegative)}
                      onChange={handlePriceChange(item.name, item.allowNegative, field.onChange)}
                      rightText="억원"
                      state={errors[item.name] ? "error" : "default"}
                      aria-invalid={!!errors[item.name]}
                      aria-describedby={errors[item.name] ? `${item.name}-error` : undefined}
                    />
                    {item.allowNegative && (
                      <NegativeHint
                        isNegative={field.value.startsWith("-")}
                        onClick={() =>
                          toggleNegative(item.name as "profitBen" | "netProfit", field.value, field.onChange)
                        }>
                        {field.value.startsWith("-") ? "음수" : "양수"}
                      </NegativeHint>
                    )}
                  </FieldContainer>
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
          <NegativeGuide>
            <GuideTitle>음수 입력 가이드</GuideTitle>
            <GuideText>• 매출이익과 당기순이익은 음수로 입력 가능합니다</GuideText>
            <GuideText>
              • 숫자 앞에 <strong>-</strong> 기호를 입력하거나
            </GuideText>
            <GuideText>
              • <strong>"양수" / "음수"</strong> 버튼을 클릭하여 전환할 수 있습니다
            </GuideText>
          </NegativeGuide>
        </RightContainer>
      </StockSetting>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
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

const FieldContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NegativeHint = styled.button<{
  isNegative: boolean;
}>`
  position: absolute;
  right: 40px;
  top: 10%;
  transform: translateY(-50%);
  padding: 4px 8px;
  border: 1px solid ${({ isNegative }) => (isNegative ? color.red[300] : color.green[300])};
  border-radius: 4px;
  background-color: ${({ isNegative }) => (isNegative ? color.red[50] : color.green[50])};
  color: ${({ isNegative }) => (isNegative ? color.red[700] : color.green[700])};
  font: ${font.b2};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    background-color: ${({ isNegative }) => (isNegative ? color.red[100] : color.green[100])};
    border-color: ${({ isNegative }) => (isNegative ? color.red[400] : color.green[400])};
  }
`;

const NegativeGuide = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
`;

const GuideTitle = styled.div`
  font: ${font.b2};
  font-weight: 600;
  color: ${color.zinc[700]};
  margin-bottom: 8px;
`;

const GuideText = styled.div`
  font: ${font.b2};
  color: ${color.zinc[600]};
  margin-bottom: 4px;
  
  strong {
    color: ${color.red[600]};
    font-weight: 600;
  }
`;

const ErrorMessage = styled.div`
  font: ${font.b2};
  color: ${color.red[500]};
  margin-top: 4px;
`;
