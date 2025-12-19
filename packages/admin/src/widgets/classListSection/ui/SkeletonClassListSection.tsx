import styled from "@emotion/styled";
import { PostTitle } from "@mozu/ui";
import { SkeletonClassCardList } from "@/features/classToggleStar";

interface SkeletonClassListSectionProps {
  count?: number;
}

export const SkeletonClassListSection = ({ count = 8 }: SkeletonClassListSectionProps) => {
  return (
    <SectionContainer>
      <PostTitle
        title="전체"
        count={0}
      />
      <SkeletonClassCardList count={count} />
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
