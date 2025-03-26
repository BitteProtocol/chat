import {
  Area,
  CartesianGrid,
  AreaChart as RechartsAreaChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartProps } from "../../../lib/chart-helpers";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart";


export const AreaChart = ({
  chartConfig,
  timeKey,
  metricKeys,
  chartData,
  dateFormatter,
  valueFormatter,
}: ChartProps) => {

  return (
    <ChartContainer
      config={chartConfig}
      className='bitte:min-h-[200px] bitte:w-full bitte:select-none'
    >
      <RechartsAreaChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} strokeOpacity={0.2} syncWithTicks />
        <XAxis
          dataKey={timeKey}
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
          interval='equidistantPreserveStart'
          tickFormatter={(value) => dateFormatter(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
          tickFormatter={(value) => valueFormatter(value, true)}
          scale='linear'
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator='dot'
              labelFormatter={(_value, payload) =>
                dateFormatter(payload[0].payload[timeKey], false)
              }
              valueFormatter={valueFormatter}
            />
          }
        />
        {metricKeys.map((key) => (
          <Area
            key={key}
            dataKey={key}
            type='natural'
            fill={chartConfig[key].color}
            stroke={chartConfig[key].color}
            fillOpacity={0.5}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
};
