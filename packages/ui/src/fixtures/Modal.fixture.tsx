import { color } from "@mozu/design-token";
import { useState } from "react";
import { Button, Modal, SvgIcon } from "@/components";

export default {
  "Delete Modal": () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleDelete = async () => {
      setIsPending(true);
      await new Promise(r => setTimeout(r, 1000));
      console.log("삭제 완료");
      setIsPending(false);
      setIsOpen(false);
    };

    return (
      <div>
        {isOpen && (
          <Modal
            mainTitle={"현재 선택된 기사를\n 삭제하실건가요?"}
            subTitle="삭제하면 복구가 불가능합니다."
            icon={
              <SvgIcon
                name="del"
                size={24}
                color={color.red[500]}
              />
            }
            type="delete"
            successBtnChildren="삭제하기"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSuccessClick={handleDelete}
            isPending={isPending}
          />
        )}
        <Button onClick={() => setIsOpen(true)}>click</Button>
      </div>
    );
  },
  "Complete Modal": () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleComplete = async () => {
      setIsPending(true);
      await new Promise(r => setTimeout(r, 1000));
      console.log("투자 완료");
      setIsPending(false);
      setIsOpen(false);
    };

    return (
      <div>
        {isOpen && (
          <Modal
            isPending={isPending}
            mainTitle="투자를 완료하실 건가요?"
            subTitle="투자를 완료하면 주문을 변경할 수 없어요."
            icon={
              <SvgIcon
                name="check"
                size={24}
                color={color.orange[500]}
              />
            }
            type="complete"
            successBtnChildren="투자 완료하기"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSuccessClick={handleComplete}
          />
        )}
        <Button onClick={() => setIsOpen(true)}>click</Button>
      </div>
    );
  },
};
