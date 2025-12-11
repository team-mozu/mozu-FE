import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, SvgIcon } from "@mozu/ui";

// 데스크탑 반응형 브레이크포인트
const desktopMediaQueries = {
  small: `@media (max-width: 1366px)`,
  medium: `@media (max-width: 1440px)`,
  large: `@media (max-width: 1680px)`,
};

interface IClassPostType {
  title: string;
  creationDate: string;
  starOnClick?: (event: React.MouseEvent) => void;
  isClick?: boolean;
  delClick?: (event: React.MouseEvent) => void;
  onClick?: () => void;
}

export const ClassPost = ({ title, creationDate, starOnClick, isClick, delClick, onClick }: IClassPostType) => {
  return (
    <PostContainer onClick={onClick}>
      <ContentContainer>
        <TitleIconContainer>
          <TitleContainer>
            <Title>{title}</Title>
            <CreationDate>생성일자 | {creationDate}</CreationDate>
          </TitleContainer>
          <div
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              starOnClick?.(e);
            }}>
            {isClick ? (
              <SvgIcon
                name="fill-star"
                size={20}
              />
            ) : (
              <SvgIcon
                name="star"
                size={20}
              />
            )}
          </div>

        </TitleIconContainer>
        <Button
          backgroundColor={color.zinc[50]}
          color={color.zinc[800]}
          borderColor={color.zinc[200]}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            delClick?.(e);
          }}
          hoverBackgroundColor={color.zinc[100]}>
          삭제하기
        </Button>
      </ContentContainer>
    </PostContainer>
  );
};

const PostContainer = styled.div`
  cursor: pointer;
  width: 100%;
  max-width: 480px;
  min-width: 320px;
  height: 156px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  background-color: ${color.white};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    max-width: 400px;
    height: 140px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    max-width: 440px;
    height: 148px;
  }
`;

const Title = styled.div`
  font: ${font.h4};
  color: ${color.black};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  max-width: 336px;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    max-width: 280px;
    font-size: 16px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    max-width: 310px;
  }
`;

const CreationDate = styled.div`
  font: ${font.b2};
  color: ${color.zinc[500]};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

const TitleIconContainer = styled.div`
  width: 100%;
  max-width: 432px;
  display: flex;
  justify-content: space-between;
  align-items: start;

  /* Windows 일반 데스크탑 */
  ${desktopMediaQueries.small} {
    max-width: 360px;
  }

  /* 중형 데스크탑 */
  ${desktopMediaQueries.medium} {
    max-width: 400px;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: end;
`;
