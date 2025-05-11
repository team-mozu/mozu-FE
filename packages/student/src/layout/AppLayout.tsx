import { Header, Toast } from "@mozu/ui";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useGetClassItem, useGetTeamDetail } from "@/apis";
import { ItemSidebar, HistorySidebar } from "@/components";
import { liveQuery } from "dexie";
import { db } from "@/db";
import { useSSE } from "@/hook";
import { removeCookiesAsync } from "@configs/util";

export const AppLayout = () => {
  const [isResultPage, setIsResultPage] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { data: itemSideBarData } = useGetClassItem();
  const { data: teamData } = useGetTeamDetail();

  const [totalBuy, setTotalBuy] = useState(0);
  const [totalSell, setTotalSell] = useState(0);

  const navigate = useNavigate();

  useSSE(
    `${import.meta.env.VITE_SERVER_URL}/team/sse`,
    (data) => {
      Toast(`${data.message}`, { type: "success" });
    },
    (error) => {
      console.log(error);
      Toast(`SSE 에러 발생: ${error.message}`, { type: "error" });
    },
    {
      CLASS_NEXT_INV_START: (data) => {
        Toast("다음 투자가 시작되었습니다", { type: "info" });
        console.log(data);
      },
      CLASS_CANCEL: async () => {
        Toast("수업이 취소되었습니다.", { type: "error" });

        const domain = import.meta.env.VITE_STUDENT_COOKIE_DOMAIN;
        await removeCookiesAsync(["accessToken", "authority"], {
          path: "/",
          secure: true,
          sameSite: "none",
          domain,
        });
        navigate("/signin");
      },
    }
  );

  useEffect(() => {
    const subscription = liveQuery(async () => {
      const [buySum, sellSum] = await Promise.all([
        db.tradeHistory
          .where("orderType")
          .equals("BUY")
          .toArray()
          .then((data) =>
            data.reduce((acc, cur) => acc + cur.itemMoney * cur.orderCount, 0)
          ),

        db.tradeHistory
          .where("orderType")
          .equals("SELL")
          .toArray()
          .then((data) =>
            data.reduce((acc, cur) => acc + cur.itemMoney * cur.orderCount, 0)
          ),
      ]);

      setTotalBuy(buySum);
      setTotalSell(sellSum);
    }).subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const buyableAmount = (teamData?.cashMoney || 0) - totalBuy + totalSell;

  useEffect(() => {
    console.log("itemSideBarData:", itemSideBarData ?? 0);
  }, [itemSideBarData]);

  useEffect(() => {
    if (pathname === "/news") {
      setIsResultPage(false);
    } else if (pathname.includes("/home")) {
      setIsResultPage(false);
    } else if (pathname.includes("/result")) {
      setIsResultPage(true);
    } else {
      setIsResultPage(false);
    }
  }, [pathname]);

  return (
    <AppContainer>
      <Header isAdmin={false} invDeg={teamData?.invDeg ?? 0} />
      <Layout>
        {!isResultPage && (
          <>
            <ItemSidebar
              classData={Array.isArray(itemSideBarData) ? itemSideBarData : []}
            />
            <HistorySidebar
              teamName={teamData?.name ?? ""}
              totalMoney={teamData?.totalMoney ?? 0}
              basicMoney={teamData?.baseMoney ?? 0}
              cashMoney={teamData?.cashMoney ?? 0}
              valueProfit={teamData?.valueProfit ?? 0}
              valueMoney={teamData?.valueMoney ?? 0}
              profitNum={teamData?.profitNum ?? ""}
              totalBuy={totalBuy}
              totalSell={totalSell}
              buyableAmount={buyableAmount > 0 ? buyableAmount : 0}
            />
          </>
        )}
        <MainContent isResultPage={isResultPage}>
          <Outlet />
        </MainContent>
      </Layout>
    </AppContainer>
  );
};

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Layout = styled.div`
  margin-top: 64px;
  display: flex;
`;

const MainContent = styled.div<{ isResultPage: boolean }>`
  padding-right: ${({ isResultPage }) => (isResultPage ? 0 : "360px")};
  margin-left: ${({ isResultPage }) => (isResultPage ? 0 : "320px")};
  flex: 1;
`;
