import { useDeleteStock } from '@/apis';
import { StockManagementDetail, StockSearchSideBar } from '@/components';
import styled from '@emotion/styled';
import { SelectError, DeleteModal } from '@mozu/ui';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export const StockManagementPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const stockId = id ? parseInt(id) : null;

  const { mutate: stockDelete } = useDeleteStock(selectedId);

  const handleDetailClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedId) {
      stockDelete(undefined, {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedId(null); // 선택 해제
        },
      });
    }
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
