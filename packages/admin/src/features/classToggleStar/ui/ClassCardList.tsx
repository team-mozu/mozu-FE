import styled from "@emotion/styled";
import type { LessonGetListResponse } from "@/entities/class/api/type";
import { ClassCard } from "./ClassCard";
import { SkeletonClassCard } from "./SkeletonClassCard";
import { SkeletonClassCardList } from "./SkeletonClassCardList";

interface ClassCardListProps {
  items: LessonGetListResponse["lessons"];
  isLoading?: boolean;
  onStarClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onCardClick: (id: string) => void;
}

export const ClassCardList = ({ items, isLoading, onStarClick, onDeleteClick, onCardClick }: ClassCardListProps) => {
  if (isLoading) {
    return <SkeletonClassCardList count={items.length} />;
  }

  return (
    <CardListContainer>
      {items.map((item, index) => (
        <div key={item.id}>
          {isLoading && index < 3 ? (
            <SkeletonClassCard />
          ) : (
            <ClassCard
              key={item.id}
              item={item}
              isStarred={item.isStarred}
              isLoading={isLoading}
              onStarClick={() => onStarClick(item.id)}
              onDeleteClick={() => onDeleteClick(item.id)}
              onClick={() => onCardClick(item.id)}
            />
          )}
        </div>
      ))}
    </CardListContainer>
  );
};

const CardListContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.25rem;
`;
