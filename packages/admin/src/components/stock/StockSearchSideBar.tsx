import { AddButton, SearchInput } from '@mozu/ui';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { StockDiv } from './StockDiv';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stockManagementList } from '@/apis';

export const StockSearchSideBar = () => {
  const [datas, setDatas] = useState<[{id: number, name: string}]>([])
  
  const {data: stockData, isLoading} = useQuery({
    queryKey: ['stocks'],
    queryFn: () => stockManagementList(),
  })

useEffect(() => {
  if(stockData?.data.items) {
    setDatas(
      stockData.data.items.map((item) => ({
        id: item.id,
        name: item.name
      }))
    );
  }
}, [stockData])

  const navigate = useNavigate();

  const stockDivClick = (id: number) => {
    navigate(`/stock-management/${id}`)
  }
  return (
    <SideBarContainer>
      <UpperWrapper>
        <p>
          전체 <span>12</span>
        </p>
        <SearchInput inputText="종목 검색.." />
      </UpperWrapper>
      <ArticleWrapper>
        {datas.map((data) => (
          <StockDiv name={data.name} number={data.id} onClick={(id) => stockDivClick(data.id)} key={data.id}/>
        ))

        }
      </ArticleWrapper>
      <AddButton onClick={() => navigate('/stock-management/add')} text="종목 추가하기" />
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
