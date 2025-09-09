import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { AddButton, Input, Search } from "@mozu/ui";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetArticleList } from "@/entities/article/api";
import { FullPageLoader } from "@/shared/ui";
import { ArticleDiv } from "./ArticleDiv";

interface ArticleSearchSideBarProps {
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  selectedId: number | null;
}

export const ArticleSearchSideBar = ({ setSelectedId, selectedId }: ArticleSearchSideBarProps) => {
  const { id } = useParams<{
    id: string;
  }>();
  const [datas, setDatas] = useState<
    {
      id: number;
      title: string;
      date: string;
    }[]
  >([]);
  const { data: articleData, isLoading } = useGetArticleList();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredDatas = datas.filter(
    item =>
      searchText === "" ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.id).includes(searchText),
  );

  useEffect(() => {
    if (!articleData?.article) return;

    const mappedData = articleData.article.map(({ id, title, date }) => ({
      id,
      title,
      date,
    }));

    setDatas(mappedData);
    if (!id && mappedData.length > 0) {
      navigate(`/article-management/${mappedData[0].id}`, {
        replace: true,
      });
      setSelectedId(mappedData[0].id);
    }
  }, [
    articleData,
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
          startIcon={<Search color={color.zinc[400]} size={20} />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </UpperWrapper>
      <ArticleWrapper>
        {filteredDatas.length > 0 ?
          filteredDatas.map((data, index) => (
            <ArticleDiv
              key={data.id}
              articleNumber={index + 1}
              title={data.title}
              date={data.date}
              selected={selectedId === data.id}
              onClick={() => {
                setSelectedId(data.id);
                navigate(`/article-management/${data.id}`, {
                  replace: true,
                });
              }}
            />
          )) :
          <EmptyState>{searchText ? "검색 결과가 없습니다." : "기사가 없습니다."}</EmptyState>
        }
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
`;
