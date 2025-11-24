import styled from "@emotion/styled";
import { zodResolver } from "@hookform/resolvers/zod";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea, Toast } from "@mozu/ui";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useCreateArticle } from "@/entities/article";
import { ImgContainer } from "@/features/articleCRUD/ui";

const articleSchema = z.object({
  articleName: z
    .string()
    .min(1, "기사 제목을 입력해주세요.")
    .min(2, "기사 제목은 2자 이상 입력해주세요.")
    .max(300, "기사 제목은 300자 이하로 입력해주세요."),
  articleDesc: z
    .string()
    .min(1, "기사 내용을 입력해주세요.")
    .min(10, "기사 내용은 10자 이상 입력해주세요.")
    .max(10000, "기사 내용은 10,000자 이하로 입력해주세요."),
  articleImage: z
    .union([
      z.instanceof(File),
      z.string(),
      z.literal(null),
      z.literal("DELETE")
    ])
    .optional()
    .refine((value) => value instanceof File || value === null || value === "DELETE", {
      message: "기사 이미지를 선택해주세요."
    }),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export const ArticleManagementAddPage = () => {
  const navigate = useNavigate();

  const methods = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      articleName: "",
      articleDesc: "",
      articleImage: null,
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const { mutate: createArticle, isPending } = useCreateArticle({
    onSuccess: (response) => {
      Toast("기사가 성공적으로 생성되었습니다.", { type: "success" });
      navigate(`/article-management/${response.id}`);
    },
    onError: (error) => {
      Toast("기사 생성에 실패했습니다.", { type: "error" });
      console.error("기사 생성 오류:", error);
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    const payload: {
      articleName: string;
      articleDesc: string;
      articleImage?: File;
    } = {
      articleName: data.articleName.trim(),
      articleDesc: data.articleDesc.trim(),
    };

    if (data.articleImage instanceof File) {
      payload.articleImage = data.articleImage;
    }

    createArticle(payload);
  };

  const isFormDisabled = isPending || isSubmitting;

  return (
    <Container>
      <EditDiv
        value1="취소"
        value2={isFormDisabled ? "추가 중..." : "추가하기"}
        title="기사 추가"
        disabled={isFormDisabled}
        onCancel={() => navigate("/article-management")}
        onClick={handleSubmit(onSubmit)}
      />
      <FormContainer>
        <FormProvider {...methods}>
          <InputWrapper>
            <Controller
              name="articleName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  state={errors.articleName ? "error" : "default"}
                  placeholder="기사 제목을 입력해 주세요.."
                  label="기사 제목"
                  disabled={isFormDisabled}
                  aria-invalid={!!errors.articleName}
                  aria-describedby={errors.articleName ? "title-error" : undefined}
                />
              )}
            />
            {errors.articleName && (
              <ErrorMessage
                id="title-error"
                role="alert">
                {errors.articleName.message}
              </ErrorMessage>
            )}
          </InputWrapper>
          <InputWrapper>
            <Controller
              name="articleDesc"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  state={errors.articleDesc ? "error" : "default"}
                  placeholder="기사 내용을 입력해 주세요.."
                  label="기사 내용"
                  height={480}
                  disabled={isFormDisabled}
                  aria-invalid={!!errors.articleDesc}
                  aria-describedby={errors.articleDesc ? "desc-error" : undefined}
                />
              )}
            />
            {errors.articleDesc && (
              <ErrorMessage
                id="desc-error"
                role="alert">
                {errors.articleDesc.message}
              </ErrorMessage>
            )}
          </InputWrapper>
          <InputWrapper>
            <Controller
              name="articleImage"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ImgContainer
                  label="기사 이미지"
                  img={
                    value instanceof File
                      ? URL.createObjectURL(value)
                      : value || null
                  }
                  onImageChange={(file) => {
                    if (file === "DELETE") {
                      onChange(null);
                      setValue("articleImage", null);
                      return;
                    }
                    onChange(file);
                    setValue("articleImage", file);
                  }}
                  aria-invalid={!!errors.articleImage}
                  aria-describedby={errors.articleImage ? "image-error" : undefined}
                />
              )}
            />
            {errors.articleImage && (
              <ErrorMessage
                id="image-error"
                role="alert">
                {errors.articleImage.message}
              </ErrorMessage>
            )}
          </InputWrapper>
        </FormProvider>
      </FormContainer>
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

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${color.white};
  border-radius: 1rem;
  border: 1px solid ${color.zinc[200]};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: hidden;
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
