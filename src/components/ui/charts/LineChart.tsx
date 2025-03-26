import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../chart";
import { type ChartProps } from "../../../lib/chart-helpers";

export const LineChart = ({
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
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeOpacity={0.2} syncWithTicks />
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
          tickFormatter={(value) => valueFormatter(value, true)}
          domain={["auto", "auto"]}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator='line'
              labelFormatter={(_value, payload) =>
                dateFormatter(payload[0].payload[timeKey], false)
              }
              valueFormatter={valueFormatter}
            />
          }
        />
        {metricKeys.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type='linear'
            stroke={chartConfig[key].color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};
