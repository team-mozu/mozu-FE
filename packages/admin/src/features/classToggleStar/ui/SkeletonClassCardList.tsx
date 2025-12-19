import styled from "@emotion/styled";
import { SkeletonClassCard } from "./SkeletonClassCard";

interface SkeletonClassCardListProps {
  count?: number;
}

export const SkeletonClassCardList = ({ count = 8 }: SkeletonClassCardListProps) => {
  return (
    <ListContainer>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonClassCard key={index} />
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
`;
