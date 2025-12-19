import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, SvgIcon } from "@mozu/ui";
import type { LessonGetListResponse } from "@/entities/class/api/type";

interface ClassCardProps {
  item: LessonGetListResponse["lessons"][0];
  isStarred: boolean;
  onStarClick: () => void;
  onDeleteClick: () => void;
  onClick: () => void;
  isLoading?: boolean;
}

export const ClassCard = ({
  item,
  isStarred,
  onStarClick,
  onDeleteClick,
  onClick,
  isLoading = false,
}: ClassCardProps) => {
  return (
    <ClassCardContainer onClick={onClick}>
      <ClassCardWrapper>
        <ClassCardHeader>
          <ClassCardTitleSection>
            <ClassCardTitle>{item.name}</ClassCardTitle>
            <ClassCardCreationDate>생성일자 | {item.date}</ClassCardCreationDate>
          </ClassCardTitleSection>
          <StarButton
            onClick={(e) => {
              e.stopPropagation();
              onStarClick();
            }}
            aria-label={isStarred ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            disabled={isLoading}
          >
            <SvgIcon name={isStarred ? "fill-star" : "star"} size={20} />
          </StarButton>
        </ClassCardHeader>

        <ClassCardFooter>
          <Button
            backgroundColor={color.zinc[50]}
            color={color.zinc[800]}
            borderColor={color.zinc[200]}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
            hoverBackgroundColor={color.zinc[100]}
          >
            삭제하기
          </Button>
        </ClassCardFooter>
      </ClassCardWrapper>
    </ClassCardContainer>
  );
};

const ClassCardContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 156px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  background-color: ${color.white};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const ClassCardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ClassCardHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const ClassCardTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
`;

const ClassCardTitle = styled.div`
  font: ${font.h4};
  color: ${color.black};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
`;

const ClassCardCreationDate = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
`;

const StarButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }
`;

const ClassCardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;