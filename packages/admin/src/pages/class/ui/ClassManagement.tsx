import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { useNavigate } from "react-router-dom";
import { ClassDeleteModal } from "@/features/classDelete";
import { ClassListSection, SkeletonClassListSection } from "@/widgets/classListSection";
import { ClassManagementTitleBar } from "@/widgets/classManagement";
import { EmptyState } from "@/widgets/emptyState";
import { useClassManagement } from "../model/hooks/useClassManagement";

export const ClassManagement = () => {
  const {
    isEmpty,
    favorites,
    common,
    isLoading,
    isDeletePending,
    isModalOpen,
    onToggleStar,
    onDeleteClick,
    onDelete,
    onCloseDeleteModal,
  } = useClassManagement();

  const navigate = useNavigate();

  const renderContent = () => {
    if (isLoading) {
      return (
        <PostAllContainer>
          <SkeletonClassListSection count={8} />
        </PostAllContainer>
      );
    }

    if (isEmpty) {
      return (
        <EmptyState
          title="생성한 수업이 없습니다"
          subTitle="첫 번째 수업을 만들어보세요"
          buttonText="수업 만들러 가기"
          onButtonClick={() => navigate("create")}
        />
      );
    }

    return (
      <PostAllContainer>
        {favorites.length > 0 && (
          <ClassListSection
            title="즐겨찾기"
            items={favorites}
            isLoading={isLoading}
            onStarClick={onToggleStar}
            onDeleteClick={onDeleteClick}
            onCardClick={(id) => navigate(`${id}`)}
          />
        )}
        <ClassListSection
          title="전체"
          items={common}
          isLoading={isLoading}
          onStarClick={onToggleStar}
          onDeleteClick={onDeleteClick}
          onCardClick={(id) => navigate(`${id}`)}
        />
      </PostAllContainer>
    );
  };

  return (
    <>
      <ClassDeleteModal
        isOpen={isModalOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onDelete}
        isPending={isDeletePending}
      />
      <ClassManagementContent>
        <ClassManagementTitleBar
          title="수업 관리"
          subTitle="수업 환경을 만들어 사용해 보세요."
          buttonText="수업 생성하기"
          buttonClick={() => navigate("create")}
        />

        <ContentContainer>
          {renderContent()}
        </ContentContainer>
      </ClassManagementContent >
    </>
  );
};

const ClassManagementContent = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2.4rem;
`;

const PostAllContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 2.5rem;
  gap: 2.5rem;
`;

const ContentContainer = styled.div`
  min-height: calc(100vh - 40px);
  height: auto;
  width: 100%;
  border-radius: 1.5rem;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
`;
