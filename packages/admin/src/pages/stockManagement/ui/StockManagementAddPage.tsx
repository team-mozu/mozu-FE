// HERE: 정승우 zod + react-hook-form 리펙토링 파트 (작업 후 이 주석은 지워주세요)

import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useCreateStock } from "@/entities/stock";
import { LogoUploader } from "@/features/stockCRUD/ui";
import { useForm, usePriceFormatter } from "@/shared/lib/hooks";

type FormState = {
  name: string;
  info: string;
  logo: File | null | "DELETE";
  money: string;
  debt: string;
  capital: string;
  profit: string;
  profitOG: string;
  profitBen: string;
  netProfit: string;
};

type ValidationErrors = {
  name?: string;
  info?: string;
  money?: string;
  debt?: string;
  capital?: string;
  profit?: string;
  profitOG?: string;
  profitBen?: string;
  netProfit?: string;
};

export const StockManagementAddPage = () => {
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

  const titleInputRef = useRef<HTMLInputElement>(null);
  const infoInputRef = useRef<HTMLTextAreaElement>(null);
  const priceInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

      // 가격 입력 시 해당 필드의 에러 제거
      const keys: (keyof Omit<FormState, "logo">)[] = [
        "money",
        "debt",
        "capital",
        "profit",
        "profitOG",
        "profitBen",
        "netProfit",
      ];
      const fieldName = keys[index];
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }
    },
  );

  const { mutate: apiData, isPending } = useCreateStock();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // 필수 필드 검증
    if (!state.name.trim()) {
      newErrors.name = "회사 이름은 필수입니다.";
    } else if (state.name.length < 2) {
      newErrors.name = "회사 이름은 2글자 이상이어야 합니다.";
    }

    if (!state.info.trim()) {
      newErrors.info = "회사 정보는 필수입니다.";
    } else if (state.info.length < 10) {
      newErrors.info = "회사 정보는 10글자 이상이어야 합니다.";
    }

    // 재무 데이터 검증
    const financialFields = [
      {
        key: "money",
        label: "자산",
        value: state.money,
      },
      {
        key: "debt",
        label: "부채",
        value: state.debt,
      },
      {
        key: "capital",
        label: "자본금",
        value: state.capital,
      },
      {
        key: "profit",
        label: "매출액",
        value: state.profit,
      },
      {
        key: "profitOG",
        label: "매출원가",
        value: state.profitOG,
      },
      {
        key: "profitBen",
        label: "매출이익",
        value: state.profitBen,
      },
      {
        key: "netProfit",
        label: "당기순이익",
        value: state.netProfit,
      },
    ];

    financialFields.forEach(field => {
      const numValue = Number(field.value.replace(/,/g, ""));
      if (!field.value.trim()) {
        newErrors[field.key as keyof ValidationErrors] = `${field.label}은 필수입니다.`;
      } else if (Number.isNaN(numValue)) {
        newErrors[field.key as keyof ValidationErrors] = `${field.label}은 숫자여야 합니다.`;
      } else if (numValue < 0) {
        newErrors[field.key as keyof ValidationErrors] = `${field.label}은 0 이상이어야 합니다.`;
      }
    });


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addClick = () => {
    if (!validateForm()) {
      return;
    }

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChangeInputValue(e);
    // 입력 시 해당 필드의 에러 제거
    if (errors[e.target.name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
  };

  const handleCancel = () => {
    navigate("/stock-management");
  };

  return (
    <Container>
      <EditDiv
        title={"종목 추가"}
        value1={"취소"}
        value2={isPending ? "추가 중..." : "추가하기"}
        onClick={addClick}
        onCancel={handleCancel}
        disabled={isPending}
      />
      <StockSetting>
        <LeftContainer>
          <div>
            <LogoUploader
              img={state.logo instanceof File ? URL.createObjectURL(state.logo) : ""}
              onImageChange={file => {
                if (file === "DELETE") {
                  setState(prev => ({
                    ...prev,
                    logo: null,
                  }));
                } else {
                  setState(prev => ({
                    ...prev,
                    logo: file,
                  }));
                }
              }}
            />
          </div>
          <div>
            <InputWrapper>
              <Input
                ref={titleInputRef}
                label={"회사 이름"}
                placeholder={"종목 이름을 입력해 주세요.."}
                name="name"
                onChange={handleInputChange}
                value={state.name}
                state={errors.name ? "error" : "default"}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "title-error" : undefined}
              />
              {errors.name && <ErrorMessage id="title-error" role="alert">{errors.name}</ErrorMessage>}
            </InputWrapper>
          </div>
          <div>
            <InputWrapper>
              <TextArea
                ref={infoInputRef}
                placeholder={"회사 정보를 입력해 주세요.."}
                label={"회사 정보"}
                name="info"
                height={260}
                onChange={handleInputChange}
                state={errors.info ? "error" : "default"}
                value={state.info}
                aria-invalid={!!errors.info}
                aria-describedby={errors.info ? "info-error" : undefined}
              />
              {errors.info && <ErrorMessage id="info-error" role="alert">{errors.info}</ErrorMessage>}
            </InputWrapper>
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
            <InputWrapper key={item.name} hasError={!!errors[item.name as keyof ValidationErrors]}>
              <Input
                ref={(el) => {
                  priceInputRefs.current[index] = el;
                }}
                label={item.label}
                placeholder={`${item.label} 정보를 입력해 주세요..`}
                type="money"
                name={item.name}
                rightText="원"
                onChange={priceChangeHandler(index)}
                value={item.value}
                state={errors[item.name as keyof ValidationErrors] ? "error" : "default"}
                aria-invalid={!!errors[item.name as keyof ValidationErrors]}
                aria-describedby={errors[item.name as keyof ValidationErrors] ? `${item.name}-error` : undefined}
              />
              {errors[item.name as keyof ValidationErrors] && (
                <ErrorMessage id={`${item.name}-error`} role="alert">{errors[item.name as keyof ValidationErrors]}</ErrorMessage>
              )}
            </InputWrapper>
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

const InputWrapper = styled.div<{ hasError?: boolean }>`
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
