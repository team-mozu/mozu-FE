import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { AddButton, Input, Search } from "@mozu/ui";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetStockList } from "@/entities/stock";
import { FullPageLoader } from "@/shared/ui";
import { StockDiv } from "./StockDiv";

export const StockSearchSideBar = memo(() => {
  const [datas, setDatas] = useState<
    {
      itemId: number;
      itemName: string;
    }[]
  >([]);
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(null);
  const { data: stockData, isLoading } = useGetStockList();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const filteredDatas = datas.filter(
    item =>
      searchText === "" ||
      item.itemName.toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.itemId).includes(searchText),
  );

  // URL 변경 감지 및 선택 상태 동기화
  useEffect(() => {
    const updateSelectedFromURL = () => {
      const currentPath = window.location.pathname;
      const idMatch = currentPath.match(/\/stock-management\/(\d+)/);
      const currentId = idMatch ? Number(idMatch[1]) : null;
      setInternalSelectedId(currentId);
    };

    // 초기 설정
    updateSelectedFromURL();

    // URL 변경 감지
    window.addEventListener('popstate', updateSelectedFromURL);

    return () => {
      window.removeEventListener('popstate', updateSelectedFromURL);
    };
  }, []);

  useEffect(() => {
    if (!stockData) return;

    const mappedData = stockData.map(({ itemId, itemName }) => ({
      itemId,
      itemName,
    })).reverse(); // 리스트 역순으로 정렬
    setDatas(mappedData);

    // 초기 데이터 로드 시 맨 처음 아이템으로 리다이렉트
    const currentPath = window.location.pathname;
    const hasId = currentPath.match(/\/stock-management\/(\d+)/);
    if (!hasId && mappedData.length > 0) {
      navigate(`/stock-management/${mappedData[0].itemId}`, {
        replace: true,
      });
    }
  }, [stockData, navigate]);

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
              key={data.itemId}
              name={data.itemName}
              number={index + 1}
              selected={internalSelectedId === data.itemId}
              onClick={() => {
                if (internalSelectedId !== data.itemId) {
                  setInternalSelectedId(data.itemId);
                  navigate(`/stock-management/${data.itemId}`, { replace: false });
                }
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
