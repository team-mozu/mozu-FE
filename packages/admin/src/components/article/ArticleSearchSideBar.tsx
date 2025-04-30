import { AddButton, SearchInput } from "@mozu/ui";
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleDiv } from "./ArticleDiv";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useGetArticleList } from "@/apis";

interface ArticleSearchSideBarProps {
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  selectedId: number | null;
}

export const ArticleSearchSideBar = ({
  setSelectedId,
  selectedId,
}: ArticleSearchSideBarProps) => {
  const { id } = useParams<{ id: string }>();
  const [datas, setDatas] = useState<
    { id: number; title: string; date: string }[]
  >([]);
  const { data: articleData } = useGetArticleList();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredDatas = datas.filter(
    (item) =>
      searchText === "" ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.id).includes(searchText)
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
      navigate(`/article-management/${mappedData[0].id}`, { replace: true });
      setSelectedId(mappedData[0].id);
    }
  }, [articleData, id, navigate, setSelectedId]);

  return (
    <SideBarContainer>
      <UpperWrapper>
        <p>
          전체 <span>{datas.length}</span>
        </p>
        <SearchInput
          inputText="기사 검색.."
          value={searchText}
          onChange={(value) => setSearchText(value)}
        />
      </UpperWrapper>
      <ArticleWrapper>
        {filteredDatas.map((data, index) => (
          <ArticleDiv
            key={data.id}
            articleNumber={index + 1}
            title={data.title}
            date={data.date}
            selected={selectedId === data.id}
            onClick={() => {
              setSelectedId(data.id);
              navigate(`/article-management/${data.id}`, { replace: true });
            }}
          />
        ))}
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
