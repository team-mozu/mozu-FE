import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { Del, Modal, SelectError } from "@mozu/ui";
import { useState } from "react";
import { useParams } from "react-router";
import { useDeleteStock, useGetStockDetail } from "@/apis";
import { FullPageLoader, StockManagementDetail, StockSearchSideBar } from "@/components";

export const StockManagementPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { id } = useParams();
  const stockId = id ? parseInt(id) : null;

  const { mutate: stockDelete, isPending } = useDeleteStock(() => setIsModalOpen(false));
  const { data: stockData } = useGetStockDetail(stockId);

  const handleDetailClick = () => {
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedId !== null) {
      stockDelete(stockId ?? 0);
    }
    setSelectedId(null);
  };


  return (
    <>
      {isModalOpen && (
        <Modal
          mainTitle={`${stockData?.name}를 삭제하실선가요?`}
          subTitle={"삭제하면 복구가 불가능합니다."}
          onSuccessClick={handleDelete}
          icon={
            <Del
              size={24}
              color={color.red[400]}
            />
          }
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          isPending={isPending}
        />
      )}
      <Container>
        <StockSearchSideBar
          setSelectedId={setSelectedId}
          selectedId={selectedId}
        />
        {selectedId ? <StockManagementDetail onClick={handleDetailClick} /> : <SelectError isStock={true} />}
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
