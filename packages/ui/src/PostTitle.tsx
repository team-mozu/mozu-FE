import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IPostTitleType {
  title: string;
  count: number;
}

export const PostTitle = ({ title, count }: IPostTitleType) => {
  return (
    <PostTitleContainer>
      <Title>{title}</Title>
      <PostCount>{count}</PostCount>
    </PostTitleContainer>
  );
};

const Title = styled.div`
  font: ${font.b1};
  color: ${color.black};
`;

const PostCount = styled.div`
  font: ${font.b1};
  color: ${color.orange[600]};
`;

const PostTitleContainer = styled.div`
  display: flex;
  gap: 4px;
`;
