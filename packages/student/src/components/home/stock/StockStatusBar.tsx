import { color, font } from "@mozu/design-token";
import styled from "@emotion/styled";
import { Button, noImgIcon } from "@mozu/ui";
import { useGetStockDetail } from "@/apis";
import { useParams } from "react-router-dom";

export const StockStatusBar = ({
  openModal,
}: {
  openModal: (type: "매수" | "매도") => void;
}) => {
  const { stockId } = useParams();
  const ItemId = stockId ? parseInt(stockId) : null;

  const { data } = useGetStockDetail(ItemId);

  return (
    <Wrapper>
      <Stock>
        <Logo
          src={data?.itemLogo ?? ""}
          onError={(e) => {
            e.currentTarget.src = noImgIcon;
          }}
        />
        <StockInfo>
          <StockName>
            {data?.itemName ?? ""}
            <span>{data?.itemId ?? 0}</span>
          </StockName>
          <StockPrice
            color={
              data?.profitNum.includes("+") ? color.red[500] : color.blue[500]
            }
          >
            {data?.nowMoney.toLocaleString()}원 <span>{data?.profitNum}</span>
          </StockPrice>
        </StockInfo>
      </Stock>
      <Btn>
        <Button
          borderColor={color.red[500]}
          backgroundColor={color.red[500]}
          color="white"
          width={80}
          onClick={() => openModal("매수" /*currentStock*/)}
          hoverBackgroundColor={color.red[600]}
          hoverBorderColor={color.red[600]}
        >
          매수
        </Button>
        <Button
          borderColor={color.blue[500]}
          backgroundColor={color.blue[500]}
          color="white"
          width={80}
          onClick={() => openModal("매도" /*currentStock*/)}
          hoverBackgroundColor={color.blue[600]}
          hoverBorderColor={color.blue[600]}
        >
          매도
        </Button>
      </Btn>
    </Wrapper>
  );
};

const Btn = styled.div`
  display: flex;
  gap: 12px;
  height: 48px;
`;

const Logo = styled.img`
  border: 1px solid ${color.zinc[200]};
  border-radius: 12px;
  width: 64px;
  height: 64px;
  object-fit: cover;
`;

const Stock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StockPrice = styled.div<{ color?: string }>`
  font: ${font.h3};
  display: flex;
  align-items: center;
  gap: 12px;
  > span {
    font: ${font.t3};
    color: ${({ color }) => color};
  }
`;

const StockName = styled.div`
  font: ${font.t3};
  display: flex;
  align-items: center;
  gap: 6px;
  > span {
    font: ${font.b2};
    color: ${color.zinc[600]};
  }
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 1px 0px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-end;
`;
