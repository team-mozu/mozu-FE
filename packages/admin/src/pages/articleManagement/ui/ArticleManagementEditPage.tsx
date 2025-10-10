import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { EditDiv, Input, TextArea, Toast } from "@mozu/ui";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useArticleUpdate, useGetArticleDetail } from "@/entities/article";
import { ImgContainer } from "@/features/articleCRUD";

interface FormErrors {
  articleName?: string;
  articleDesc?: string;
  articleImage?: string;
}

export const ArticleManagementEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [datas, setDatas] = useState<{
    articleName: string;
    articleDesc: string;
    articleImage?: string | null | File | "DELETE";
  }>({
    articleName: "",
    articleDesc: "",
    articleImage: null,
  });

  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const { data: articleData } = useGetArticleDetail(id);

  useEffect(() => {
    if (articleData) {
      const originalImg = articleData.articleImg || null;
      setDatas({
        articleName: articleData.articleName || "",
        articleDesc: articleData.articleDesc || "",
        articleImage: originalImg,
      });
      setOriginalImage(originalImg);
    }
  }, [articleData]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!datas.articleName.trim()) {
      newErrors.articleName = "기사 제목을 입력해주세요.";
    } else if (datas.articleName.length < 2) {
      newErrors.articleName = "기사 제목은 2자 이상 입력해주세요.";
    }

    if (!datas.articleDesc.trim()) {
      newErrors.articleDesc = "기사 내용을 입력해주세요.";
    } else if (datas.articleDesc.length < 10) {
      newErrors.articleDesc = "기사 내용은 10자 이상 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [datas.articleName, datas.articleDesc]);

  const titleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDatas(prev => ({
      ...prev,
      articleName: e.target.value,
    }));
    // 에러가 있다면 제거
    if (errors.articleName && e.target.value.trim()) {
      setErrors(prev => ({ ...prev, articleName: undefined }));
    }
  }, [errors.articleName]);

  const contentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDatas(prev => ({
      ...prev,
      articleDesc: e.target.value,
    }));
    // 에러가 있다면 제거
    if (errors.articleDesc && e.target.value.trim()) {
      setErrors(prev => ({ ...prev, articleDesc: undefined }));
    }
  }, [errors.articleDesc]);

  const handleImageChange = useCallback((file: File | string | null | "DELETE") => {
    if (file === "DELETE") {
      setDatas(prev => ({
        ...prev,
        articleImage: null,
      }));
    } else {
      setDatas(prev => ({
        ...prev,
        articleImage: file,
      }));
    }
    
    if (errors.articleImage && (file && file !== "DELETE")) {
      setErrors(prev => ({ ...prev, articleImage: undefined }));
    }
  }, [errors.articleImage]);

  const handleCancel = useCallback(() => {
    navigate('/article-management');
  }, [navigate]);

  const formData = {
    articleName: datas.articleName.trim(),
    articleDesc: datas.articleDesc.trim(),
    articleImage: (() => {
      if (datas.articleImage === "DELETE") {
        return ""; // 명시적 삭제
      } else if (datas.articleImage === originalImage) {
        return null; // 변경없음
      } else {
        return datas.articleImage; // 새 파일 또는 null
      }
    })(),
  };

  const { mutate: updateArticle, isPending } = useArticleUpdate(id, formData);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    updateArticle(undefined, {
      onSuccess: () => {
        setIsSubmitting(false);
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error('기사 수정 실패:', error);
        Toast("기사 수정에 실패하였습니다.", {
          type: "error",
        });
      },
    });
  }, [validateForm, updateArticle]);

  const isFormDisabled: boolean = isPending || isSubmitting;

  return (
    <AllContainer>
      <AddContainer>
        <EditDiv
          value1="취소"
          value2={isFormDisabled ? "수정 중..." : "수정하기"}
          title="기사 수정"
          disabled={isFormDisabled}
          onCancel={handleCancel}
          onClick={handleSubmit}
        />
        <ContentContainer>
          <InputContainer>
            <InputWrapper>
              <Input
                value={datas.articleName}
                name="articleName"
                type="text"
                onChange={titleChange}
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
                value={datas.articleDesc}
                name="articleDesc"
                onChange={contentChange}
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
                img={datas.articleImage instanceof File ? URL.createObjectURL(datas.articleImage) : (typeof datas.articleImage === "string" && datas.articleImage !== "DELETE") ? datas.articleImage : null}
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
