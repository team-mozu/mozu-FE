import { Button, ClassPost, DeleteModal, PostTitle, PageTitle } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useState } from 'react';

export const ClassManagement = () => {
  const datas = [
    {
      favorites: [{ title: '2024년도 모의투자', date: '2024-05-05' }],
      common: [
        { title: '2024년도 모의투자', date: '2024-05-05' },
        { title: '2024년도 모의투자', date: '2024-05-05' },
        { title: '2024년도 모의투자', date: '2024-05-05' },
      ],
    },
  ];

  const [isClickFavorites, setIsClickFavorites] = useState<boolean[]>(
    Array(datas[0].favorites.length).fill(false),
  );

  const [isClickCommon, setIsClickCommon] = useState<boolean[]>(
    Array(datas[0].common.length).fill(false),
  );
  const [isModal, setIsModal] = useState<boolean>(false);
  const [favoritesId, setFavoritesId] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 관리

  const delClick = () => {
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleDelete = () => {
    //삭제 작업 들어가는곳
    console.log('삭제 작업 실행');
    setIsModalOpen(false); // 모달 닫기
  };

  const starFavoritesClick = (index: number) => {
    setIsClickFavorites((prev) => {
      const updateStar = [...isClickFavorites];
      updateStar[index] = !updateStar[index];
      return updateStar;
    });
  };

  const starCommonClick = (index: number) => {
    setIsClickCommon((prev) => {
      const updateStar = [...isClickCommon];
      updateStar[index] = !updateStar[index];
      return updateStar;
    });
  };

  return (
    <>
      {isModal && (
        <DeleteModal
          titleComment={'‘2024년도 모의투자’를 삭제하실 건가요?'}
          subComment={'삭제하면 복구가 불가능합니다.'}
          onCancel={handleCloseModal} // 취소 동작
          onDelete={handleDelete} // 삭제 동작
        />
      )}
      <ClassManagementContent>
        <TitleContainer>
          <PageTitle
            mainTitle={'수업 관리'}
            subTitle={'수업 환경을 만들어 사용해 보세요.'}
          />
          <Button
            type="plusImg"
            backgroundColor={color.orange[500]}
            color={color.white}
            isIcon={true}
            iconSize={24}
            iconColor={color.white}
          >
            수업 생성하기
          </Button>
        </TitleContainer>
        <ContentContainer>
          <PostAllContainer>
            {datas[0].favorites.length !== 0 && (
              <PostContainer>
                <PostTitle
                  title="즐겨찾기"
                  count={datas[0].favorites.length}
                ></PostTitle>
                <PostContents>
                  {datas[0].favorites.map((data, index) => {
                    return (
                      <ClassPost
                        title={data.title}
                        creationDate={data.date}
                        isClick={isClickFavorites[index]}
                        starOnClick={() => starFavoritesClick(index)}
                        delClick={delClick}
                      />
                    );
                  })}
                </PostContents>
              </PostContainer>
            )}
            <PostContainer>
              <PostTitle
                title="전체"
                count={datas[0].common.length}
              ></PostTitle>
              <PostContents>
                {datas[0].common.map((data, index) => {
                  return (
                    <ClassPost
                      title={data.title}
                      creationDate={data.date}
                      isClick={isClickCommon[index]}
                      starOnClick={() => starCommonClick(index)}
                      delClick={delClick}
                    />
                  );
                })}
              </PostContents>
            </PostContainer>
          </PostAllContainer>
        </ContentContainer>
      </ClassManagementContent>
    </>
  );
};

const ClassManagementContent = styled.div`
  width: 1150px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 40px;
`;

const PostAllContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  padding: 40px;
  gap: 40px;
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: start;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 824px;
  border-radius: 24px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
`;

const PostContents = styled.div`
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  gap: 20px 20px;
`;
