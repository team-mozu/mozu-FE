import { stockManagementDetail, stockManagementEdit } from '@/apis';
import { LogoUploader } from '@/components';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { EditDiv, Input, TextArea } from '@mozu/ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export const StockManagementEditPage = () => {
  const {id} = useParams();
  const stockId = id? parseInt(id) : null;

  const navigate = useNavigate();

   const [datas, setDatas] = useState<{
      name: string,
      info: string,
      logo: File,
      money: number,
      debt: number,
      capital: number,
      profit: number,
      profitOG: number,
      profitBen: number,
      netProfit: number,}>({
        name: '',
        info: '',
        logo: null,
        money: null,
        debt: null,
        capital: null,
        profit: null,
        profitOG: null,
        profitBen: null,
        netProfit: null,})
  
  
      const nameChange = (e: React.ChangeEvent<HTMLAreaElement>) => { //회사 이름
        setDatas((prev) => ({ ...prev, name: e.target.value }));
      };
  
      const infoChange = (e: React.ChangeEvent<HTMLAreaElement>) => { //회사 정보
        setDatas((prev) => ({ ...prev, info: e.target.value }));
      };
  
      const moneyChange = (e: React.ChangeEvent<HTMLInputElement>) => { //자산
        setDatas((prev) => ({ ...prev, money: e.target.value }));
      };
  
      const debtChange = (e: React.ChangeEvent<HTMLInputElement>) => { //부채
        setDatas((prev) => ({ ...prev, debt: e.target.value }));
      };
  
      const capitalChange = (e: React.ChangeEvent<HTMLInputElement>) => { //자본금
        setDatas((prev) => ({ ...prev, capital: e.target.value }));
      };
  
      const profitChange = (e: React.ChangeEvent<HTMLInputElement>) => { //매출액
        setDatas((prev) => ({ ...prev, profit: e.target.value }));
      };
  
      const profitOGChange = (e: React.ChangeEvent<HTMLInputElement>) => { //매출 원가
        setDatas((prev) => ({ ...prev, profitOG: e.target.value }));
      };
  
      const profitBenChange = (e: React.ChangeEvent<HTMLInputElement>) => { //매출 이익
        setDatas((prev) => ({ ...prev, profitBen: e.target.value }));
      };
  
      const netProfitChange = (e: React.ChangeEvent<HTMLInputElement>) => { //당기순이익
        setDatas((prev) => ({ ...prev, netProfit: e.target.value }));
      };

      const apiData = stockManagementEdit();
      const editClick = () => {
        let logoFile = datas.logo;

        if(typeof datas.logo === "string") {
          logoFile = '';
        } else if (datas.logo instanceof File) {
          logoFile = datas.logo
        }

        apiData.mutate({
          name: datas.name,
          info: datas.info,
          logo: logoFile,
          money: datas.money,
          debt: datas.debt,
          capital: datas.capital,
          profit: datas.profit,
          profitOG: datas.profitOG,
          profitBen: datas.profitBen,
          netProfit: datas.netProfit,
          stockId: stockId,
        })
    }

    const {data: stockData, isLoading} = useQuery({
      queryKey: ['stocks', stockId],
      queryFn: () => stockManagementDetail(stockId),
      enabled: !!stockId,
    })

  useEffect(() => {
    if(stockData?.data) {
      setDatas({
        name: stockData.data.name || '',
        info: stockData.data.info || '',
        logo: stockData.data.logo || null,
        money: stockData.data.money || null,
        debt: stockData.data.debt || null,
        capital: stockData.data.capital || null,
        profit: stockData.data.profit || null,
        profitOG: stockData.data.profitOG || null,
        profitBen: stockData.data.profitBen || null,
        netProfit: stockData.data.netProfit || null,
      });
    }
  }, [stockData])

  return (
    <Container>
      <EditDiv
        title={'종목 수정'}
        value1={'취소'}
        value2={'저장하기'}
        type2={'saveImg'}
        isIcon2={true}
        iconSize2={20}
        iconColor2={color.white}
        onClick={editClick}
      />
      <StockSetting>
        <InnerContainer>
          <div>
            <LogoUploader img={datas.logo && datas.logo instanceof File ? URL.createObjectURL(datas.logo) : datas.logo} onImageChange={(file) => setDatas((prev) => ({...prev, logo: file}))}/>
          </div>
          <div>
            <Input
              label={'회사 이름'}
              placeholder={'종목 이름을 입력해 주세요..'}
              width={'480px'}
              onChange={nameChange}
              value={datas.name}
            />
          </div>
          <div>
            <TextArea
              placeholder={'회사 정보를 입력해 주세요..'}
              label={'회사 정보'}
              height={260}
              onChange={infoChange}
              value={datas.info}
            ></TextArea>
          </div>
        </InnerContainer>
        <InnerContainer>
          <p>재무상태표 ∙ 손익계산서</p>
          <div>
            <Input
              label={'자산'}
              placeholder={'자산 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
              onChange={moneyChange}
              value={datas.money}
            />
          </div>
          <div>
            <Input
              label={'부채'}
              placeholder={'부채 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
              onChange={debtChange}
              value={datas.debt}
            />
          </div>
          <div>
            <Input
              label={'자본금'}
              placeholder={'자본금 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
              onChange={capitalChange}
              value={datas.capital}
            />
          </div>
          <div>
            <Input
              label={'매출액'}
              placeholder={'매출액 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
              onChange={profitChange}
              value={datas.profit}
            />
          </div>
          <div>
            <Input
              label={'매출원가'}
              placeholder={'매출원가 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
              onChange={profitOGChange}
              value={datas.profitOG}
            />
          </div>
          <div>
            <Input
              label={'매출이익'}
              placeholder={'매출이익 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
              onChange={profitBenChange}
              value={datas.profitBen}
            />
          </div>
          <div>
            <Input
              label={'당기순이익'}
              placeholder={'당기순이익 정보를 입력해 주세요.'}
              type={'Number'}
              width={'480px'}
              text={'원'}
              onChange={netProfitChange}
              value={datas.netProfit}
            />
          </div>
        </InnerContainer>
      </StockSetting>
    </Container>
  );
};

const Container = styled.div`
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StockSetting = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 8px;
`;

const InnerContainer = styled.div`
  overflow: scroll;
  width: 50%;
  height: 100%;
  padding: 24px;
  background-color: ${color.white};
  border-radius: 1rem;
  border: 1px solid ${color.zinc[200]};
  display: flex;
  flex-direction: column;
  gap: 24px;
  > p {
    color: ${color.black};
    font: ${font.t1};
  }
`;
