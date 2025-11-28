import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Del, HandCoins, Modal, Trophy } from "@mozu/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useTeamOrders } from "@/entities/transaction";
import { useGetTeamDetail, useTeamResult } from "@/entities/user";
import { resetShownInvDegs } from "@/pages/home/ui/HomePage";
import { useSSE } from "@/shared/contexts";
import { roundToFixed } from "../lib";
import { AssetChange } from "./AssetChange";
import { History } from "./History";
import { NthDeal } from "./NthDeal";
import { SSELoadingSpinner } from "./SSELoadingSpinner";

interface ValueStyleProps {
  isPositive?: boolean;
  onRankClick?: () => void;
  endRound?: number;
}

export const ResultContainer = ({ onRankClick, endRound }: ValueStyleProps) => {
  const { data: teamOrders } = useTeamOrders();
  const { data: teamResult } = useTeamResult();
  const { data: teamDetail } = useGetTeamDetail();
  const [isWait, setIsWait] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const navigate = useNavigate();
  const { classId } = useParams<{
    classId: string;
  }>();

  const valueProfitStr = teamResult?.valProfit ?? "0";

  const profitNumRaw = teamResult?.profitNum ?? "0%";
  const profitNum = parseFloat(profitNumRaw.toString().replace("%", ""));
  const roundedProfitNum = roundToFixed(profitNum, 2);
  const profitNumStr = `${roundedProfitNum}%`;
  const queryClient = useQueryClient();

  const valueProfitNum = parseFloat(valueProfitStr.toString().replace(/,/g, ""));
  const profitNumNum = parseFloat(profitNumStr.toString().replace("%", ""));

  const isValueProfitPositive = valueProfitNum >= 0;
  const isProfitNumPositive = profitNumNum >= 0;

  const handleEndClass = () => {
    resetShownInvDegs();
    queryClient.resetQueries();
    queryClient.invalidateQueries({
      queryKey: [
        "getClass",
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        "stock",
        "detail"
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        "getArticle",
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        "getTeam",
      ],
    });

    navigate(`/${classId}/ending`, {
      replace: true,
    });
  };

  const handleContinue = () => {
    resetShownInvDegs();

    setIsWait(true);
    navigate(`/${classId}`, {
      replace: true,
    });

    queryClient.invalidateQueries({
      queryKey: [
        "getClass",
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        "stock",
        "detail"
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        "getArticle",
      ],
    });
    queryClient.invalidateQueries({
      queryKey: [
        "getTeam",
      ],
    });
  };

  // SSE Context에서 상태 가져오기
  const { isReconnecting, retryCount, lastData, clearLastData } = useSSE();

  // 투자 시작 이벤트 처리 - 결과 페이지에서는 상태만 변경
  useEffect(() => {
    if (lastData?.type === "CLASS_NEXT_INV_START" && lastData.lessonId && teamResult && lastData.curInvRound === teamResult.invRound) {
      console.log("🔍 [DEBUG] 결과 페이지에서 투자 시작 이벤트 처리:", lastData);
      console.log("🔍 [DEBUG] 현재 완료된 차수:", teamResult.invRound, "다음 투자 차수:", lastData.curInvRound);

      setIsWait(false);
      // 처리 완료 후 이벤트 데이터를 초기화하여 중복 처리 방지
      clearLastData();
    }
  }, [lastData, teamResult, clearLastData]);

  return (
    <>
      <SSELoadingSpinner isVisible={isReconnecting} retryCount={retryCount} />

      {isOpenModal && (
        <Modal
          mainTitle="투자 마치기"
          subTitle="투자 마치면 총 결과 결산 페이지로 이동합니다."
          successBtnChildren="마치기"
          onSuccessClick={handleEndClass}
          icon={
            <Del
              size={24}
              color={color.red[400]}
            />
          }
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          isPending={false}
        />
      )}
      <Container>
        <Title>
          <Logo>
            <HandCoins
              size={24}
              color={color.orange[500]}
            />
          </Logo>
          {teamDetail?.curInvRound === endRound ? (
            <p>
              {teamDetail && teamDetail.curInvRound > 0 && teamDetail?.curInvRound}
              차(최종) 투자 종료
            </p>
          ) : (
            <p>{teamDetail && teamDetail.curInvRound > 0 && teamDetail?.curInvRound}차 투자 종료</p>
          )}
        </Title>
        <Main>
          <Transaction>
            <label>거래내역</label>
            {teamOrders &&
              teamOrders.length > 0 &&
              [
                ...Array(Math.max(...teamOrders.map(order => order.invCount))),
              ]
                .map((_, i) => i + 1) // 1부터 시작
                .reverse()
                .map(deg => {
                  const ordersInDeg = teamOrders.filter(order => order.invCount === deg);
                  if (ordersInDeg.length === 0) return null;

                  return (
                    <NthDeal
                      key={deg}
                      deal={deg}
                      orderHistory={ordersInDeg.reverse().map((order, idx) => (
                        <History
                          key={idx}
                          type={order.orderType}
                          totalMoney={order.totalMoney.toLocaleString()}
                          itemMoney={order.itemPrice.toLocaleString()}
                          itemCount={order.orderCount}
                          itemName={order.itemName}
                        />
                      ))}
                    />
                  );
                })}
          </Transaction>
          <RightContainer>
            <Result>
              {teamResult?.invRound === endRound ? <label>총 결과 요약</label> : <label>결과 요약</label>}
              <AssetChange
                baseMoney={teamResult?.baseMoney ?? 0}
                totalMoney={teamResult?.totalMoney ?? 0}
              />
              <Sub>
                <MoneyBreakdown>
                  <label>투자중인 금액</label>
                  <p>{teamResult?.investingMoney?.toLocaleString() ?? "0"}원</p>
                </MoneyBreakdown>

                <MoneyBreakdown>
                  <label>주문 가능 금액</label>
                  <p>{teamResult?.availableMoney?.toLocaleString() ?? "0"}원</p>
                </MoneyBreakdown>

                <Proceeds isPositive={isValueProfitPositive}>
                  <label>수익금</label>
                  <p>
                    {isValueProfitPositive ? "+" : ""}
                    {valueProfitStr.toLocaleString()}원
                  </p>
                </Proceeds>

                <Return isPositive={isProfitNumPositive}>
                  <label>수익률</label>
                  <p>
                    {isProfitNumPositive ? "+" : ""}
                    {profitNumStr}
                  </p>
                </Return>


                <TotalDeal>
                  <label>총 거래 횟수</label>
                  <p>{teamResult?.orderCount ?? 0}회</p>
                </TotalDeal>
              </Sub>
            </Result>
            <ButtonDiv>
              <Button
                borderColor={color.orange[200]}
                backgroundColor={color.orange[50]}
                color={color.orange[500]}
                width={205}
                onClick={onRankClick}
                hoverBackgroundColor={color.orange[100]}
                hoverBorderColor={color.orange[300]}>
                {teamResult?.invRound === endRound ? "최종 랭킹 보기" : "현재 랭킹 보기"}
                <Trophy
                  size={24}
                  color={color.orange[500]}
                />
              </Button>
              {teamResult?.invRound === endRound ? (
                <Button
                  backgroundColor={color.zinc[50]}
                  color={color.zinc[800]}
                  width={205}
                  isIcon={true}
                  iconColor={color.zinc[800]}
                  iconSize={24}
                  borderColor={color.zinc[200]}
                  hoverBackgroundColor={color.zinc[100]}
                  type="logOutImg"
                  onClick={() => setIsOpenModal(true)}>
                  투자 마치기
                </Button>
              ) : (
                <div
                  data-tooltip-id="continue-tooltip"
                  data-tooltip-content={isWait ? "다음 투자가 시작되지 않았습니다" : "다음 차수로 계속할 수 있습니다!"}
                  data-tooltip-place="top"
                  data-tooltip-effect="solid">
                  <Button
                    backgroundColor={color.orange[500]}
                    color={color.white}
                    width={205}
                    isIcon={true}
                    iconColor={color.white}
                    iconSize={24}
                    hoverBackgroundColor={color.orange[600]}
                    disabled={isWait}
                    onClick={handleContinue}>
                    계속하기
                  </Button>
                </div>
              )}
            </ButtonDiv>
          </RightContainer>
        </Main>

        {/* Tooltip 컴포넌트 */}
        <Tooltip
          id="continue-tooltip"
          style={{
            backgroundColor: color.zinc[800],
            color: color.white,
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            zIndex: 1000,
          }}
          opacity={1}
          delayShow={300}
          delayHide={100}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 848px;
  height: 780px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 24px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  > p {
    font: ${font.h3};
    color: ${color.black};
  }
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${color.orange[50]};
  border: 1px solid ${color.orange[200]};
  border-radius: 8px;
`;

const Main = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  gap: 8px;
`;

const Transaction = styled.div`
  width: 100%;
  background-color: ${color.white};
  border-radius: 24px;
  border: 1px solid ${color.zinc[200]};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
  max-height: 600px;

  > label {
    font: ${font.t2};
    color: ${color.black};
  }
`;

const RightContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Result = styled.div`
  height: 100%;
  background-color: ${color.white};
  border-radius: 24px;
  padding: 32px;
  border: 1px solid ${color.zinc[200]};
  display: flex;
  flex-direction: column;
  gap: 32px;
  > label {
    font: ${font.t2};
    color: ${color.black};
  }
`;

const ButtonDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;

const Sub = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Proceeds = styled.div<ValueStyleProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font: ${font.b2};
  color: ${color.zinc[600]};
  > p {
    font: ${font.t3};
    color: ${({ isPositive }) => (isPositive ? color.red[500] : color.blue[500])}; // 🔥 조건부 색상
  }
`;

const Return = styled.div<ValueStyleProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font: ${font.b2};
  color: ${color.zinc[600]};
  > p {
    font: ${font.t3};
    color: ${({ isPositive }) => (isPositive ? color.red[500] : color.blue[500])}; // 🔥 조건부 색상
  }
`;

const MoneyBreakdown = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font: ${font.b2};
  color: ${color.zinc[600]};
  > p {
    font: ${font.t3};
    color: ${color.orange[600]};
  }
`;

const TotalDeal = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font: ${font.b2};
  color: ${color.zinc[600]};
  > p {
    font: ${font.t3};
    color: ${color.black};
  }
`;
