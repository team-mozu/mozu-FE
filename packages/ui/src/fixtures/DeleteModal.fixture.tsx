import { useState } from "react";
import { DeleteModal } from "../components/DeleteModal";

export default {
  "Default Delete Modal": () => {
    const [isPending, setIsPending] = useState(false);
    const onCancel = () => console.log("Cancel clicked");
    const onDelete = () => {
      setIsPending(true);
      setTimeout(() => {
        console.log("Delete clicked");
        setIsPending(false);
      }, 1000);
    };

    return (
      <DeleteModal
        titleComment="정말 삭제하시겠습니까?"
        subComment="삭제된 항목은 복구할 수 없습니다."
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={isPending}
      />
    );
  },
  "Custom Message Delete Modal": () => {
    const [isPending, setIsPending] = useState(false);
    const onCancel = () => console.log("Cancel clicked");
    const onDelete = () => {
      setIsPending(true);
      setTimeout(() => {
        console.log("Confirm clicked");
        setIsPending(false);
      }, 1000);
    };

    return (
      <DeleteModal
        titleComment="변경사항을 저장하시겠습니까?"
        subComment="저장하지 않은 변경사항은 유실됩니다."
        onCancel={onCancel}
        onDelete={onDelete}
        isPending={isPending}
        message="확인"
      />
    );
  },
};
