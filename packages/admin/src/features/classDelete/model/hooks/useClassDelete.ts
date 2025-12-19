import { useCallback, useState } from "react";
import { useDeleteClass } from "@/entities/class";

export const useClassDelete = (onSuccess?: () => void) => {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: delClassApi, isPending } = useDeleteClass(selectedClassId, () => {
    setIsModalOpen(false);
    onSuccess?.();
  });

  const openDeleteModal = useCallback((classId: string) => {
    setSelectedClassId(classId);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedClassId) {
      delClassApi();
    }
  }, [
    selectedClassId,
    delClassApi,
  ]);

  return {
    isModalOpen,
    setIsModalOpen,
    selectedClassId,
    isPending,
    openDeleteModal,
    handleDelete,
  };
};
