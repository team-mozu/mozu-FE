import { useDeleteStock } from '@/apis';
import { StockManagementDetail, StockSearchSideBar } from '@/components';
import styled from '@emotion/styled';
import { SelectError, DeleteModal } from '@mozu/ui';
import { useState } from 'react';
import { useParams } from 'react-router';

export const StockManagementPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { id } = useParams();
  const stockId = id ? parseInt(id) : null;

  const handleDetailClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const delApiData = useDeleteStock();

  const handleDelete = () => {
    if (stockId) {
      delApiData.mutate(stockId);
    }
    setIsModalOpen(false);
    setSelectedId(null);
  };

  return (
    <Container>
      <StockSearchSideBar
        setSelectedId={setSelectedId}
        selectedId={selectedId}
      />
      {selectedId ? (
        <StockManagementDetail onClick={handleDetailClick} />
      ) : (
        <SelectError isStock={true} />
      )}
      {isModalOpen && (
        <DeleteModal
          titleComment={'삼성전자를 삭제하실선가요?'}
          subComment={'삭제하면 복구가 불가능합니다.'}
          onCancel={handleCloseModal}
          onDelete={handleDelete}
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
