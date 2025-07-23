// TODO: state 변동 시에 리렌더링 됨에 따라 useSSE가 재실행 됨
import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, DeleteModal, HandCoins, Toast, Trophy } from "@mozu/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useTeamOrders, useTeamResult } from "@/apis";
import { AssetChange, History, NthDeal } from "@/components";
import { useSSE } from "@/hook";
import { resetShownInvDegs } from "@/pages/HomePage";
import { roundToFixed } from "@/utils";

interface ValueStyleProps {
  isPositive?: boolean;
  onRankClick?: () => void;
  endRound?: number;
}

export const ResultContainer = ({ onRankClick, endRound }: ValueStyleProps) => {
  const { data: teamOrders } = useTeamOrders();
  const { data: teamResult } = useTeamResult();
  const [isWait, setIsWait] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { classId } = useParams<{
    classId: string;
  }>();

  const valueProfitStr = teamResult?.valueProfit ?? "0";

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

    queryClient.invalidateQueries({
      queryKey: [
        "getClass",
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

  const handleContinue = async () => {
    resetShownInvDegs();

    queryClient.invalidateQueries({
      queryKey: [
        "getClass",
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

    await new Promise(resolve => setTimeout(resolve, 100));

    navigate(`/${classId}`, {
      replace: true,
    });
  };

  useSSE(
    `${import.meta.env.VITE_SERVER_URL}/team/sse`,
    data => { },
    error => {
      console.log(error);
      Toast(`네트워크 에러 발생`, {
        type: "error",
      });
    },
    {
      CLASS_NEXT_INV_START: () => {
        setIsWait(false);
      },
    },
  );

  return (
    <>
      {isOpen ? (
        <DeleteModal
          titleComment="투자 마치기"
          subComment="투자 마치면 총 결과 결산 페이지로 이동합니다."
          message="마치기"
          isPending={false}
          onDelete={handleEndClass}
          onCancel={() => setIsOpen(false)}
        />
      ) : null}
      <Container>
        <Title>
          <Logo>
            <HandCoins
              size={24}
              color={color.orange[500]}
            />
          </Logo>
          {teamResult?.invDeg === endRound ? (
            <p>
              {teamOrders && teamOrders.length > 0 && teamOrders[teamOrders.length - 1]?.invDeg}
              차(최종) 투자 종료
            </p>
          ) : (
            <p>{teamOrders && teamOrders.length > 0 && teamOrders[teamOrders.length - 1]?.invDeg}차 투자 종료</p>
          )}
        </Title>
        <Main>
          <Transaction>
            <label>거래내역</label>
            {teamOrders &&
              teamOrders.length > 0 &&
              [
                ...Array(teamOrders[teamOrders.length - 1].invDeg),
              ]
                .map((_, i) => i + 1) // 1부터 시작
                .reverse()
                .map(deg => {
                  const ordersInDeg = teamOrders.filter(order => order.invDeg === deg);
                  if (ordersInDeg.length === 0) return null;

                  return (
                    <NthDeal
                      key={deg}
                      deal={deg}
                      orderHistory={
                        <>
                          {ordersInDeg.reverse().map((order, idx) => (
                            <History
                              key={idx}
                              type={order.orderType}
                              totalMoney={order.totalMoney.toLocaleString()}
                              itemMoney={order.itemMoney.toLocaleString()}
                              itemCount={order.orderCount}
                              itemName={order.itemName}
                            />
                          ))}
                        </>
                      }
                    />
                  );
                })}
          </Transaction>
          <RightContainer>
            <Result>
              {teamResult?.invDeg === endRound ? <label>총 결과 요약</label> : <label>결과 요약</label>}
              <AssetChange
                baseMoney={teamResult?.baseMoney ?? 0}
                totalMoney={teamResult?.totalMoney ?? 0}
              />
              <Sub>
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
                {teamResult?.invDeg === endRound ? "최종 랭킹 보기" : "현재 랭킹 보기"}
                <Trophy
                  size={24}
                  color={color.orange[500]}
                />
              </Button>
              {teamResult?.invDeg === endRound ? (
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
                  onClick={() => setIsOpen(true)}>
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
