import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { noImgIcon } from './assets';

interface IItemContentType {
  imgUrl?: string;
  title: string;
  code: string;
  price: string;
  isUp?: boolean;
  upDownPrice: string;
  upDownPercent: string;
}

const ItemContent = ({
  imgUrl,
  title,
  code,
  price,
  isUp,
  upDownPrice,
  upDownPercent,
}: IItemContentType) => {
  return (
    <ItemContainer>
      <LogoContainer>
        <Logo src={imgUrl ? imgUrl : noImgIcon} alt={title} imgUrl={imgUrl} />
        <ItemTitleContainer>
          <ItemTitle>{title}</ItemTitle>
          <ItemCode>{code}</ItemCode>
        </ItemTitleContainer>
      </LogoContainer>
      <ItemPriceContainer>
        <Price>{price}원</Price>
        <Percent isUp={isUp}>
          {upDownPrice}원 ({upDownPercent}%)
        </Percent>
      </ItemPriceContainer>
    </ItemContainer>
  );
};

export const ItemSidebar = () => {
  const datas = [
    {
      logoImg:
        'https://i.pinimg.com/236x/4e/9e/9a/4e9e9af1e2efd78c2776c60225fcd6e5.jpg',
      title: '삼성전자',
      code: '005930',
      price: '53,700',
      isUp: false,
      upDownPrice: '-600',
      upDownPercent: '-1.1',
    },
    {
      logoImg:
        'https://i.pinimg.com/236x/4e/9e/9a/4e9e9af1e2efd78c2776c60225fcd6e5.jpg',
      title: '삼성전자',
      code: '005930',
      price: '53,700',
      isUp: true,
      upDownPrice: '+600',
      upDownPercent: '+1.1',
    },
    {
      logoImg: '',
      title: '삼성전자',
      code: '005930',
      price: '53,700',
      isUp: false,
      upDownPrice: '-600',
      upDownPercent: '-1.1',
    },
  ];
  return (
    <SideBarContainer>
      <Title>전체 종목</Title>
      <ItemContentContainer>
        {datas.map((data, index) => (
          <ItemContent
            imgUrl={data.logoImg}
            title={data.title}
            code={data.code}
            price={data.price}
            isUp={data.isUp}
            upDownPrice={data.upDownPrice}
            upDownPercent={data.upDownPercent}
            key={index}
          />
        ))}
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

const Logo = styled.img<Pick<IItemContentType, 'imgUrl'>>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid
    ${({ imgUrl }) => (imgUrl ? 'transparent' : color.zinc[200])};
  background-color: ${({ imgUrl }) =>
    imgUrl ? 'transparent' : color.zinc[50]};
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
