import { color } from "@mozu/design-token";
import { Modal, SvgIcon } from "@mozu/ui";

interface ClassDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export const ClassDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: ClassDeleteModalProps) => {
  return (
    <Modal
      mainTitle={"이 수업을 삭제하시겠습니까?"}
      subTitle={"삭제하면 복구가 불가능합니다."}
      onSuccessClick={onConfirm}
      icon={
        <SvgIcon
          name="del"
          size={24}
          color={color.red[400]}
        />
      }
      isOpen={isOpen}
      setIsOpen={onClose}
      isPending={isPending}
    />
  );
};
