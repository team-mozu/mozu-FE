import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea, Toast } from "@mozu/ui";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useCreateArticle } from "@/entities/article";
import { ImgContainer } from "@/features/articleCRUD/ui";
import { useForm } from "@/shared/lib/hooks";

interface FormState {
  articleName: string;
  articleDesc: string;
  articleImage: File | null | string;
}

interface FormErrors {
  articleName?: string;
  articleDesc?: string;
  articleImage?: string;
}

export const ArticleManagementAddPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state, onChangeInputValue, setState } = useForm<FormState>({
    articleName: "",
    articleDesc: "",
    articleImage: null,
  });

  const { mutate: createArticle, isPending } = useCreateArticle();

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!state.articleName.trim()) {
      newErrors.articleName = "기사 제목을 입력해주세요.";
    } else if (state.articleName.length < 2) {
      newErrors.articleName = "기사 제목은 2자 이상 입력해주세요.";
    }

    if (!state.articleDesc.trim()) {
      newErrors.articleDesc = "기사 내용을 입력해주세요.";
    } else if (state.articleDesc.length < 10) {
      newErrors.articleDesc = "기사 내용은 10자 이상 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state.articleName, state.articleDesc]);

  const handleImageChange = useCallback((file: File | string | null) => {
    setState(prev => ({
      ...prev,
      articleImage: file,
    }));
    // 이미지 에러가 있다면 제거
    if (errors.articleImage && file) {
      setErrors(prev => ({ ...prev, articleImage: undefined }));
    }
  }, [setState, errors.articleImage]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formData = {
      articleName: state.articleName.trim(),
      articleDesc: state.articleDesc.trim(),
      articleImage: state.articleImage,
    };

    createArticle(formData, {
      onSuccess: () => {
        setIsSubmitting(false);
        navigate('/article-management');
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error('기사 생성 실패:', error);
        Toast("기사 생성에 실패하였습니다.", {
          type: "error",
        })
      },
    });
  }, [validateForm, state, createArticle, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/article-management');
  }, [navigate]);

  const isFormDisabled: boolean = isPending || isSubmitting;

  return (
    <AllContainer>
      <AddContainer>
        <EditDiv
          value1="취소"
          value2={isFormDisabled ? "추가 중..." : "추가하기"}
          title="기사 추가"
          disabled={isFormDisabled}
          onCancel={handleCancel}
          onClick={handleSubmit}
        />
        <ContentContainer>
          <InputContainer>
            <InputWrapper>
              <Input
                value={state.articleName}
                name="articleName"
                type="text"
                onChange={onChangeInputValue}
                placeholder="기사 제목을 입력해 주세요.."
                label="기사 제목"
                disabled={isFormDisabled}
                aria-invalid={!!errors.articleName}
                aria-describedby={errors.articleName ? "title-error" : undefined}
              />
              {errors.articleName && (
                <ErrorMessage id="title-error" role="alert">
                  {errors.articleName}
                </ErrorMessage>
              )}
            </InputWrapper>
            <InputWrapper>
              <TextArea
                value={state.articleDesc}
                name="articleDesc"
                onChange={onChangeInputValue}
                placeholder="기사 내용을 입력해 주세요.."
                label="기사 내용"
                height={480}
                aria-invalid={!!errors.articleDesc}
                aria-describedby={errors.articleDesc ? "desc-error" : undefined}
              />
              {errors.articleDesc && (
                <ErrorMessage id="desc-error" role="alert">
                  {errors.articleDesc}
                </ErrorMessage>
              )}
            </InputWrapper>
            <InputWrapper>
              <ImgContainer
                label="기사 이미지"
                img={state.articleImage instanceof File ? URL.createObjectURL(state.articleImage) : state.articleImage || null}
                onImageChange={handleImageChange}
                aria-invalid={!!errors.articleImage}
                aria-describedby={errors.articleImage ? "image-error" : undefined}
              />
              {errors.articleImage && (
                <ErrorMessage id="image-error" role="alert">
                  {errors.articleImage}
                </ErrorMessage>
              )}
            </InputWrapper>
          </InputContainer>
        </ContentContainer>
      </AddContainer>
    </AllContainer>
  );
};

const AllContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: fit-content;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const InputWrapper = styled.div`
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
