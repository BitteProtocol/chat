import { ChartConfig } from '../components/ui/chart';

export type ChartType = 'line' | 'bar' | 'area' | 'candle';
export type DataFormat = 'number' | 'currency' | 'percentage';
export type TimeValue = string | number;
export type RawDataPoint = [TimeValue, number, ...number[]];
export type ChartDataPoint = {
  time: number;
  [key: string]: number;
};
export type OhlcDataPoint = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
};

export type MetricData = {
  metric: string;
  percentageChange: number;
  isPositive: boolean;
  isCandle: boolean;
};

export type ChartProps<T extends ChartType = ChartType> = {
  chartConfig: ChartConfig;
  timeKey: string;
  metricKeys: string[];
  chartData: T extends 'candle' ? OhlcDataPoint[] : ChartDataPoint[];
  dateFormatter: (timestamp: number, compact?: boolean) => string;
  valueFormatter: (value: unknown, compact?: boolean) => string;
};

export type ChartWrapperProps<T extends ChartType = ChartType> = Omit<
  ChartProps<T>,
  'dateFormatter' | 'valueFormatter' | 'metricKeys' | 'timeKey'
> & {
  title: string;
  description: string;
  metricLabels: string[];
  metricData: MetricData[];
  chartType: T;
  dataFormat?: DataFormat;
};

export type RenderChartArgs = Omit<
  ChartWrapperProps,
  'chartConfig' | 'chartData'
> & {
  metricLabels: string[];
  dataPoints: [TimeValue, ...number[]][];
};

export const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const parseTimestamp = (value: string | number): number => {
  if (typeof value === 'number') {
    // Heuristic: if the number is less than 10^11, it's probably in seconds, not ms.
    // Unix seconds from 1970 are around 1,000,000,000 (10^9),
    // whereas current ms timestamps are > 1,000,000,000,000 (10^12).
    return value < 100000000000 ? value * 1000 : value;
  } else if (typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${value}`);
    }
    return date.getTime();
  } else {
    throw new Error(`Unsupported timestamp type: ${typeof value}`);
  }
};

const getBestTimescale = (
  oldestTimestamp: number,
  latestTimestamp: number,
): 'year' | 'month' | 'day' | 'hour' | 'minute' => {
  const diffInMinutes = (latestTimestamp - oldestTimestamp) / (1000 * 60);

  if (diffInMinutes < 60) return 'minute';
  if (diffInMinutes < 24 * 60) return 'hour';
  if (diffInMinutes < 31 * 24 * 60) return 'day';
  if (diffInMinutes < 365 * 24 * 60) return 'month';
  return 'year';
};
const formatTimestamp = (
  timestamp: number,
  timescale: 'year' | 'month' | 'day' | 'hour' | 'minute',
  compact = false,
): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: timescale === 'minute' ? '2-digit' : undefined,
    minute: timescale === 'minute' ? '2-digit' : undefined,
  };

  if (!compact) {
    return date.toLocaleString('en-US', options);
  }

  // For compact view, remove fields based on timescale
  switch (timescale) {
    case 'minute':
      delete options.year;
      delete options.month;
      delete options.day;
      break;
    case 'hour':
      delete options.year;
      delete options.month;
      delete options.minute;
      break;
    case 'day':
      delete options.year;
      delete options.hour;
      delete options.minute;
      break;
    case 'month':
      delete options.day;
      delete options.hour;
      delete options.minute;
      break;
    case 'year':
      delete options.month;
      delete options.day;
      delete options.hour;
      delete options.minute;
      break;
  }

  return date.toLocaleString('en-US', options);
};

export const getDateFormatter = ({
  startTimeValue,
  endTimeValue,
}: {
  startTimeValue: TimeValue;
  endTimeValue: TimeValue;
}): ((timestamp: number, compact?: boolean) => string) => {
  const startTimestamp = parseTimestamp(startTimeValue);
  const endTimestamp = parseTimestamp(endTimeValue);
  const timescale = getBestTimescale(startTimestamp, endTimestamp);
  return (timestamp: number, compact = true) =>
    formatTimestamp(timestamp, timescale, compact);
};

export const formatValue = ({
  value,
  dataFormat,
  compact,
}: {
  value: unknown;
  dataFormat: DataFormat;
  compact?: boolean;
}): string => {
  if (typeof value === 'number') {
    const maximumFractionDigits = compact && value >= 10000 ? 0 : 2;

    if (dataFormat === 'currency') {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: compact ? 'compact' : 'standard',
        maximumFractionDigits,
      });
    }
    if (dataFormat === 'percentage') {
      return value.toLocaleString('en-US', {
        style: 'percent',
        notation: compact ? 'compact' : 'standard',
        maximumFractionDigits,
      });
    }
  }
  return value?.toString() || '';
};
