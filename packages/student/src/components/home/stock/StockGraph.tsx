import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { color } from '@mozu/design-token';
import { useGetStockDetail } from '@/apis';
import { StockDetailResponse } from '@/apis/types/stock';

const CustomLabel = ({ viewBox, value }: any) => {
  if (!viewBox || !value) return null;

  const labelX = viewBox.width;
  const labelY = viewBox.y;

  return (
    <g transform={`translate(${labelX},${labelY})`}>
      <rect x={0} y={-12} width={110} height={24} fill={color.blue[500]} />
      <text
        x={45}
        y={0}
        fill="white"
        fontSize={16}
        fontWeight={400}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    </g>
  );
};

interface StockGraphProps {
  stockId: number;
}

export const StockGraph = ({ stockId }: StockGraphProps) => {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);
  const { data: stockDetail, isLoading, error } = useGetStockDetail(stockId);

  useEffect(() => {
    setTimeout(() => setShouldAnimate(false), 500);
  }, []);

  const generateRandomOffset = () => Math.floor(Math.random() * 1500) - 750;

  const generateDataWithFluctuation = (
    baseData: Array<{ phase: string; price: number }>,
  ) => {
    const newData = [];
    for (let i = 0; i < baseData.length - 1; i++) {
      newData.push(baseData[i]);

      for (let j = 1; j <= 4; j++) {
        const ratio = j / 4;
        const midPrice =
          baseData[i].price * (1 - ratio) +
          baseData[i + 1].price * ratio +
          generateRandomOffset();

        newData.push({
          phase: '',
          price: midPrice,
          isMidPoint: true,
        });
      }
    }
    newData.push(baseData[baseData.length - 1]);
    return newData;
  };

  // 데이터 생성 부분 수정
  const data = useMemo(() => {
    if (!stockDetail?.data?.stockDataList) return [];
    const baseData = stockDetail.data.stockDataList.map((item) => ({
      phase: `${item.turn}차`,
      price: item.nowPrice,
    }));
    return generateDataWithFluctuation(baseData);
  }, [stockDetail]);

  const { MIN_PRICE, MAX_PRICE, generateFixedTicks } = useMemo(() => {
    if (!stockDetail?.data?.stockDataList || stockDetail.data.stockDataList.length === 0) {
      return { MIN_PRICE: 0, MAX_PRICE: 10000, generateFixedTicks: [] };
    }
    const prices = stockDetail.data.stockDataList.map(item => item.nowPrice);
    const basePrice = prices.reduce((acc, p) => acc + p, 0) / prices.length;
    const priceRange = Math.max(...prices) - Math.min(...prices);
    const dynamicMinPrice = Math.max(0, Math.floor((basePrice - priceRange / 2 - 500) / 1000) * 1000);
    const dynamicMaxPrice = Math.ceil((basePrice + priceRange / 2 + 500) / 1000) * 1000;
    
    const ticks: number[] = [];
    const step = Math.max(1000, Math.ceil((dynamicMaxPrice - dynamicMinPrice) / 8 / 1000) * 1000);
    for (let i = dynamicMinPrice; i <= dynamicMaxPrice; i += step) {
      ticks.push(i);
    }
    return { MIN_PRICE: dynamicMinPrice, MAX_PRICE: dynamicMaxPrice, generateFixedTicks: ticks };
  }, [stockDetail]);


  const [activePoint, setActivePoint] = useState<{
    price: number | null;
    phase: string | null;
  }>({ price: null, phase: null });

  const handleMouseMove = useCallback((e: any) => {
    if (e.activePayload?.[0]?.payload) {
      const { price, phase } = e.activePayload[0].payload;
      setActivePoint({ price, phase });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActivePoint({ price: null, phase: null });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <div style={{ width: '100%', height: '556px', padding: '0 20px' }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ right: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={color.zinc[200]} />
          // XAxis 컴포넌트에 다음 prop 추가
          <XAxis
            dataKey="phase"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#000' }}
            tickSize={16}
            padding={{ left: 15, right: 15 }}
            ticks={stockDetail?.data?.stockDataList.map(item => `${item.turn}차`) ?? []}
          />
          <YAxis
            orientation="right"
            domain={[MIN_PRICE, MAX_PRICE]}
            ticks={generateFixedTicks}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${Math.round(v).toLocaleString()}`}
            tick={{ fill: '#000' }}
            tickSize={16}
          />
          <Tooltip content={() => null} />
          {activePoint.price && activePoint.phase && (
            <>
              <ReferenceLine
                x={activePoint.phase}
                stroke="#2563eb"
                strokeDasharray="5 5"
              />
              <ReferenceLine
                y={activePoint.price}
                stroke="#2563eb"
                strokeDasharray="5 5"
                label={
                  <CustomLabel
                    value={`${activePoint.price.toLocaleString()}`}
                  />
                }
                offset={10}
              />
            </>
          )}
          <Line
            type="linear"
            dataKey="price"
            stroke={color.blue[500]}
            strokeWidth={2}
            dot={false}
            activeDot={{
              fill: color.blue[500],
              stroke: color.blue[500],
              style: { transition: 'none' },
            }}
            isAnimationActive={shouldAnimate}
            animationBegin={0}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
