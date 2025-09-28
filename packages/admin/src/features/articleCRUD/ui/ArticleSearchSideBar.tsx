import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { AddButton, Input, Search } from "@mozu/ui";
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetArticleList } from "@/entities/article";
import { FullPageLoader } from "@/shared/ui";
import { ArticleDiv } from "./ArticleDiv";

interface ArticleSearchSideBarProps {
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  selectedId: string | null;
}

export const ArticleSearchSideBar = ({ setSelectedId, selectedId }: ArticleSearchSideBarProps) => {
  const { id } = useParams<{
    id: string;
  }>();
  const [datas, setDatas] = useState<
    {
      id: string;
      articleName: string;
      createdAt: string;
    }[]
  >([]);
  const { data: articleData, isLoading } = useGetArticleList();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredDatas = datas.filter(
    item =>
      searchText === "" ||
      item.articleName.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.id).includes(searchText),
  );

  const articles = useMemo(() => {
    if (!articleData) return [];
    // ArticleListResponse가 단일 객체인 경우 배열로 변환
    return Array.isArray(articleData)
      ? articleData
      : [
        articleData,
      ];
  }, [
    articleData,
  ]);

  useEffect(() => {
    if (!articles) return;

    const mappedData = articles.map(({ id, articleName, createdAt }) => ({
      id,
      articleName,
      createdAt,
    }));

    setDatas(mappedData);
    if (!id && mappedData.length > 0) {
      navigate(`/article-management/${mappedData[0].id}`, {
        replace: true,
      });
      setSelectedId(mappedData[0].id);
    }
  }, [
    articles,
    id,
    navigate,
    setSelectedId,
  ]);

  if (isLoading) return <FullPageLoader />;

  return (
    <SideBarContainer>
      <UpperWrapper>
        <p>
          전체 <span>{datas.length}</span>
        </p>
        <Input
          placeholder="기사 검색.."
          fullWidth={true}
          startIcon={
            <Search
              color={color.zinc[400]}
              size={20}
            />
          }
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </UpperWrapper>
      <ArticleWrapper>
        {filteredDatas.length > 0 ? (
          filteredDatas.map((data, index) => (
            <ArticleDiv
              key={data.id}
              articleNumber={index + 1}
              title={data.articleName}
              date={data.createdAt}
              selected={selectedId === data.id}
              onClick={() => {
                setSelectedId(data.id);
                navigate(`/article-management/${data.id}`, {
                  replace: true,
                });
              }}
            />
          ))
        ) : (
          <EmptyState>{searchText ? "검색 결과가 없습니다." : "기사가 없습니다."}</EmptyState>
        )}
      </ArticleWrapper>
      <AddButton
        onClick={() => navigate("/article-management/add")}
        text="기사 추가하기"
      />
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  min-width: 490px;
  height: 100%;
  background-color: ${color.white};
  border-right: 1px solid ${color.zinc[200]};
  display: flex;
  flex-direction: column;

  /* 데스크탑 반응형 - 사이드바 최소 너비 조정 */
  @media (max-width: 1440px) {
    min-width: 440px;
  }

  @media (max-width: 1200px) {
    min-width: 380px;
  }

  @media (max-width: 1024px) {
    min-width: 320px;
  }

  @media (max-width: 900px) {
    min-width: 280px;
  }
`;

const UpperWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font: ${font.b1};
  padding: 12px;
  border-bottom: 1px solid ${color.zinc[200]};
  p > span {
    color: ${color.orange[600]};
  }

  /* 데스크탑 반응형 - 상단 래퍼 조정 */
  @media (max-width: 1200px) {
    font: ${font.b2};
    padding: 10px;
    gap: 6px;
  }

  @media (max-width: 1024px) {
    font: ${font.l1};
    padding: 8px;
    gap: 4px;
  }

  @media (max-width: 900px) {
    font: ${font.l2};
    padding: 6px;
    gap: 4px;
  }
`;

const ArticleWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font: ${font.b2};
  color: ${color.zinc[500]};

  /* 데스크탑 반응형 - 빈 상태 조정 */
  @media (max-width: 1200px) {
    height: 180px;
    font: ${font.l1};
  }

  @media (max-width: 1024px) {
    height: 160px;
    font: ${font.l2};
  }

  @media (max-width: 900px) {
    height: 140px;
    font: ${font.l2};
  }
`;
