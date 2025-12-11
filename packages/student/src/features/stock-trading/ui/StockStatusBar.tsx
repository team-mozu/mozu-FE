import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, SvgIcon } from "@mozu/ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStockDetail } from "@/entities/stock";
import { Skeleton } from "../../../../../design-token/src/theme/Skeleton";

export const StockStatusBar = ({ openModal }: { openModal: (type: "매수" | "매도") => void }) => {
  const { stockId } = useParams();
  const ItemId = stockId ? parseInt(stockId) : null;
  const { data, isLoading } = useGetStockDetail(ItemId ?? 0);

  const [hasErrored, setHasErrored] = useState(false);

  // 새로 추가한 로직
  const profitNum = data?.profitNum && !Number.isNaN(parseFloat(data?.profitNum)) ? data.profitNum : "0.00%";
  const profitMoney = data?.profitMoney ?? 0;

  const isZeroPercent = profitMoney === 0 && profitNum === "0.00%";

  const isUp = isZeroPercent ? false : !(typeof profitNum === "string" && profitNum.includes("-"));

  const priceColor = isZeroPercent ? color.zinc[500] : isUp ? color.red[500] : color.blue[500];

  const handleImageError = () => {
    setHasErrored(true);
  };

  // 데이터가 변경될 때 에러 상태 리셋
  useEffect(() => {
    if (data?.itemLogo) {
      setHasErrored(false);
    }
  }, [data?.itemLogo]);

  return (
    <Wrapper>
      <Stock>
        {isLoading ? (
          <LogoImgDiv />
        ) : data?.itemLogo && !hasErrored ? (
          <Logo
            src={data.itemLogo}
            alt={data.itemName}
            onError={handleImageError}
          />
        ) : (
          <LogoFallback>
            <SvgIcon name="stock-no-logo" size={32} color="#9CA3AF" />
          </LogoFallback>
        )}
        {isLoading ? (
          <TitleDiv />
        ) : (
          <StockInfo>
            <StockName>
              {data?.itemName ?? ""}
              <span>{data?.itemId ?? 0}</span>
            </StockName>
            <StockPrice color={priceColor}>
              {data?.nowMoney?.toLocaleString()}원{" "}
              {!isZeroPercent && (
                <span>{`${isUp ? "+" : ""}${profitMoney.toLocaleString()}원 (${profitNum})`}</span>
              )}
            </StockPrice>
          </StockInfo>
        )}
      </Stock>
      <Btn>
        <Button
          borderColor={color.red[500]}
          backgroundColor={color.red[500]}
          color="white"
          width={80}
          onClick={() => openModal("매수")}
          disabled={isLoading}
          hoverBackgroundColor={color.red[600]}
          hoverBorderColor={color.red[600]}>
          매수
        </Button>
        <Button
          borderColor={color.blue[500]}
          backgroundColor={color.blue[500]}
          color="white"
          width={80}
          onClick={() => openModal("매도")}
          disabled={isLoading}
          hoverBackgroundColor={color.blue[600]}
          hoverBorderColor={color.blue[600]}>
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

const LogoFallback = styled.div`
  border: 1px solid ${color.zinc[200]};
  border-radius: 12px;
  width: 64px;
  height: 64px;
  background-color: ${color.zinc[50]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Stock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StockPrice = styled.div<{
  color?: string;
}>`
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

const LogoImgDiv = styled(Skeleton)`
  width: 64px;
  height: 64px;
`;

const TitleDiv = styled(Skeleton)`
  color: transparent;
  width: 70px;
  font: ${font.h3};
`;
