import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { noImgIcon } from './assets';
import { useNavigate } from 'react-router-dom';

interface IItemContentType {
  itemId?: number;
  itemName: string;
  itemLogo: string;
  nowMoney: number;
  profitMoney: number;
  profitNum: string;
  isUp: boolean;
  onClick?: () => void;
}

interface IClassProp {
  classData: ClassResponse[];
}

interface ClassResponse {
  itemId: number;
  itemName: string;
  itemLogo: string;
  nowMoney: number;
  profitMoney: number;
  profitNum: string;
}

const ItemContent = ({
  itemId,
  itemName,
  itemLogo,
  nowMoney,
  profitMoney,
  profitNum,
  onClick,
}: IItemContentType) => {
  return (
    <ItemContainer onClick={onClick}>
      <LogoContainer>
        <Logo
          src={itemLogo ? itemLogo : noImgIcon}
          alt={itemName}
          itemLogo={itemLogo}
        />
        <ItemTitleContainer>
          <ItemTitle>{itemName}</ItemTitle>
          <ItemCode>{itemId}</ItemCode>
        </ItemTitleContainer>
      </LogoContainer>
      <ItemPriceContainer>
        <Price>{nowMoney}원</Price>
        <Percent isUp={true}>
          {profitMoney}원 ({[profitNum]}%)
        </Percent>
      </ItemPriceContainer>
    </ItemContainer>
  );
};

export const ItemSidebar = ({
  classData = [],
}: {
  classData: ClassResponse[];
}) => {
  const navigate = useNavigate();
  return (
    <SideBarContainer>
      <Title>전체 종목</Title>
      <ItemContentContainer>
        {Array.isArray(classData) && classData.length > 0 ? (
          classData.map((data, id) => (
            <ItemContent
              key={id}
              itemId={data.itemId}
              itemName={data.itemName}
              itemLogo={data.itemLogo}
              nowMoney={data.nowMoney ?? 0}
              isUp={true}
              profitMoney={data.profitMoney ?? 0}
              profitNum={
                data.profitNum && !isNaN(parseFloat(data.profitNum))
                  ? data.profitNum
                  : '0%'
              }
              onClick={() => navigate('home/stock/1/price-info')}
            />
          ))
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </ItemContentContainer>
    </SideBarContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 74px;
  cursor: pointer;

  :hover {
    background: ${color.zinc[100]};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ItemPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: end;
`;

const ItemTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: start;
`;

const ItemTitle = styled.div`
  font: ${font.b1};
  color: ${color.black};
`;

const ItemCode = styled.div`
  font: ${font.l2};
  color: ${color.zinc[500]};
`;

const Price = styled.div`
  font: ${font.t3};
  color: ${color.black};
`;

const Percent = styled.div<Pick<IItemContentType, 'isUp'>>`
  font: ${font.l2};
  color: ${({ isUp }) => (isUp ? color.red[500] : color.blue[500])};
`;

const Logo = styled.img<Pick<IItemContentType, 'itemLogo'>>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid
    ${({ itemLogo }) => (itemLogo ? 'transparent' : color.zinc[200])};
  background-color: ${({ itemLogo }) =>
    itemLogo ? 'transparent' : color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SideBarContainer = styled.div`
  position: fixed;
  left: 0;
  border-right: 1px solid ${color.zinc[200]};
  width: 320px;
  height: 100%;
  background-color: ${color.white};
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: start;
  align-items: start;
`;

const Title = styled.div`
  font: ${font.b1};
  color: ${color.zinc[600]};
  padding-left: 16px;
`;
