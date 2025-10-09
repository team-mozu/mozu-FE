import { useCallback, useState } from "react";

/**
 * 수업 생성 폼의 기본 데이터를 관리하는 커스텀 훅
 */
export const useClassForm = () => {
  const [formData, setFormData] = useState({
    lessonName: "",
    lessonRound: 3,
    baseMoney: 1000000,
  });

  /**
   * 수업 이름 변경 핸들러
   */
  const updateLessonName = useCallback((name: string) => {
    setFormData(prev => ({
      ...prev,
      lessonName: name,
    }));
  }, []);

  /**
   * 투자 차수 변경 핸들러
   */
  const updateLessonRound = useCallback((round: number) => {
    setFormData(prev => ({
      ...prev,
      lessonRound: round,
    }));
  }, []);

  /**
   * 기초자산 변경 핸들러
   */
  const updateBaseMoney = useCallback((money: number) => {
    setFormData(prev => ({
      ...prev,
      baseMoney: money,
    }));
  }, []);

  /**
   * 폼 데이터 검증
   */
  const validateForm = useCallback(() => {
    const errors: string[] = [];

    if (!formData.lessonName.trim()) {
      errors.push("수업 이름을 입력해주세요.");
    }

    if (formData.baseMoney <= 0) {
      errors.push("기초자산은 0보다 커야 합니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [
    formData,
  ]);

  /**
   * 폼 데이터 초기화
   */
  const resetForm = useCallback(() => {
    setFormData({
      lessonName: "",
      lessonRound: 3,
      baseMoney: 1000000,
    });
  }, []);

  return {
    formData,
    updateLessonName,
    updateLessonRound,
    updateBaseMoney,
    validateForm,
    resetForm,
  };
};
