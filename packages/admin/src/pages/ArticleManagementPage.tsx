import styled from "@emotion/styled";
import { DeleteModal, SelectError } from "@mozu/ui";
import { useState } from "react";
import { useParams } from "react-router";
import { useDeleteArticle } from "@/apis";
import { ArticleManagementDetail, ArticleSearchSideBar } from "@/components";

export const ArticleManagementPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { classId, id } = useParams();
  const articleId = id ? parseInt(id) : null;

  const handleDetailClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const delApiData = useDeleteArticle();

  const isDeleting = delApiData.isPending;

  const handleDelete = (articleId: number) => {
    if (delApiData.isPending) {
      return;
    }

    if (articleId) {
      delApiData.mutate(articleId);
    }
    setIsModalOpen(false);
    setSelectedId(null);
  };

  return (
    <Container>
      <ArticleSearchSideBar
        setSelectedId={setSelectedId}
        selectedId={selectedId}
      />
      {selectedId ? <ArticleManagementDetail onClick={handleDetailClick} /> : <SelectError isStock={false} />}
      {isModalOpen && (
        <DeleteModal
          titleComment={"현재 선택된 기사를 삭제하실건가요?"}
          subComment={"삭제하면 복구가 불가능합니다."}
          onCancel={handleCloseModal}
          isPending={isDeleting}
          onDelete={() => handleDelete(articleId)}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
`;
