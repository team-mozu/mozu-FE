import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetStockDetail, useStockUpdate } from "@/entities/stock";
import { LogoUploader } from "@/features/stockCRUD/ui";
import { useForm, usePriceFormatter } from "@/shared/lib/hooks";

type FormState = {
  name: string;
  info: string;
  logo: string | File | null | "DELETE";
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

export const StockManagementEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const stockId = Number(id);

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

  const { mutate: stockUpdate, isPending } = useStockUpdate(id);
  const { data: stockData } = useGetStockDetail(stockId);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const titleInputRef = useRef<HTMLInputElement>(null);
  const infoInputRef = useRef<HTMLTextAreaElement>(null);
  const priceInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      const numValue = Number(field.value.toString().replace(/,/g, ""));
      if (!field.value.toString().trim()) {
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

    // 가격 입력 시 해당 필드의 에러 제거
    const fieldName = fieldMap[index] as keyof ValidationErrors;
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const { priceChangeHandler } = usePriceFormatter([], handlePriceChange); // 수정

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    if (id && stockData) {
      const newState: FormState = {
        name: stockData.itemName || "",
        info: stockData.itemInfo || "",
        logo: stockData.itemLogo || null,
        money: stockData.money ? String(stockData.money) : "",
        debt: stockData.debt ? String(stockData.debt) : "",
        capital: stockData.capital ? String(stockData.capital) : "",
        profit: stockData.profit ? String(stockData.profit) : "",
        profitOG: stockData.profitOg ? String(stockData.profitOg) : "",
        profitBen: stockData.profitBenefit ? String(stockData.profitBenefit) : "",
        netProfit: stockData.netProfit ? String(stockData.netProfit) : "",
      };
      setState(newState);
    }
  }, [
    stockData,
  ]);

  const editClick = () => {
    if (!validateForm()) {
      return;
    }

    if (id) {
      // 로고 처리 로직
      let logoToSend: File | null | "" = null;

      if (state.logo === "DELETE") {
        // 명시적 삭제 - 빈 문자열로 서버에 전달
        logoToSend = "";
      } else if (state.logo instanceof File) {
        // 새 파일 업로드
        logoToSend = state.logo;
      } else if (typeof state.logo === 'string') {
        // 기존 URL - 변경없음으로 null 전달
        logoToSend = null;
      }

      stockUpdate({
        itemName: state.name,
        itemInfo: state.info,
        itemLogo: logoToSend,
        money: Number(state.money.toString().replace(/,/g, "")),
        debt: Number(state.debt.toString().replace(/,/g, "")),
        capital: Number(state.capital.toString().replace(/,/g, "")),
        profit: Number(state.profit.toString().replace(/,/g, "")),
        profitOg: Number(state.profitOG.toString().replace(/,/g, "")),
        profitBenefit: Number(state.profitBen.toString().replace(/,/g, "")),
        netProfit: Number(state.netProfit.toString().replace(/,/g, "")),
      });
    }
  };

  const handleCancel = () => {
    navigate(`/stock-management/${id}`);
  };

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
        onClick={editClick}
        onCancel={handleCancel}
        disabled={isPending}
      />
      <StockSetting>
        <LeftContainer>
          <div>
            <LogoUploader
              img={typeof state.logo === "string" && state.logo !== "DELETE" ? state.logo : state.logo instanceof File ? URL.createObjectURL(state.logo) : ""}
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
            <InputWrapper hasError={!!errors.name}>
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
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </InputWrapper>
          </div>
          <div>
            <InputWrapper hasError={!!errors.info}>
              <TextArea
                ref={infoInputRef}
                placeholder={"회사 정보를 입력해 주세요.."}
                label={"회사 정보"}
                name="info"
                height={320}
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
            <InputWrapper key={item.name} hasError={!!errors[item.name as keyof ValidationErrors]}>
              <Input
                ref={(el) => {
                  priceInputRefs.current[index] = el;
                }}
                label={item.label}
                placeholder={`${item.label} 정보를 입력해 주세요.`}
                type={"money"}
                name={item.name}
                value={item.value ? Number(item.value).toLocaleString("ko-KR") : ""}
                onChange={priceChangeHandler(index)}
                rightText="원"
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
