import { vi } from "vitest";

// 모든 UI 관련 설정을 포함합니다.
import "./ui-setup";
import "@testing-library/jest-dom";

// react-router-dom 훅 모의 처리
vi.mock("react-router-dom", async importOriginal => {
  const original = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...original,
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(() => ({})),
    useLocation: vi.fn(() => ({
      pathname: "/",
    })),
  };
});

// tanstack/react-query 훅 모의 처리 (기본값 설정)
const createMockMutation = () => ({
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isPending: false,
  isSuccess: false,
  isError: false,
});

// biome-ignore lint/suspicious/noExplicitAny: <임시>
const createMockQuery = (data: any = null) => ({
  data,
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
});

// admin 패키지 API 전체 모의 처리
vi.mock("../../packages/admin/src/apis", () => ({
  // article
  useAddArticle: vi.fn(() => createMockMutation()),
  useDeleteArticle: vi.fn(() => createMockMutation()),
  useGetArticleDetail: vi.fn(() => createMockQuery()),
  useGetArticleList: vi.fn(() =>
    createMockQuery({
      article: [],
    }),
  ),
  useEditArticle: vi.fn(() => createMockMutation()),

  // class
  useGetClassList: vi.fn(() =>
    createMockQuery({
      classes: [],
    }),
  ),
  useGetClassDetail: vi.fn(() => createMockQuery()),
  useClassCreate: vi.fn(() => createMockMutation()),
  useClassUpdate: vi.fn(() => createMockMutation()),
  useClassStar: vi.fn(() => createMockMutation()),
  useClassDelete: vi.fn(() => createMockMutation()),
  useClassStart: vi.fn(() => createMockMutation()),
  useNextDegree: vi.fn(() => createMockMutation()),
  useEditClass: vi.fn(() => createMockMutation()),
  useTeamDeals: vi.fn(() => createMockQuery([])),

  // login
  useAdminLogin: vi.fn(() => createMockMutation()),

  // monitoring
  useClassStop: vi.fn(() => createMockMutation()),
  useGetTeamTradeStatus: vi.fn(() => createMockQuery([])),
  useGetTeamHoldItems: vi.fn(() => createMockQuery([])),

  // stock
  useAddStock: vi.fn(() => createMockMutation()),
  useDeleteStock: vi.fn(() => createMockMutation()),
  useGetStockDetail: vi.fn(() => createMockQuery()),
  useGetStockList: vi.fn(() =>
    createMockQuery({
      items: [],
    }),
  ),
  useEditStock: vi.fn(() => createMockMutation()),
}));

// student 패키지 API 전체 모의 처리
vi.mock("../../packages/student/src/apis", () => ({
  // class
  useGetClassItem: vi.fn(() => createMockQuery([])),
  useGetClassDetail: vi.fn(() => createMockQuery()),

  // login
  useStudentLogin: vi.fn(() => createMockMutation()),

  // news
  useGetArticleList: vi.fn(() => createMockQuery([])),

  // stock
  useGetStockDetail: vi.fn(() => createMockQuery()),

  // team
  useGetTeamDetail: vi.fn(() => createMockQuery()),
  useGetHoldItems: vi.fn(() => createMockQuery([])),
  useTeamEnd: vi.fn(() => createMockMutation()),
  useTeamOrders: vi.fn(() => createMockQuery([])),
  useTeamResult: vi.fn(() => createMockQuery()),
  useTeamRank: vi.fn(() => createMockQuery([])),
}));

// Zustand 스토어 모의 처리
vi.mock("../../packages/admin/src/store", () => ({
  useTeamStore: vi.fn(() => ({
    teamInfoMap: {},
    appendTrade: vi.fn(),
    setTeamInfo: vi.fn(),
    clearTeamInfo: vi.fn(),
  })),
  useClassStore: vi.fn(() => ({
    classData: null,
    updateStockItems: vi.fn(),
    updateArticles: vi.fn(),
    setClassData: vi.fn(),
    resetCheckedStates: vi.fn(),
    resetClassData: vi.fn(),
  })),
}));
