import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { AddButton, Input, Search } from "@mozu/ui";
import { type Dispatch, memo, type SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetStockList } from "@/entities/stock/api";
import { FullPageLoader } from "@/shared/ui";
import { StockDiv } from "./StockDiv";

interface StockSearchSideBarProps {
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  selectedId: number | null;
}

export const StockSearchSideBar = memo(({ setSelectedId, selectedId }: StockSearchSideBarProps) => {
  const { classId, id } = useParams<{
    classId: string;
    id: string;
  }>();
  const [datas, setDatas] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const { data: stockData, isLoading } = useGetStockList();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredDatas = datas.filter(
    item =>
      searchText === "" ||
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.id).includes(searchText),
  );

  useEffect(() => {
    if (!stockData?.items) return;

    const mappedData = stockData.items.map(({ id, name }) => ({
      id,
      name,
    }));
    setDatas(mappedData);

    if (!id && mappedData.length > 0) {
      navigate(`/stock-management/${mappedData[0].id}`, {
        replace: true,
      });
      setSelectedId(mappedData[0].id);
    }
  }, [
    stockData,
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
            <StockDiv
              key={data.id}
              name={data.name}
              number={index + 1}
              selected={selectedId === data.id}
              onClick={() => {
                setSelectedId(data.id);
                navigate(`/stock-management/${data.id}`, {
                  replace: true,
                });
              }}
            />
          )) :
          <EmptyState>{searchText ? "검색 결과가 없습니다." : "종목이 없습니다."}</EmptyState>
        }
      </ArticleWrapper>

      <AddButton
        onClick={() => navigate("/stock-management/add")}
        text="종목 추가하기"
      />
    </SideBarContainer>
  );
});

const SideBarContainer = styled.div`
  min-width: 280px;
  height: 100%;
  background-color: white;
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
  background-color: ${color.white};
  border-bottom: 1px solid ${color.zinc[200]};
  p > span {
    color: ${color.orange[600]};
  }
`;

const ArticleWrapper = styled.div`
  background-color: ${color.white};
  flex: 1;
  width: 100%;
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
