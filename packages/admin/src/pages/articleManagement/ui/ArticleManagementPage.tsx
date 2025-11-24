import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { Del, Modal, SelectError } from "@mozu/ui";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDeleteArticle } from "@/entities/article";
import { ArticleManagementDetail } from "@/features/articleCRUD";

export const ArticleManagementPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { id } = useParams();

  // URL 파라미터로 기사가 지정된 경우 자동 선택
  useEffect(() => {
    if (id) {
      setSelectedId(id);
    }
  }, [id]);

  const handleDetailClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const { mutate: delApiData, isPending } = useDeleteArticle(id, () => setIsModalOpen(false));

  const handleDelete = () => {
    if (id !== null) {
      delApiData();
    }
    setSelectedId(null);
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          mainTitle={"현재 선택된 기사를 삭제하실건가요?"}
          subTitle={"삭제하면 복구가 불가능합니다."}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          isPending={isPending}
          icon={
            <Del
              size={24}
              color={color.red[400]}
            />
          }
          onSuccessClick={handleDelete}
        />
      )}
      {selectedId ? <ArticleManagementDetail onClick={handleDetailClick} /> : <SelectError isStock={false} />}
    </>
  );
};
