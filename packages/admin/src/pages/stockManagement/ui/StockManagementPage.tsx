import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { Del, Modal, SelectError } from "@mozu/ui";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDeleteStock, useGetStockDetail } from "@/entities/stock";
import { StockManagementDetail, StockSearchSideBar } from "@/features/stockCRUD";

// 데스크탑 반응형 브레이크포인트
const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

export const StockManagementPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { id } = useParams();
  const stockId = Number(id);

  const stockDelete = useDeleteStock(stockId, () => { setIsModalOpen(false) });
  const { data: stockData } = useGetStockDetail(stockId);

  // URL 파라미터로 종목이 지정된 경우 자동 선택
  useEffect(() => {
    if (id && stockId) {
      setSelectedId(stockId);
    }
  }, [id, stockId]);

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
            <Del
              size={24}
              color={color.red[400]}
            />
          }
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          isPending={stockDelete.isPending}
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
  min-width: 0; /* flexbox 자식 요소의 너비 자동 축소 */

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    height: calc(100vh - 60px);
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    height: calc(100vh - 62px);
  }
`;
