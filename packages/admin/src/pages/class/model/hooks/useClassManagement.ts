import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetClassList } from "@/entities/class";
import { useClassDelete } from "@/features/classDelete";
import { useClassListFiltering } from "@/features/classListFiltering";
import { useClassToggleStar } from "@/features/classToggleStar";

export const useClassManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading: apiLoading, refetch } = useGetClassList();

  const { favorites, common } = useClassListFiltering(data);

  const { toggleFavorite, isLoading: isStarLoading } = useClassToggleStar(() => refetch());

  const {
    isModalOpen,
    setIsModalOpen,
    isPending: isDeletePending,
    openDeleteModal,
    handleDelete,
  } = useClassDelete(() => refetch());

  const [isLodaingComplete, setIsLoadingComplete] = useState(true);

  useEffect(() => {
    if (!apiLoading && data) {
      setTimeout(() => {
        setIsLoadingComplete(false);
      }, 500);
    }
  }, [
    apiLoading,
    data,
  ]);

  return {
    isEmpty: data?.lessons.length === 0,
    favorites,
    common,
    isLoading: isLodaingComplete,
    isStarLoading,
    isDeletePending,
    isModalOpen,
    onToggleStar: toggleFavorite,
    onDeleteClick: openDeleteModal,
    onDelete: handleDelete,
    onCloseDeleteModal: () => setIsModalOpen(false),
    onNavigate: navigate,
  };
};
