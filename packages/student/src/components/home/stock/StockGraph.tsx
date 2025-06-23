import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useState, useMemo, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { useGetStockDetail } from "@/apis";
import { useParams } from "react-router-dom";

interface DataPoint {
  phase: string;
  price: number;
  isMidPoint?: boolean;
}

interface ActivePoint {
  price: number | null;
  phase: string | null;
}

interface CustomLabelProps {
  viewBox?: {
    width: number;
    y: number;
  };
  value?: string;
}

const CustomLabel = ({ viewBox, value }: CustomLabelProps) => {
  if (!viewBox || !value) return null;

  const { width, y } = viewBox;

  return (
    <g transform={`translate(${width},${y})`}>
      <CustomLabelRect x={0} y={-12} width={110} height={24} rx={6} />
      <CustomLabelText x={55} y={0}>
        {value}
      </CustomLabelText>
    </g>
  );
};

// Utility functions
const generateSmoothedOffset = (basePrice: number, priceRange: number): number => {
  // 가격 범위의 2%로 변동폭 제한 (최소 50, 최대 300)
  const maxOffset = Math.min(300, Math.max(50, priceRange * 0.02));
  return (Math.random() - 0.5) * 2 * maxOffset;
};

const generateDataWithFluctuation = (
  baseData: Array<{ phase: string; price: number }>
): DataPoint[] => {
  if (baseData.length < 2) return baseData;

  const result: DataPoint[] = [];
  const priceRange = Math.max(...baseData.map(d => d.price)) - Math.min(...baseData.map(d => d.price));

  for (let i = 0; i < baseData.length - 1; i++) {
    result.push(baseData[i]);

    const currentPrice = baseData[i].price;
    const nextPrice = baseData[i + 1].price;
    const avgPrice = (currentPrice + nextPrice) / 2;

    // 부드러운 곡선을 위한 중간점 생성 (4개 → 3개로 줄임)
    for (let j = 1; j <= 3; j++) {
      const ratio = j / 4;
      const baseInterpolation = currentPrice * (1 - ratio) + nextPrice * ratio;

      // 베지어 곡선 같은 부드러운 보간
      const smoothFactor = Math.sin(ratio * Math.PI) * 0.3; // 중간에서 최대
      const smoothedPrice = baseInterpolation + (avgPrice - baseInterpolation) * smoothFactor;

      // 작은 랜덤 변동 추가
      const finalPrice = smoothedPrice + generateSmoothedOffset(avgPrice, priceRange);

      result.push({
        phase: "",
        price: Math.max(0, finalPrice), // 음수 방지
        isMidPoint: true,
      });
    }
  }

  result.push(baseData[baseData.length - 1]);
  return result;
};

