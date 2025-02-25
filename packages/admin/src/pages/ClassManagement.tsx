import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, DeleteModal, PostTitle, PageTitle } from '@mozu/ui';
import styled from '@emotion/styled';
import { color } from '@mozu/design-token';
import { ClassPost } from '@/components';
import { ClassItem, useGetClassList } from '@/apis';

export const ClassManagement = () => {
  const { data } = useGetClassList();
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // API 데이터 구조에 맞게 가공
  const classData: ClassItem[] = data?.classes || [];
  const favorites = classData.filter((item) => item.starYN);
  const common = classData.filter((item) => !item.starYN);

  // 즐겨찾기 여부를 저장할 state
  const [isClickFavorites, setIsClickFavorites] = useState<boolean[]>([]);
  const [isClickCommon, setIsClickCommon] = useState<boolean[]>([]);

  // 데이터가 변경될 때 상태 초기화
  useEffect(() => {
    setIsClickFavorites(Array(favorites.length).fill(false));
    setIsClickCommon(Array(common.length).fill(false));
  }, [data]);

  const openDeleteModal = (id: number) => {
    setSelectedClassId(id);
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
    setSelectedClassId(null);
  };

  const handleDelete = () => {
    if (selectedClassId !== null) {
      console.log(`수업 ID ${selectedClassId} 삭제`);
    }
    setIsModal(false);
  };

  const toggleFavorite = (index: number, type: 'favorites' | 'common') => {
    if (type === 'favorites') {
      setIsClickFavorites((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });
    } else {
      setIsClickCommon((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });
    }
  };

  return (
    <>
      {isModal && (
        <DeleteModal
          titleComment={'이 수업을 삭제하시겠습니까?'}
          subComment={'삭제하면 복구가 불가능합니다.'}
          onCancel={handleCloseModal}
          onDelete={handleDelete}
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
            isIcon
            iconSize={24}
            iconColor={color.white}
            onClick={() => navigate('create')}
            hoverBackgroundColor={color.orange[600]}
          >
            수업 생성하기
          </Button>
        </TitleContainer>
        <ContentContainer>
          <PostAllContainer>
            {favorites.length > 0 && (
              <PostContainer>
                <PostTitle title="즐겨찾기" count={favorites.length} />
                <PostContents>
                  {favorites.map((item, index) => (
                    <ClassPost
                      key={item.id}
                      title={item.name}
                      creationDate={item.date}
                      isClick={isClickFavorites[index]}
                      starOnClick={() => toggleFavorite(index, 'favorites')}
                      delClick={() => openDeleteModal(item.id)}
                      onClick={() => navigate(`${item.id}`)}
                    />
                  ))}
                </PostContents>
              </PostContainer>
            )}
            <PostContainer>
              <PostTitle title="전체" count={common.length} />
              <PostContents>
                {common.map((item, index) => (
                  <ClassPost
                    key={item.id}
                    title={item.name}
                    creationDate={item.date}
                    isClick={isClickCommon[index]}
                    starOnClick={() => toggleFavorite(index, 'common')}
                    delClick={() => openDeleteModal(item.id)}
                    onClick={() => navigate(`${item.id}`)}
                  />
                ))}
              </PostContents>
            </PostContainer>
          </PostAllContainer>
        </ContentContainer>
      </ClassManagementContent>
    </>
  );
};

const ClassManagementContent = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2.4rem;
`;

const PostAllContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 2.5rem;
  gap: 2.5rem;
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  min-height: calc(100vh - 40px);
  height: auto;
  width: 100%;
  border-radius: 1.5rem;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
`;

const PostContents = styled.div`
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  gap: 1.25rem;
`;
