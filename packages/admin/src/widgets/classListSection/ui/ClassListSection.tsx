import styled from "@emotion/styled";
import { PostTitle } from "@mozu/ui";
import type { LessonGetListResponse } from "@/entities/class/api/type";
import { ClassCardList } from "@/features/classToggleStar";

interface ClassListSectionProps {
  title: string;
  items: LessonGetListResponse["lessons"];
  isLoading?: boolean;
  onStarClick: (classId: string) => void;
  onDeleteClick: (classId: string) => void;
  onCardClick: (classId: string) => void;
}

export const ClassListSection = ({
  title,
  items,
  isLoading,
  onStarClick,
  onDeleteClick,
  onCardClick,
}: ClassListSectionProps) => {
  return (
    <SectionContainer>
      <PostTitle
        title={title}
        count={items.length}
      />
      <ClassCardList
        items={items}
        isLoading={isLoading}
        onStarClick={onStarClick}
        onDeleteClick={onDeleteClick}
        onCardClick={onCardClick}
      />
    </SectionContainer>
  );
};

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
`;
