export interface ModalProps {
  mainTitle: string;
  subTitle?: string;
  icon: React.ReactNode;
  onSuccessClick: () => void;
  type?: "complete" | "delete";
  successBtnChildren?: string;
  isOpen?: boolean;
  isPending: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
