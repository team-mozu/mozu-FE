------------------------ MODULE TradeModel ------------------------
EXTENDS Naturals, Sequences, TLC

CONSTANTS
    MaxStockPrice,    \* 최대 주가
    MaxQuantity,      \* 최대 주문 수량
    InitialCash,      \* 초기 자금
    StockIds,         \* 종목 ID 집합
    MaxRounds         \* 최대 라운드

VARIABLES
    cashMoney,        \* 현재 잔액
    holdings,         \* 보유 주식 수
    tradeOrders,      \* 주문 대기열
    currentRound,     \* 현재 라운드
    stockPrices       \* 현재 주가

vars == <<cashMoney, holdings, tradeOrders, currentRound, stockPrices>>

\* 초기 상태
Init ==
    /\ cashMoney = InitialCash
    /\ holdings = [s \in StockIds |-> 0]
    /\ tradeOrders = <<>>
    /\ currentRound = 1
    /\ stockPrices \in [StockIds -> 1..MaxStockPrice]

\* --- [Helper Functions] ---

RECURSIVE SumOrders(_, _, _, _)
SumOrders(orders, stockId, type, index) ==
    IF index > Len(orders) THEN 0
    ELSE 
        LET current == orders[index]
            rest == SumOrders(orders, stockId, type, index + 1)
        IN 
        IF current.itemId = stockId /\ current.orderType = type 
        THEN current.orderCount + rest
        ELSE rest

HasOppositeOrder(stockId, orderType) ==
    \E i \in 1..Len(tradeOrders) :
        /\ tradeOrders[i].itemId = stockId
        /\ tradeOrders[i].orderType # orderType

CurrentSellAmount(stockId) ==
    SumOrders(tradeOrders, stockId, "SELL", 1)

\* --- [Action Conditions] ---

CanBuy(stockId, quantity, price) ==
    /\ ~HasOppositeOrder(stockId, "BUY")
    /\ (quantity * price) <= cashMoney
    /\ quantity > 0

CanSell(stockId, quantity) ==
    LET pendingSell == CurrentSellAmount(stockId)
        available == holdings[stockId] - pendingSell
    IN 
    /\ ~HasOppositeOrder(stockId, "SELL")
    /\ quantity <= available
    /\ quantity > 0

\* --- [Actions] ---

Buy(stockId, quantity) ==
    LET price == stockPrices[stockId]
        cost == quantity * price
        newOrder == [
            itemId |-> stockId, 
            itemPrice |-> price, 
            orderCount |-> quantity, 
            orderType |-> "BUY"
        ]
    IN 
    /\ CanBuy(stockId, quantity, price)
    /\ cashMoney' = cashMoney - cost
    /\ tradeOrders' = Append(tradeOrders, newOrder)
    /\ UNCHANGED <<holdings, currentRound, stockPrices>>

Sell(stockId, quantity) ==
    LET price == stockPrices[stockId]
        revenue == quantity * price
        newOrder == [
            itemId |-> stockId, 
            itemPrice |-> price, 
            orderCount |-> quantity, 
            orderType |-> "SELL"
        ]
    IN 
    /\ CanSell(stockId, quantity)
    /\ cashMoney' = cashMoney + revenue
    /\ tradeOrders' = Append(tradeOrders, newOrder)
    /\ UNCHANGED <<holdings, currentRound, stockPrices>>

UpdateStockPrices ==
    /\ stockPrices' \in [StockIds -> 1..MaxStockPrice]
    /\ UNCHANGED <<cashMoney, holdings, tradeOrders, currentRound>>

EndRound ==
    LET 
        NetChange(s) == 
            SumOrders(tradeOrders, s, "BUY", 1) - SumOrders(tradeOrders, s, "SELL", 1)
        
        newHoldings == [s \in StockIds |-> holdings[s] + NetChange(s)]
    IN 
    /\ currentRound < MaxRounds
    /\ currentRound' = currentRound + 1
    /\ holdings' = newHoldings
    /\ tradeOrders' = <<>>
    /\ UNCHANGED <<cashMoney, stockPrices>>

\* --- [Next State & Spec] ---

Next ==
    \/ \E s \in StockIds, q \in 1..MaxQuantity : Buy(s, q)
    \/ \E s \in StockIds, q \in 1..MaxQuantity : Sell(s, q)
    \/ UpdateStockPrices
    \/ EndRound

Spec == Init /\ [][Next]_vars

\* --- [Invariants] ---

NoNegativeBalance == cashMoney >= 0

NoNegativeHoldings == \A s \in StockIds : holdings[s] >= 0

SellLimitCheck == 
    \A s \in StockIds : CurrentSellAmount(s) <= holdings[s]

\* --- [Constraint Definition] (여기가 추가되었습니다!) ---
\* 주문 대기열이 3개를 넘어가면 더 이상 탐색하지 않음 (무한 루프 방지 및 속도 최적화)
StateConstraint ==
    Len(tradeOrders) <= 3

===================================================================