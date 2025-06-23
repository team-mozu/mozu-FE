import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TradeData {
  totalMoney: number;
  valMoney: number;
  profitNum: string;
}

export interface TeamInfo {
  teamId: number;
  teamName: string;
  schoolName: string;
  trade: TradeData[]; // ✅ 선택적 필드로 추가
}

interface TeamStore {
  teamInfoMap: Record<number, TeamInfo>;
  setTeamInfo: (team: TeamInfo) => void;
  appendTrade: (teamId: number, trade: TradeData) => void; // ✅ trade 누적 메서드 추가
  getTeamInfo: (teamId: number) => TeamInfo | null;
  clearTeamInfo: (teamId?: number) => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamInfoMap: {},
      setTeamInfo: (team) =>
        set((state) => ({
          teamInfoMap: {
            ...state.teamInfoMap,
            [team.teamId]: team,
          },
        })),
      appendTrade: (teamId, trade) =>
        set((state) => {
          const prev = state.teamInfoMap[teamId];
          if (!prev) return state;

          return {
            teamInfoMap: {
              ...state.teamInfoMap,
              [teamId]: {
                ...prev,
                trade: [...(prev.trade ?? []), trade],
              },
            },
          };
        }),
      getTeamInfo: (teamId) => get().teamInfoMap[teamId] ?? null,
      clearTeamInfo: (teamId) => {
        if (teamId === undefined) {
          set({ teamInfoMap: {} });
        } else {
          const newMap = { ...get().teamInfoMap };
          delete newMap[teamId];
          set({ teamInfoMap: newMap });
        }
      },
    }),
    {
      name: "team-info-storage-multi",
    }
  )
);