const calculatePriceRange = (prices: number[]) => {
  if (prices.length === 0) {
    return { MIN_PRICE: 0, MAX_PRICE: 10000, ticks: [] };
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const basePrice = (minPrice + maxPrice) / 2;

  // 패딩을 가격 범위의 15%로 설정 (기존 500 고정값 대신)
  const padding = Math.max(500, priceRange * 0.15);

  const dynamicMinPrice = Math.max(
    0,
    Math.floor((minPrice - padding) / 1000) * 1000
  );
  const dynamicMaxPrice = Math.ceil((maxPrice + padding) / 1000) * 1000;

  // 더 적절한 틱 간격 계산
  const totalRange = dynamicMaxPrice - dynamicMinPrice;
  const idealTickCount = 6; // 틱 개수를 8개에서 6개로 줄임
  const rawStep = totalRange / idealTickCount;

  // 깔끔한 단위로 스텝 조정
  const step = rawStep <= 1000 ? 500 :
    rawStep <= 2000 ? 1000 :
      rawStep <= 5000 ? 2000 :
        Math.ceil(rawStep / 1000) * 1000;

  // 틱 생성
  const ticks: number[] = [];
  for (let i = dynamicMinPrice; i <= dynamicMaxPrice; i += step) {
    ticks.push(i);
  }

  return {
    MIN_PRICE: dynamicMinPrice,
    MAX_PRICE: dynamicMaxPrice,
    ticks,
  };
};

// Loading Component
const LoadingComponent = () => (
  <LoadingContainer>
    <LoadingSpinner />
    <LoadingText>데이터를 불러오는 중...</LoadingText>
  </LoadingContainer>
);

// Error Component
const ErrorComponent = () => (
  <ErrorContainer>
    <ErrorContent>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorText>데이터를 불러오는데 실패했습니다.</ErrorText>
    </ErrorContent>
  </ErrorContainer>
);

// Axis styles
const axisTickStyle = {
  fill: color.zinc[600],
  fontSize: 12,
  fontWeight: 500,
};

const referenceLineStyle = {
  stroke: color.blue[500],
  strokeDasharray: "5 5",
  strokeWidth: 1.5,
  opacity: 0.8,
};

const activeDotStyle = {
  fill: color.blue[500],
  stroke: "white",
  strokeWidth: 3,
  r: 6,
  style: {
    transition: "none",
    filter: "drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))",
  },
};

export const StockGraph = () => {
  // 상태 관리
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);
  const [activePoint, setActivePoint] = useState<ActivePoint>({
    price: null,
    phase: null,
  });

  // 데이터 패치
  const { stockId } = useParams<{ stockId: string }>();
  const {
    data: stockDetail,
    isLoading,
    error,
  } = useGetStockDetail(Number(stockId));

  // 초기 애니메이션 제어
  useEffect(() => {
    const timer = setTimeout(() => setShouldAnimate(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 차트 데이터 가공
  const chartData = useMemo(() => {
    if (!stockDetail?.moneyList) return [];
    const baseData = stockDetail.moneyList.map((price, index) => ({
      phase: `${index}차`,
      price,
    }));
    return generateDataWithFluctuation(baseData);
  }, [stockDetail]);

  // 가격 범위 계산
  const priceConfig = useMemo(() => {
    return calculatePriceRange(stockDetail?.moneyList || []);
  }, [stockDetail]);

  // X축 라벨
  const xAxisTicks = useMemo(() => {
    return stockDetail?.moneyList.map((_, index) => `${index}차`) || [];
  }, [stockDetail]);

  // 마우스 이벤트 핸들러
  const handleMouseMove = useCallback((event: any) => {
    const payload = event.activePayload?.[0]?.payload;
    if (payload && payload.phase && !payload.isMidPoint) {
      setActivePoint({
        price: payload.price,
        phase: payload.phase,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActivePoint({ price: null, phase: null });
  }, []);

  // 숫자 포맷
  const formatPrice = useCallback((price: number) => {
    return Math.round(price).toLocaleString();
  }, []);

  // 로딩 및 에러 처리
  if (isLoading) return <ChartContainer><LoadingComponent /></ChartContainer>;
  if (error) return <ChartContainer><ErrorComponent /></ChartContainer>;

  return (
    <ChartContainer>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ right: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={color.zinc[200]}
            opacity={0.6}
          />
          <XAxis
            dataKey="phase"
            axisLine={false}
            tickLine={false}
            tick={axisTickStyle}
            tickSize={16}
            padding={{ left: 15, right: 15 }}
            ticks={xAxisTicks}
          />
          <YAxis
            orientation="right"
            domain={[priceConfig.MIN_PRICE, priceConfig.MAX_PRICE]}
            ticks={priceConfig.ticks}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatPrice}
            tick={axisTickStyle}
            tickSize={16}
          />
          <Tooltip content={() => null} />

          {/* 현재 포인트 기준 Reference Line */}
          {activePoint.price && activePoint.phase && (
            <>
              <ReferenceLine x={activePoint.phase} {...referenceLineStyle} />
              <ReferenceLine
                y={activePoint.price}
                {...referenceLineStyle}
                label={
                  <CustomLabel value={formatPrice(activePoint.price)} />
                }
                offset={10}
              />
            </>
          )}

          {/* 차트 선 */}
          <Line
            type="linear"
            dataKey="price"
            stroke={color.blue[500]}
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              ...activeDotStyle,
              r: 5,
            }}
            isAnimationActive={shouldAnimate}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-in-out"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 556px;
  padding: 40px;
  background-color: ${color.white};
  border-radius: 16px;
  border: 1px solid ${color.zinc[200]};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid ${color.zinc[200]};
  border-top-color: ${color.blue[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.span`
  margin-left: 12px;
  color: ${color.zinc[600]};
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ErrorContent = styled.div`
  text-align: center;
`;

const ErrorIcon = styled.div`
  color: ${color.red[500]};
  font-size: 24px;
  margin-bottom: 8px;
`;

const ErrorText = styled.p`
  color: ${color.zinc[600]};
  margin: 0;
  font-weight: 500;
`;

const CustomLabelRect = styled.rect`
  fill: ${color.blue[500]};
  filter: drop-shadow(0 2px 4px rgba(37, 99, 235, 0.2));
`;

const CustomLabelText = styled.text`
  fill: white;
  font-size: 14px;
  font-weight: 500;
  text-anchor: middle;
  dominant-baseline: middle;
`;