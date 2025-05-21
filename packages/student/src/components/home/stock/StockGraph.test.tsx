import { render, screen, within } from '@testing-library/react';
import { StockGraph } from './StockGraph';
import { useGetStockDetail } from '@/apis';
import '@testing-library/jest-dom';

// Mock the rechart library
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
    XAxis: ({ ticks }: { ticks: string[] }) => <div data-testid="x-axis">{ticks && ticks.join(',')}</div>,
    YAxis: ({ ticks }: { ticks: number[] }) => <div data-testid="y-axis">{ticks && ticks.join(',')}</div>,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ReferenceLine: () => <div data-testid="reference-line" />,
    Line: () => <div data-testid="line" />,
  };
});

// Mock the useGetStockDetail hook
jest.mock('@/apis', () => ({
  useGetStockDetail: jest.fn(),
}));

const mockStockId = 1;

describe('StockGraph', () => {
  it('renders loading state', () => {
    (useGetStockDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    render(<StockGraph stockId={mockStockId} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useGetStockDetail as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Test error'),
    });
    render(<StockGraph stockId={mockStockId} />);
    expect(screen.getByText('Error fetching data')).toBeInTheDocument();
  });

  describe('with successful data', () => {
    const mockStockDetailData = {
      data: {
        stockDataList: [
          { turn: 1, nowPrice: 10000, time: '2023-01-01T00:00:00Z' },
          { turn: 2, nowPrice: 12000, time: '2023-01-01T00:01:00Z' },
          { turn: 3, nowPrice: 11000, time: '2023-01-01T00:02:00Z' },
          { turn: 4, nowPrice: 13000, time: '2023-01-01T00:03:00Z' },
          { turn: 5, nowPrice: 12500, time: '2023-01-01T00:04:00Z' },
        ],
        // Add other necessary fields from StockDetailResponse['data'] if StockGraph uses them
        itemId: 1,
        itemName: 'Test Stock',
        nowPrice: 12500,
        startPrice: 10000,
        highPrice: 13000,
        lowPrice: 10000,
        yesterdayPrice: 10000,
        moneyList: [
            { turn: 0, price: 0}, // assuming this structure for moneyList
            { turn: 1, price: 100}
        ]
      },
    };

    beforeEach(() => {
      (useGetStockDetail as jest.Mock).mockReturnValue({
        data: mockStockDetailData,
        isLoading: false,
        error: null,
      });
    });

    it('renders the graph container when data is loaded', () => {
      render(<StockGraph stockId={mockStockId} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('renders X-axis with correct ticks', () => {
      render(<StockGraph stockId={mockStockId} />);
      const xAxis = screen.getByTestId('x-axis');
      // Expected ticks are "1차", "2차", "3차", "4차", "5차"
      expect(within(xAxis).getByText('1차,2차,3차,4차,5차')).toBeInTheDocument();
    });

    it('renders Y-axis with calculated ticks', () => {
      // Based on the mock data: prices 10000, 12000, 11000, 13000, 12500
      // Min price in data: 10000, Max price in data: 13000
      // Base price (avg): (10000+12000+11000+13000+12500)/5 = 11700
      // Price range: 13000 - 10000 = 3000
      // dynamicMinPrice = Math.max(0, Math.floor((11700 - 3000 / 2 - 500) / 1000) * 1000)
      // dynamicMinPrice = Math.max(0, Math.floor((11700 - 1500 - 500) / 1000) * 1000)
      // dynamicMinPrice = Math.max(0, Math.floor(9700 / 1000) * 1000) = Math.max(0, 9 * 1000) = 9000
      // dynamicMaxPrice = Math.ceil((11700 + 3000 / 2 + 500) / 1000) * 1000
      // dynamicMaxPrice = Math.ceil((11700 + 1500 + 500) / 1000) * 1000
      // dynamicMaxPrice = Math.ceil(13700 / 1000) * 1000 = Math.ceil(13.7) * 1000 = 14 * 1000 = 14000
      // step = Math.max(1000, Math.ceil((14000 - 9000) / 8 / 1000) * 1000)
      // step = Math.max(1000, Math.ceil(5000 / 8 / 1000) * 1000)
      // step = Math.max(1000, Math.ceil(0.625) * 1000) = Math.max(1000, 1 * 1000) = 1000
      // Ticks: 9000, 10000, 11000, 12000, 13000, 14000
      render(<StockGraph stockId={mockStockId} />);
      const yAxis = screen.getByTestId('y-axis');
      expect(within(yAxis).getByText('9000,10000,11000,12000,13000,14000')).toBeInTheDocument();
    });
  });
});
