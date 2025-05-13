import { Header, Toast } from "@mozu/ui";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useGetArticleList, useGetClassItem, useGetTeamDetail } from "@/apis";
import { ItemSidebar, HistorySidebar } from "@/components";
import { useSSE } from "@/hook";
import { removeCookiesAsync } from "@configs/util";
import { queryClient } from "..";

export const AppLayout = () => {
  const { data: teamData, refetch: teamDataRefetch } = useGetTeamDetail();
  const { refetch: classItemRefetch } = useGetClassItem();
  const { refetch: articleDataRefetch } = useGetArticleList();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const splitedPath = pathname.split("/");
  const isResultPage = splitedPath[splitedPath.length - 1] === "result";

  useSSE(
    `${import.meta.env.VITE_SERVER_URL}/team/sse`,
    (data) => {},
    (error) => {
      console.log(error);
      Toast(`SSE 에러 발생: ${error.message}`, { type: "error" });
    },
    {
      CLASS_NEXT_INV_START: () => {
        localStorage.removeItem("trade");
        classItemRefetch();
        teamDataRefetch();
        articleDataRefetch();
        queryClient.invalidateQueries({ queryKey: ["getStock"], exact: false });
        Toast("다음 투자가 시작되었습니다", { type: "info" });
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

  // useEffect(() => {
  //   const subscription = liveQuery(async () => {
  //     const [buySum, sellSum] = await Promise.all([
  //       db.tradeHistory
  //         .where("orderType")
  //         .equals("BUY")
  //         .toArray()
  //         .then((data) =>
  //           data.reduce((acc, cur) => acc + cur.itemMoney * cur.orderCount, 0)
  //         ),

  //       db.tradeHistory
  //         .where("orderType")
  //         .equals("SELL")
  //         .toArray()
  //         .then((data) =>
  //           data.reduce((acc, cur) => acc + cur.itemMoney * cur.orderCount, 0)
  //         ),
  //     ]);

  //     setTotalBuy(buySum);
  //     setTotalSell(sellSum);
  //   }).subscribe();

  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <AppContainer>
      <Header isAdmin={false} invDeg={teamData?.invDeg ?? 0} />
      <Layout>
        {!isResultPage && (
          <>
            <ItemSidebar />
            <HistorySidebar />
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
