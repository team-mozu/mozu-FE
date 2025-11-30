import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { useTradingDetail } from "@/entities/user";
import { roundToFixed } from "@/shared/lib";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TradingDetailModal = ({ isOpen, onClose }: Props) => {
  const { data: tradingDetail, isLoading, error } = useTradingDetail();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>보유 종목 상세</Title>
          <Subtitle>현재 보유하고 있는 종목의 상세 정보입니다</Subtitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Content>
          {error && (
            <ErrorMessage>
              데이터를 불러오는 중 오류가 발생했습니다.
            </ErrorMessage>
          )}

          {isLoading ? (
            <LoadingMessage>
              데이터를 불러오는 중...
            </LoadingMessage>
          ) : tradingDetail && tradingDetail.length > 0 ? (
            <Container>
              <Table>
                <thead>
                  <Tr $isHeader>
                    <Th>종목명</Th>
                    <Th>보유주식수</Th>
                    <Th>현재가</Th>
                    <Th>총 매입금액</Th>
                    <Th>평가금액</Th>
                    <Th>평가손익</Th>
                    <Th>수익률</Th>
                  </Tr>
                </thead>
                <tbody>
                  {tradingDetail.map((item) => {
                    const isProfitable = item.profitLoss >= 0;

                    return (
                      <Tr key={item.itemId}>
                        <Td>
                          <StockName>{item.itemName}</StockName>
                        </Td>
                        <Td $isNumber>
                          <Quantity>{item.holdingQuantity.toLocaleString()}주</Quantity>
                        </Td>
                        <Td $isNumber>
                          <Price>{item.currentPrice.toLocaleString()}원</Price>
                        </Td>
                        <Td $isNumber>
                          <Price>{item.purchasePrice.toLocaleString()}원</Price>
                        </Td>
                        <Td $isNumber>
                          <Amount>{item.valuationAmount.toLocaleString()}원</Amount>
                        </Td>
                        <Td $isNumber>
                          <ProfitLoss $isPositive={isProfitable}>
                            {isProfitable ? "+" : ""}{item.profitLoss.toLocaleString()}원
                          </ProfitLoss>
                        </Td>
                        <Td $isNumber>
                          <ProfitRate $isPositive={isProfitable}>
                            {isProfitable ? "+" : ""}{roundToFixed(item.profitLossRate, 2)}%
                          </ProfitRate>
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </Container>
          ) : (
            <EmptyMessage>
              현재 보유하고 있는 종목이 없습니다.
            </EmptyMessage>
          )}
        </Content>
      </ModalContainer>
    </Backdrop>
  );
};

// Modal Backdrop
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`;

// Modal Container
const ModalContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  width: 1000px;
  overflow: hidden;
  animation: modalSlideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);

`;

// Modal Header
const Header = styled.div`
  padding: 24px 32px 16px 32px;
  border-bottom: 1px solid ${color.zinc[200]};
  position: relative;
`;

const Title = styled.h2`
  ${font.h3};
  color: ${color.zinc[900]};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  ${font.b2};
  color: ${color.zinc[600]};
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${color.zinc[500]};
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${color.zinc[100]};
    color: ${color.zinc[700]};
  }
`;

// Modal Content
const Content = styled.div`
  padding: 24px 32px 32px 32px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
`;

const Container = styled.div`
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
`;

const Tr = styled.tr<{ $isHeader?: boolean }>`
  background-color: ${({ $isHeader }) => $isHeader ? color.orange[50] : color.white};

  &:not(:last-child) {
    border-bottom: 1px solid ${color.zinc[200]};
  }
`;

const Th = styled.th`
  padding: 16px 12px;
  text-align: center;
  ${font.b1};
  color: ${color.zinc[900]};
  border-right: 1px solid ${color.zinc[200]};

  &:last-child {
    border-right: none;
  }
`;

const Td = styled.td<{ $isNumber?: boolean }>`
  padding: 16px 12px;
  text-align: ${({ $isNumber }) => $isNumber ? "right" : "left"};
  ${font.t4};
  border-right: 1px solid ${color.zinc[200]};

  &:last-child {
    border-right: none;
  }
`;

const StockName = styled.span`
  ${font.t3};
  color: ${color.zinc[900]};
  font-weight: 600;
`;

const Quantity = styled.span`
  ${font.t4};
  color: ${color.zinc[700]};
`;

const Price = styled.span`
  ${font.t4};
  color: ${color.zinc[700]};
`;

const Amount = styled.span`
  ${font.t3};
  color: ${color.zinc[900]};
  font-weight: 600;
`;

const ProfitLoss = styled.span<{ $isPositive: boolean }>`
  ${font.t4};
  color: ${({ $isPositive }) => ($isPositive ? color.red[500] : color.blue[500])};
  font-weight: 600;
`;

const ProfitRate = styled.span<{ $isPositive: boolean }>`
  ${font.t4};
  color: ${({ $isPositive }) => ($isPositive ? color.red[500] : color.blue[500])};
  font-weight: 600;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  ${font.b1};
  color: ${color.zinc[500]};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  ${font.b1};
  color: ${color.zinc[500]};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  ${font.b1};
  color: ${color.red[500]};
  background-color: ${color.red[50]};
  border: 1px solid ${color.red[200]};
  border-radius: 8px;
`;