import { memo, useMemo } from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

import {
  formatValue,
  getDateFormatter,
  type ChartWrapperProps,
} from "../../../lib/chart-helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { AreaChart } from "./AreaChart";
import { BarChart } from "./BarChart";
import { CandleChart } from "./CandleChart";
import { LineChart } from "./LineChart";

const CHART_COMPONENTS = {
  candle: CandleChart,
  area: AreaChart,
  bar: BarChart,
  line: LineChart,
} as const;

export const ChartWrapper = memo(
  ({
    title,
    description,
    chartConfig,
    chartData,
    metricData,
    chartType = "line",
    dataFormat = "currency",
  }: ChartWrapperProps) => {
    const ChartComponent = CHART_COMPONENTS[chartType];

    const [timeKey, ...metricKeys] = Object.keys(chartConfig);

    const { startTimeValue, endTimeValue } = useMemo(
      () => ({
        startTimeValue: chartData[0][timeKey as keyof (typeof chartData)[0]],
        endTimeValue:
          chartData[chartData.length - 1][
            timeKey as keyof (typeof chartData)[0]
          ],
      }),
      [chartData, timeKey]
    );

    const dateFormatter = useMemo(
      () =>
        getDateFormatter({
          startTimeValue,
          endTimeValue,
        }),
      [startTimeValue, endTimeValue]
    );

    const valueFormatter = useMemo(
      () =>
        (value: unknown, compact = false) =>
          formatValue({ value, dataFormat, compact }),
      [dataFormat]
    );

    const showMetricData = metricData && metricData.length > 0;

    const startDate = useMemo(
      () => dateFormatter(startTimeValue, false),
      [dateFormatter, startTimeValue]
    );

    const endDate = useMemo(
      () => dateFormatter(endTimeValue, false),
      [dateFormatter, endTimeValue]
    );

    return (
      <Card className='bitte:max-lg:-mx-4 bitte:max-lg:p-2'>
        <CardHeader className='bitte:max-lg:p-2'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='bitte:pb-0 bitte:max-lg:p-2'>
          <ChartComponent
            chartConfig={chartConfig}
            timeKey={timeKey}
            metricKeys={metricKeys}
            chartData={chartData}
            dateFormatter={dateFormatter}
            valueFormatter={valueFormatter}
          />
        </CardContent>
        {showMetricData ? (
          <CardFooter className='bitte:pt-2'>
            <div className='bitte:grid bitte:w-full bitte:grid-cols-2 bitte:gap-2 bitte:text-sm'>
              {metricData.map(
                ({ metric, percentageChange, isPositive, isCandle }) => (
                  <div key={metric} className='bitte:grid bitte:gap-2'>
                    <div className='bitte:flex bitte:items-center bitte:gap-2 bitte:font-medium bitte:leading-none'>
                      {isCandle ? null : (
                        <div className='bitte:flex bitte:items-center bitte:gap-2'>
                          <div
                            className='bitte:size-4 bitte:rounded-sm'
                            style={{
                              backgroundColor: chartConfig[metric].color,
                            }}
                          />
                          {chartConfig[metric].label || metric}
                        </div>
                      )}
                      {isPositive ? "Trending Up" : "Trending Down"} by{" "}
                      {Math.abs(percentageChange).toFixed(1)}%{" "}
                      {isPositive ? (
                        <TrendingUp className='bitte:size-4 bitte:text-shad-green-success' />
                      ) : (
                        <TrendingDown className='bitte:size-4 bitte:text-shad-red-100' />
                      )}
                    </div>
                  </div>
                )
              )}
              <div className='bitte:col-span-2 bitte:flex bitte:items-center bitte:gap-2 bitte:leading-none bitte:text-muted-foreground'>
                {startDate} - {endDate}
              </div>
            </div>
          </CardFooter>
        ) : null}
      </Card>
    );
  }
);

ChartWrapper.displayName = "ChartWrapper";
