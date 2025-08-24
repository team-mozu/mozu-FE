import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { Del, Modal, SelectError } from "@mozu/ui";
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

  const { mutate: delApiData, isPending } = useDeleteArticle(() => setIsModalOpen(false));

  const handleDelete = () => {
    if (articleId !== null) {
      delApiData(articleId);
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
      <Container>
        <ArticleSearchSideBar
          setSelectedId={setSelectedId}
          selectedId={selectedId}
        />
        {selectedId ? <ArticleManagementDetail onClick={handleDetailClick} /> : <SelectError isStock={false} />}
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
`;
