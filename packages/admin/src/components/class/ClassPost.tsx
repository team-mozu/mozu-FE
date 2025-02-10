import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Button, Star } from '@mozu/ui';

interface IClassPostType {
  title: string;
  creationDate: string;
  starOnClick?: (event: React.MouseEvent) => void;
  isClick?: boolean;
  delClick?: (event: React.MouseEvent) => void;
  onClick?: () => void;
}

export const ClassPost = ({
  title,
  creationDate,
  starOnClick,
  isClick,
  delClick,
  onClick,
}: IClassPostType) => {
  return (
    <PostContainer onClick={onClick}>
      <ContentContainer>
        <TitleIconContainer>
          <TilteContainer>
            <Title>{title}</Title>
            <CreationDate>생성일자 | {creationDate}</CreationDate>
          </TilteContainer>
          <Star
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              starOnClick && starOnClick(e);
            }}
            strokeColor={isClick ? color.yellow[400] : color.zinc[600]}
            fillColor={isClick ? color.yellow[400] : 'none'}
          />
        </TitleIconContainer>
        <Button
          backgroundColor={color.zinc[50]}
          color={color.zinc[800]}
          borderColor={color.zinc[200]}
          onClick={(e) => {
            e.stopPropagation();
            delClick && delClick(e);
          }}
          hoverBackgroundColor={color.zinc[100]}
        >
          삭제하기
        </Button>
      </ContentContainer>
    </PostContainer>
  );
};

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

const Title = styled.div`
  font: ${font.h4};
  color: ${color.black};
`;

const CreationDate = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
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
