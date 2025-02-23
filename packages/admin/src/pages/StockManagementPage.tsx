import { stockManagementDel } from '@/apis';
import { StockManagementDetail, StockSearchSideBar } from '@/components';
import styled from '@emotion/styled';
import { SelectError, DeleteModal } from '@mozu/ui';
import { useState } from 'react';
import { useParams } from 'react-router';

export const StockManagementPage = () => {
  const [isSelect, setIsSelect] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 관리

  const {id} = useParams();
  const stockId = id? parseInt(id) : null;

  const handleDetailClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const delApiData = stockManagementDel();

  const handleDelete = () => {
    if(stockId) {
      delApiData.mutate(stockId);
    }
    setIsModalOpen(false); // 모달 닫기
    setIsSelect(false); //종목 선택으로 돌아가기
  };

  return (
    <Container>
      <StockSearchSideBar />
      {isSelect ? (
        <StockManagementDetail onClick={handleDetailClick} />
      ) : (
        <SelectError />
      )}
      {isModalOpen && (
        <DeleteModal
          titleComment={'삼성전자를 삭제하실선가요?'}
          subComment={'삭제하면 복구가 불가능합니다.'}
          onCancel={handleCloseModal} // 취소 동작
          onDelete={handleDelete} // 삭제 동작
        />
      )}
    </Container>
  );
};

// 스타일 정의
const Container = styled.div`
  width: 100%;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: row;
`;
