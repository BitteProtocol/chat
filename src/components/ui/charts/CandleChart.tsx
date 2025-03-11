import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartProps } from '../../../lib/chart-helpers';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../chart';

const TOOLTIP_LABELS = ['O', 'H', 'L', 'C'];

export const CandleChart = ({
  chartConfig,
  timeKey,
  chartData,
  dateFormatter,
  valueFormatter,
}: ChartProps<'candle'>) => {
  const data = chartData.map((point) => {
    const open = point.open;
    const close = point.close;
    const high = point.high;
    const low = point.low;

    const up = close > open;
    const candleLow = Math.min(open, close);
    const candleHigh = Math.max(open, close);
    const candleHeight = Math.max(Math.abs(close - open), 0.005);

    return {
      time: point.time,
      open,
      close,
      high,
      low,
      candleLow,
      candleHigh,
      wickTop: Math.abs(high - candleHigh),
      wickBottom: Math.abs(low - candleLow),
      candleHeight,
      candleColor: up
        ? 'bitte-fill-shad-green-success'
        : 'bitte-fill-shad-red-100', // Using literal hex colors instead of class names
      diff: point.close - point.open,
      diffPercent: ((point.close - point.open) / point.open) * 100,
    };
  });

  const maxValue: number = data.reduce(
    (max, point) => Math.max(point.high, max),
    -Infinity,
  );

  const minValue: number = data.reduce(
    (min, point) => Math.min(point.low, min),
    Infinity,
  );
  const tickPadding = (maxValue - minValue) / 2;

  const [minHeight, maxHeight] = [
    minValue - tickPadding,
    maxValue + tickPadding,
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="bitte-min-h-[200px] bitte-w-full bitte-select-none"
    >
      <ComposedChart
        data={data}
        accessibilityLayer
        barCategoryGap={0}
        stackOffset="sign"
      >
        <CartesianGrid strokeOpacity={0.2} syncWithTicks strokeWidth={1} />
        <XAxis
          dataKey={timeKey}
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
          interval="equidistantPreserveStart"
          tickFormatter={(value) => dateFormatter(value)}
        />
        <YAxis
          orientation="left"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => valueFormatter(value, true)}
          type="number"
          domain={[minHeight, maxHeight]}
          allowDataOverflow={true}
          scale="linear"
          interval="preserveEnd"
        />
        <ChartTooltip
          cursor={true}
          labelFormatter={(_label, payload) => {
            return dateFormatter(payload[0].payload[timeKey], false);
          }}
          content={
            <ChartTooltipContent
              formatter={(_value, _name, entry) => {
                if (!entry || entry.type === 'none') return;

                const diff = entry.payload.diff;
                const diffPercent = entry.payload.diffPercent;
                const values = ['open', 'high', 'low', 'close'].map(
                  (key) => entry.payload[key],
                );

                return (
                  <div className="bitte--mb-4 bitte-grid bitte-grid-cols-2 bitte-gap-2">
                    <p style={{ color: entry.payload.candleColor }}>
                      {diff > 0 ? '+' : ''}
                      {valueFormatter(diff)}
                    </p>
                    <p style={{ color: entry.payload.candleColor }}>
                      {diffPercent > 0 ? '+' : ''}
                      {diffPercent.toFixed(2)}% (24hr)
                    </p>
                    {values.map((value, index) => (
                      <p key={TOOLTIP_LABELS[index]}>
                        <span className="bitte-text-muted-foreground">
                          {TOOLTIP_LABELS[index]}:
                        </span>{' '}
                        {valueFormatter(value)}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
          }
        />
        {/* y-axis offset */}
        <Bar dataKey="low" stackId="stack" fillOpacity={0} />
        {/* wick bottom */}
        <Bar
          dataKey="wickBottom"
          stackId="stack"
          tooltipType="none"
          maxBarSize={1}
        >
          {data.map((entry) => (
            <Cell
              key={`wick-bottom-${entry.time}`}
              className={entry.candleColor}
            />
          ))}
        </Bar>
        {/* candle body */}
        maxBarSize={1}
        <Bar dataKey="candleHeight" stackId="stack" tooltipType="none">
          {data.map((entry) => (
            <Cell
              key={`candle-body-${entry.time}`}
              className={entry.candleColor}
            />
          ))}
        </Bar>
        {/* wick top */}
        <Bar
          dataKey="wickTop"
          stackId="stack"
          tooltipType="none"
          maxBarSize={1}
        >
          {data.map((entry) => (
            <Cell
              key={`wick-top-${entry.time}`}
              className={entry.candleColor}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ChartContainer>
  );
};
