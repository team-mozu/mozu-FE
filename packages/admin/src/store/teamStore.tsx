import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TeamInfo {
  teamId: number;
  teamName: string;
  schoolName: string;
}

interface TeamStore {
  teamInfoMap: Record<number, TeamInfo>;
  setTeamInfo: (team: TeamInfo) => void;
  getTeamInfo: (teamId: number) => TeamInfo | null;
  clearTeamInfo: (teamId?: number) => void; // 특정 팀 또는 전체 초기화
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
      getTeamInfo: (teamId) => {
        return get().teamInfoMap[teamId] ?? null;
      },
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
      name: 'team-info-storage-multi',
    }
  )
);
