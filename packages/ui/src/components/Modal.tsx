import { css } from "@emotion/react";
import { color } from "@mozu/design-token";
import { useRef } from "react";
import { Button } from "./Button";
import {
  buttonWrapperStyles,
  iconContentStyles,
  iconWrapperStyles,
  modalContainerStyles,
  modalLowerStyles,
  modalMainTitleStyles,
  modalSubTitleStyles,
  modalUpperStyles,
  modalWrapperStyles,
  titleWrapperStyles,
} from "./styles";
import type { ModalProps } from "./types";

/**
 * Modal 컴포넌트
 *
 * 삭제 확인, 완료 알림 등의 용도로 사용되는 모달 다이얼로그 컴포넌트입니다.
 * 백드롭 클릭 시 모달이 닫히며, 취소/확인 버튼을 제공합니다.
 *
 * @component
 * @example
 * // 삭제 확인 모달
 * <Modal
 *   mainTitle="정말 삭제하시겠습니까?"
 *   subTitle="삭제하면 복구가 불가능합니다."
 *   icon={<DeleteIcon />}
 *   type="delete"
 *   successBtnChildren="삭제하기"
 *   isOpen={isModalOpen}
 *   setIsOpen={setIsModalOpen}
 *   onSuccessClick={handleDelete}
 * />
 *
 * @example
 * // 완료 알림 모달
 * <Modal
 *   mainTitle="작업이 완료되었습니다"
 *   subTitle="성공적으로 처리되었습니다."
 *   icon={<CheckIcon />}
 *   type="complete"
 *   successBtnChildren="확인"
 *   isOpen={isModalOpen}
 *   setIsOpen={setIsModalOpen}
 *   onSuccessClick={handleConfirm}
 * />
 *
 * @param {ModalProps} props - Modal 컴포넌트의 props
 * @param {string} props.mainTitle - 모달의 주 제목
 * @param {string} [props.subTitle="삭제하면 복구가 불가능합니다."] - 모달의 부 제목 (선택적)
 * @param {React.ReactNode} props.icon - 모달 상단에 표시될 아이콘
 * @param {() => void} props.onSuccessClick - 확인 버튼 클릭 시 실행될 콜백 함수
 * @param {"delete" | "complete"} [props.type="delete"] - 모달 타입 (삭제/완료)
 * @param {string} [props.successBtnChildren="삭제하기"] - 확인 버튼 텍스트
 * @param {boolean} props.isOpen - 모달 열림/닫힘 상태
 * @param {boolean} props.isPending - 데이터 패칭중 상태
 * @param {(isOpen: boolean) => void} props.setIsOpen - 모달 상태를 변경하는 함수
 *
 * @returns {JSX.Element | null} 모달이 열린 상태일 때 JSX 요소, 닫힌 상태일 때 null
 */
export const Modal = ({
  mainTitle,
  subTitle = "삭제하면 복구가 불가능합니다.",
  icon,
  onSuccessClick,
  type = "delete",
  successBtnChildren = "삭제하기",
  isOpen,
  setIsOpen,
  isPending,
}: ModalProps) => {
  /**
   * 모달 상단 아이콘 래퍼 스타일
   * type 값에 따라 다른 스타일을 적용합니다.
   */
  const modalIconStyles = css`
    ${iconWrapperStyles[type]}
  `;

  /**
   * 모달 타입별 버튼 색상 매핑
   * - complete: 주황색 배경, 흰색 글씨
   * - delete: 빨간색 배경, 흰색 글씨
   */
  const buttonColorStyles = {
    complete: {
      backgroundColor: color.orange[500],
      color: color.white,
    },
    delete: {
      backgroundColor: `linear-gradient(135deg, ${color.red[500]} 0%, ${color.red[600]} 100%)`,
      color: color.white,
      boxShadow: `0 4px 12px rgba(239, 68, 68, 0.3)`,
    },
  } as const;

  /**
   * 모달 백드롭 요소에 대한 참조
   * 백드롭 클릭 감지를 위해 사용됩니다.
   */
  const backWrapperRef = useRef<HTMLDivElement | null>(null);

  /**
   * 취소 버튼 클릭 핸들러
   * 모달을 닫습니다.
   */
  const handleCancelClick = () => {
    setIsOpen(false);
  };

  /**
   * 백드롭 클릭 핸들러
   * 백드롭 영역을 클릭했을 때만 모달을 닫습니다.
   * 모달 컨테이너 내부 클릭 시에는 모달이 닫히지 않습니다.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - 마우스 이벤트 객체
   */
  const handleBackWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (backWrapperRef.current === e.target) {
      setIsOpen(false);
    }
  };

  return (
    isOpen && (
      // biome-ignore lint/a11y/noStaticElementInteractions: <임시>
      // biome-ignore lint/a11y/useKeyWithClickEvents: <임시>
      <div
        onClick={handleBackWrapperClick}
        ref={backWrapperRef}
        css={modalWrapperStyles}>
        <div css={modalContainerStyles}>
          {/* 모달 상단 영역 - 아이콘과 텍스트 */}
          <div css={modalUpperStyles}>
            <div css={modalIconStyles}>
              <div css={iconContentStyles}>{icon}</div>
            </div>
            <div css={titleWrapperStyles}>
              <div css={modalMainTitleStyles}>{mainTitle}</div>
              <div css={modalSubTitleStyles}>{subTitle}</div>
            </div>
          </div>
          {/* 모달 하단 영역 - 버튼들 */}
          <div css={modalLowerStyles}>
            <div css={buttonWrapperStyles}>
              <Button
                backgroundColor={color.white}
                color={color.zinc[700]}
                borderColor={color.zinc[200]}
                onClick={handleCancelClick}
                hoverBackgroundColor={color.zinc[50]}
                hoverBorderColor={color.zinc[300]}
                hoverColor={color.zinc[900]}>
                취소
              </Button>
              <Button
                backgroundColor={buttonColorStyles[type].backgroundColor}
                color={buttonColorStyles[type].color}
                onClick={onSuccessClick}
                hoverBackgroundColor={`linear-gradient(135deg, ${color.red[600]} 0%, ${color.red[700]} 100%)`}
                hoverBoxShadow={`0 8px 25px rgba(239, 68, 68, 0.3)`}
                disabled={isPending}>
                {successBtnChildren}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

Modal.displayName = "Modal";
