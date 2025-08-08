import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { noImgIcon } from "@mozu/ui";
import { useNavigate } from "react-router-dom";
import { useGetClassItem } from "@/apis";

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

interface IPercentProps extends Pick<IItemContentType, "isUp"> {
  isZero?: boolean;
}

const ItemContent = ({
  itemId,
  itemName,
  itemLogo,
  nowMoney,
  profitMoney,
  profitNum,
  onClick,
  isUp,
}: IItemContentType) => {
  // profitMoney와 profitNum이 유효한 값인지 확인 (0%도 표시)
  const hasValidData = profitMoney !== undefined && profitNum !== undefined;

  // 0%인지 확인
  const isZeroPercent = profitMoney === 0 && profitNum === "0.00%";

  return (
    <ItemContainer onClick={onClick}>
      <LogoContainer>
        <Logo
          src={itemLogo}
          alt={itemName}
          onError={e => {
            e.currentTarget.src = noImgIcon;
          }}
        />
        <ItemTitleContainer>
          <ItemTitle>{itemName}</ItemTitle>
          <ItemCode>{itemId}</ItemCode>
        </ItemTitleContainer>
      </LogoContainer>
      {hasValidData && (
        <ItemPriceContainer>
          <Price>{nowMoney.toLocaleString()}원</Price>
          <Percent
            isUp={isUp}
            isZero={isZeroPercent}>
            {`${isUp ? "+" : ""}${profitMoney.toLocaleString()}원 (${isUp ? "+" : ""}${profitNum})`}
          </Percent>
        </ItemPriceContainer>
      )}
    </ItemContainer>
  );
};

export const ItemSidebar = ({ isMock = false }: { isMock?: boolean }) => {
  const { data } = useGetClassItem({
    queryKey: [
      "getClass",
    ],
    enabled: !isMock,
  });
  const navigate = useNavigate();

  return (
    <SideBarContainer>
      <Title>전체 종목</Title>
      <ItemContentContainer>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((data, id) => {
            const profitNum = data.profitNum && !isNaN(parseFloat(data.profitNum)) ? data.profitNum : "0%";

            // 0%인지 확인
            const isZeroPercent = (data.profitMoney ?? 0) === 0 && (profitNum === "0%" || profitNum === "0");

            // isUp 계산 - 0%인 경우는 중립, 그 외엔 기존 로직
            const isUp = isZeroPercent
              ? false // 0%일 때는 기본적으로 false (색상은 isZero로 제어)
              : !(typeof profitNum === "string" && profitNum.includes("-"));

            return (
              <ItemContent
                key={id}
                itemId={data.itemId}
                itemName={data.itemName}
                itemLogo={data.itemLogo}
                nowMoney={data.nowMoney ?? 0}
                isUp={isUp}
                profitMoney={data.profitMoney ?? 0}
                profitNum={profitNum}
                onClick={() => navigate(`stock/${data.itemId}`)}
              />
            );
          })
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </ItemContentContainer>
    </SideBarContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 4.625rem;
  cursor: pointer;

  :hover {
    background: ${color.zinc[100]};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const ItemPriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: end;
  flex-shrink: 0;
`;

const ItemTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: start;
  min-width: 0;
  flex: 1;
`;

const ItemTitle = styled.div`
  font: ${font.b1};
  color: ${color.black};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const ItemCode = styled.div`
  font: ${font.l2};
  color: ${color.zinc[500]};
`;

const Price = styled.div`
  font: ${font.t3};
  color: ${color.black};
  white-space: nowrap;
`;

const Percent = styled.div<IPercentProps>`
  font: ${font.l2};
  color: ${({ isUp, isZero }) => {
    if (isZero) return color.zinc[500]; // 0%일 때 회색
    return isUp ? color.red[500] : color.blue[500];
  }};
`;

const Logo = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const SideBarContainer = styled.div`
  position: fixed;
  left: 0;
  border-right: 1px solid ${color.zinc[200]};
  width: clamp(240px, 25vw, 320px);
  height: 100vh;
  background-color: ${color.white};
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0.125rem 0 0.25rem rgba(93, 93, 93, 0.1);
  z-index: 1;
  overflow-y: auto;
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
  padding-left: 1rem;
`;
