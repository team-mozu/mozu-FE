import { articleManagementDel } from '@/apis';
import { ArticleSearchSideBar, ArticleManagementDetail } from '@/components';
import styled from '@emotion/styled';
import { SelectError, DeleteModal } from '@mozu/ui';
import { useState } from 'react';
import { useParams } from 'react-router';

export const ArticleManagementPage = () => {
  const [isSelect, setIsSelect] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 관리

  const {id} = useParams();
  const articleId = id? parseInt(id) : null;

  const handleDetailClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const apiData = articleManagementDel();
  
  const handleDelete = (articleId: number) => {
    if(articleId) {
      apiData.mutate(articleId);
    }
    setIsModalOpen(false); // 모달 닫기
    setIsSelect(false)
  };

  return (
    <Container>
      <ArticleSearchSideBar />
      {isSelect ? (
        <ArticleManagementDetail onClick={handleDetailClick} />
      ) : (
        <SelectError />
      )}
      {isModalOpen && (
        <DeleteModal
          titleComment={'현재 선택된 기사를 삭제하실건가요?'}
          subComment={'삭제하면 복구가 불가능합니다.'}
          onCancel={handleCloseModal} // 취소 동작
          onDelete={() => handleDelete(articleId)} // 삭제 동작
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
