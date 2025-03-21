import { AddButton, SearchInput } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { StockDiv } from './StockDiv';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useGetStockList } from '@/apis';

interface StockSearchSideBarProps {
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  selectedId: number | null;
}

export const StockSearchSideBar = ({
  setSelectedId,
  selectedId,
}: StockSearchSideBarProps) => {
  const { classId, id } = useParams<{ classId: string; id: string }>();
  const [datas, setDatas] = useState<{ id: number; name: string }[]>([]);
  const { data: stockData } = useGetStockList();
  const navigate = useNavigate();

  useEffect(() => {
    if (!stockData?.items) return;

    const mappedData = stockData.items.map(({ id, name }) => ({ id, name }));
    setDatas(mappedData);

    if (!id && mappedData.length > 0) {
      navigate(`/stock-management/${mappedData[0].id}`, { replace: true });
      setSelectedId(mappedData[0].id);
    }
  }, [stockData, id, navigate, setSelectedId]);

  return (
    <SideBarContainer>
      <UpperWrapper>
        <p>
          전체 <span>{datas.length}</span>
        </p>
        <SearchInput inputText="종목 검색.." />
      </UpperWrapper>
      <ArticleWrapper>
        {datas.map((data, index) => (
          <StockDiv
            key={data.id}
            name={data.name}
            number={index + 1}
            selected={selectedId === data.id}
            onClick={() => {
              setSelectedId(data.id);
              navigate(`/stock-management/${data.id}`, { replace: true });
            }}
          />
        ))}
      </ArticleWrapper>

      <AddButton
        onClick={() => navigate('/stock-management/add')}
        text="종목 추가하기"
      />
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  min-width: 280px;
  height: 100%;
  backgroundcolor: white;
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
