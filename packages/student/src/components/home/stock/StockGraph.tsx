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

const BASE_PRICE = 53500;
const MIN_PRICE = BASE_PRICE - 3500;
const MAX_PRICE = BASE_PRICE + 3500;

const CustomLabel = ({ viewBox, value }: any) => {
  if (!viewBox || !value) return null;

  // 오른쪽 끝에서 20px 여백
  const labelX = viewBox.width + 30;
  const labelY = viewBox.y;

  return (
    <g transform={`translate(${labelX},${labelY})`}>
      <rect x={0} y={-12} width={120} height={24} fill={color.blue[500]} />
      <text
        x={50}
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

export const StockGraph = () => {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setShouldAnimate(false), 500); // 애니메이션이 실행된 후 비활성화
  }, []);

  const data = [
    { phase: '1차', price: BASE_PRICE + 200 },
    { phase: '2차', price: BASE_PRICE - 300 },
    { phase: '3차', price: BASE_PRICE + 450 },
    { phase: '4차', price: BASE_PRICE - 700 },
    { phase: '5차', price: BASE_PRICE + 200 },
  ];

  const generateFixedTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = 1000;
    for (let i = 0; i < 8; i++) {
      ticks.push(MIN_PRICE + step * i);
    }
    return ticks;
  }, []);

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

  return (
    <div style={{ width: '100%', height: '556px', padding: '0 20px' }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={color.zinc[200]} />
          <XAxis
            dataKey="phase"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#000' }}
            tickSize={16}
            padding={{ left: 15, right: 15 }} // X축 패딩 조정
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
            isAnimationActive={shouldAnimate} // ✅ 처음 렌더링 시에만 애니메이션 실행
            animationBegin={0} // ✅ 마우스를 움직일 때 불필요한 딜레이 방지
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
