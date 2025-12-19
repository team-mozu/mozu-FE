import { color } from "@mozu/design-token";
import { Modal, SelectError, SvgIcon } from "@mozu/ui";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDeleteStock, useGetStockDetail } from "@/entities/stock";
import { StockManagementDetail } from "@/features/stockCRUD";

export const StockManagementPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { id } = useParams();
  const stockId = Number(id);

  const stockDelete = useDeleteStock(stockId, () => {
    setIsModalOpen(false);
  });
  const { data: stockData } = useGetStockDetail(stockId);

  // URL 파라미터로 종목이 지정된 경우 자동 선택
  useEffect(() => {
    if (stockId) {
      setSelectedId(stockId);
    }
  }, [
    stockId,
  ]);

  const handleDetailClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedId !== null) {
      stockDelete.mutate();
    }
    setSelectedId(null);
  }, [
    selectedId,
    stockDelete,
  ]);

  return (
    <>
      {isModalOpen && (
        <Modal
          mainTitle={`${stockData?.itemName}를 삭제하실선가요?`}
          subTitle={"삭제하면 복구가 불가능합니다."}
          onSuccessClick={handleDelete}
          icon={
            <SvgIcon
              name="del"
              size={24}
              color={color.red[400]}
            />
          }
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          isPending={stockDelete.isPending}
        />
      )}
      {selectedId ? <StockManagementDetail onClick={handleDetailClick} /> : <SelectError isStock={true} />}
    </>
  );
};
