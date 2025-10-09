import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useCreateClass } from "@/entities/class";
import type { LessonCreateRequest } from "@/entities/class/api/type";
import { useArticle } from "@/shared/lib";
import { useClassForm } from "./useClassForm";
import { useClassItems } from "./useClassItems";

/**
 * 수업 생성의 전체 플로우를 관리하는 커스텀 훅
 */
export const useClassCreation = () => {
  const navigate = useNavigate();
  const { classArticles, resetArticles } = useArticle();

  const { formData, updateLessonName, updateLessonRound, updateBaseMoney, validateForm, resetForm } = useClassForm();

  const {
    classItems,
    stockTableData,
    addItems,
    removeItems,
    updateItemPrice,
    adjustAllItemsForNewRound,
    getApiRequestData,
    resetItems,
    validateItems,
  } = useClassItems(formData.lessonRound);

  const { mutate: createClass, isPending } = useCreateClass();

  /**
   * 투자 차수 변경 시 아이템 데이터도 함께 조정
   */
  const handleLessonRoundChange = useCallback(
    (round: number) => {
      updateLessonRound(round);
      adjustAllItemsForNewRound();
    },
    [
      updateLessonRound,
      adjustAllItemsForNewRound,
    ],
  );

  /**
   * 전체 폼 검증
   */
  const validateAll = useCallback(() => {
    const formValidation = validateForm();
    const itemsValidation = validateItems();

    const allErrors = [
      ...formValidation.errors,
      ...itemsValidation.errors,
    ];

    return {
      isValid: formValidation.isValid && itemsValidation.isValid,
      errors: allErrors,
    };
  }, [
    validateForm,
    validateItems,
  ]);

  /**
   * 전체 상태 초기화
   */
  const resetAll = useCallback(() => {
    resetForm();
    resetItems();
    resetArticles();
  }, [
    resetForm,
    resetItems,
    resetArticles,
  ]);

  /**
   * 수업 생성 제출
   */
  const handleSubmit = useCallback(() => {
    const validation = validateAll();

    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    const requestData: LessonCreateRequest = {
      lessonName: formData.lessonName,
      baseMoney: formData.baseMoney,
      lessonRound: formData.lessonRound,
      lessonItems: getApiRequestData(),
      lessonArticles: classArticles.map(group => ({
        investmentRound: group.invDeg,
        articles: group.articles.map(article => article.articleId), // LessonArticle[]에서 articleId만 추출
      })),
    };

    createClass(requestData, {
      onSuccess: () => {
        resetAll();
        navigate("/class-management");
      },
      onError: error => {
        console.error("수업 생성 실패:", error);
        alert("수업 생성에 실패했습니다.");
      },
    });
  }, [
    validateAll,
    formData,
    getApiRequestData,
    classArticles,
    createClass,
    navigate,
    resetAll,
  ]);

  /**
   * 취소 처리
   */
  const handleCancel = useCallback(() => {
    resetAll();
    navigate(-1);
  }, [
    resetAll,
    navigate,
  ]);

  return {
    // 폼 데이터
    formData,
    classItems,
    stockTableData,
    classArticles,

    // 폼 핸들러
    updateLessonName,
    handleLessonRoundChange,
    updateBaseMoney,

    // 아이템 핸들러
    addItems,
    removeItems,
    updateItemPrice,

    // 제출/취소
    handleSubmit,
    handleCancel,

    // 상태
    isPending,
    validateAll,
  };
};
