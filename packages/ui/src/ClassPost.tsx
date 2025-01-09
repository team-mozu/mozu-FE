import styled from '@emotion/styled';
import { color } from '@mozu/design-token';
import { Star } from './assets';
import { Button } from '.';
import { useState } from 'react';

interface IClassPostType {
  title: string;
  creationDate: string;
}

export const ClassPost = ({ title, creationDate }: IClassPostType) => {
  const [isClick, setIsClick] = useState<boolean>(false);

  const starClick = () => {
    setIsClick(!isClick);
  };

  return (
    <PostContainer>
      <ContentContainer>
        <TitleIconContainer>
          <TilteContainer>
            <Title>{title}</Title>
            <CreationDate>생성일자 | {creationDate}</CreationDate>
          </TilteContainer>
          <Star
            size={20}
            onClick={starClick}
            strokeColor={isClick ? color.yellow[400] : color.zinc[600]}
            fillColor={isClick ? color.yellow[400] : 'none'}
          />
        </TitleIconContainer>
        <Button
          backgroundColor={color.zinc[50]}
          color={color.zinc[800]}
          borderColor={color.zinc[200]}
        >
          삭제하기
        </Button>
      </ContentContainer>
    </PostContainer>
  );
};

const PostContainer = styled.div`
  width: 480px;
  height: 156px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font: h4;
  color: ${color.black};
`;

const CreationDate = styled.div`
  font: b2;
  color: ${color.zinc[500]};
`;

const TilteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

const TitleIconContainer = styled.div`
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
