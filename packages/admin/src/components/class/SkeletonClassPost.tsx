import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { Skeleton } from "../../../../design-token/src/theme/Skeleton";

interface IPostType {
  title: string;
  creationDate: string;
  onClick?: () => void;
}

export const SkeletonClassPost = ({
  onClick,
  title,
  creationDate,
}: IPostType) => {
  return (
    <PostContainer onClick={onClick}>
      <ContentContainer>
        <TitleIconContainer>
          <TilteContainer>
            <Title>{title}</Title>
            <CreationDate>생성일자 | {creationDate}</CreationDate>
          </TilteContainer>
          <StarDiv />
        </TitleIconContainer>
        <ButtonDiv />
      </ContentContainer>
    </PostContainer>
  );
};

const ButtonDiv = styled(Skeleton)`
  width: 90px;
  height: 42px;
  border-radius: 8px;
`;

const StarDiv = styled(Skeleton)`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

const PostContainer = styled.div`
  cursor: pointer;
  width: 480px;
  height: 156px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  background-color: ${color.white};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Skeleton)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 336px;
  color: transparent;
`;

const CreationDate = styled(Skeleton)`
  width: fit-content;
  color: transparent;
`;

const TilteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

const TitleIconContainer = styled.div`
  width: 432px;
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: end;
`;
