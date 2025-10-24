import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Del, Modal, PageTitle, PostTitle } from "@mozu/ui";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toggleStar, useDeleteClass, useGetClassList } from "@/entities/class";
import type { LessonGetListResponse } from "@/entities/class/api/type";
import { ClassPost, SkeletonClassPost } from "@/features/classCRUD";
import { FullPageLoader } from "@/shared/ui";

export const ClassManagement = () => {
  const { data, isLoading: apiLoading, refetch } = useGetClassList();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!apiLoading && data) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [apiLoading, data]);

  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // API 데이터 구조에 맞게 가공 및 최신순 정렬
  const classData: LessonGetListResponse = {
    lessons: Array.isArray(data?.lessons) ? data.lessons : [],
  };

  // 최신순으로 정렬 (date 필드 기준)
  const sortedLessons = [...classData.lessons].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const favorites = sortedLessons.filter((item) => item.isStarred);
  const common = sortedLessons.filter((item) => !item.isStarred);

  // 즐겨찾기 여부를 저장할 state
  const [, setIsClickFavorites] = useState<boolean[]>([]);
  const [isClickCommon, setIsClickCommon] = useState<boolean[]>([]);
  const [, setIsStarLoading] = useState(false);

  // 데이터가 변경될 때 상태 초기화
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    setIsClickFavorites(Array(favorites.length).fill(false));
    setIsClickCommon(Array(common.length).fill(false));
  }, [data]);

  const openDeleteModal = useCallback((id: string) => {
    setSelectedClassId(id);
    setIsModal(true);
  }, []);

  //삭제 api 불러옴
  const { mutate: delClassApi, isPending } = useDeleteClass(
    selectedClassId,
    () => setIsModal(false)
  );

  //삭제하기
  const handleDelete = useCallback(() => {
    if (selectedClassId !== null) {
      delClassApi();
    }
  }, [selectedClassId, delClassApi]);

  const toggleFavorite = useCallback(
    (() => {
      let isPending = false;

      return async (
        index: number,
        type: "favorites" | "common",
        id?: string
      ) => {
        if (isPending || id === undefined) return;

        isPending = true;
        setIsStarLoading(true);

        try {
          const updateList =
            type === "favorites" ? setIsClickFavorites : setIsClickCommon;

          updateList((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
          });

          // toggleStar API를 직접 호출하여 실제 클릭한 아이템의 ID 사용
          await toggleStar(id);

          // 캐시 무효화로 최신 데이터 반영
          refetch();
        } catch (error) {
          console.error("즐겨찾기 요청 실패", error);
        } finally {
          isPending = false;
          setIsStarLoading(false);
        }
      };
    })(),
    [] // refetch는 react-query에서 제공하는 안정적인 함수 참조이므로 의존성 불필요
  );

  if (apiLoading) return <FullPageLoader />;

  return (
    <>
      {isModal && (
        <Modal
          mainTitle={"이 수업을 삭제하시겠습니까?"}
          subTitle={"삭제하면 복구가 불가능합니다."}
          onSuccessClick={handleDelete}
          icon={<Del size={24} color={color.red[400]} />}
          isOpen={isModal}
          setIsOpen={setIsModal}
          isPending={isPending}
        />
      )}
      <ClassManagementContent>
        <TitleContainer>
          <PageTitle
            mainTitle={"수업 관리"}
            subTitle={"수업 환경을 만들어 사용해 보세요."}
          />
          <Button
            type="plusImg"
            backgroundColor={color.orange[500]}
            color={color.white}
            isIcon
            iconSize={24}
            iconColor={color.white}
            onClick={() => navigate("create")}
            hoverBackgroundColor={color.orange[600]}
          >
            수업 생성하기
          </Button>
        </TitleContainer>
        <ContentContainer>
          {classData.lessons.length === 0 ? (
            <EmptyStateContainer>
              <EmptyStateContent>
                <EmptyStateText>생성한 수업이 없습니다</EmptyStateText>
                <EmptyStateSubText>
                  첫 번째 수업을 만들어보세요
                </EmptyStateSubText>
                <EmptyStateButton
                  type="plusImg"
                  backgroundColor={color.orange[500]}
                  color={color.white}
                  isIcon
                  iconSize={24}
                  iconColor={color.white}
                  onClick={() => navigate("create")}
                  hoverBackgroundColor={color.orange[600]}
                >
                  수업 만들러 가기
                </EmptyStateButton>
              </EmptyStateContent>
            </EmptyStateContainer>
          ) : (
            <PostAllContainer>
              {favorites.length > 0 && (
                <PostContainer>
                  <PostTitle title="즐겨찾기" count={favorites.length} />
                  <PostContents>
                    {isLoading
                      ? favorites.map((_, index) => (
                          <SkeletonClassPost
                            key={index}
                            title={""}
                            creationDate={""}
                          />
                        ))
                      : favorites.map((item, index) => (
                          <ClassPost
                            key={item.id}
                            title={item.name}
                            creationDate={item.date}
                            isClick={item.isStarred}
                            starOnClick={() =>
                              toggleFavorite(index, "favorites", item.id)
                            }
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
                  {isLoading
                    ? common.map((_, index) => (
                        <SkeletonClassPost
                          key={index}
                          title={""}
                          creationDate={""}
                        />
                      ))
                    : common.map((item, index) => (
                        <ClassPost
                          key={item.id}
                          title={item.name}
                          creationDate={item.date}
                          isClick={isClickCommon[index]}
                          starOnClick={() =>
                            toggleFavorite(index, "common", item.id)
                          }
                          delClick={() => openDeleteModal(item.id)}
                          onClick={() => navigate(`${item.id}`)}
                        />
                      ))}
                </PostContents>
              </PostContainer>
            </PostAllContainer>
          )}
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

const EmptyStateContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const EmptyStateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmptyStateText = styled.div`
  font: ${font.t1};
  color: ${color.zinc[800]};
  text-align: center;
`;

const EmptyStateSubText = styled.div`
  font: ${font.b1};
  color: ${color.zinc[500]};
  text-align: center;
  margin-bottom: 8px;
`;

const EmptyStateButton = styled(Button)`
  margin-top: 8px;
`;
