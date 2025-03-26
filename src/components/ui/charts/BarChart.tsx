import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartProps } from "../../../lib/chart-helpers";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../chart";


export const BarChart = ({
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
      <RechartsBarChart data={chartData}>
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
          <Bar
            key={key}
            dataKey={key}
            fill={chartConfig[key].color}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
