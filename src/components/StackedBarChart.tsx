import { useMemo, useRef, useEffect, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { getBarChartData } from '../lib/utils';

const COLORS = [
  '#facc15', '#14b8a6', '#fb923c', '#a855f7', '#3b82f6',
  '#f43f5e', '#22c55e', '#6366f1', '#ec4899', '#f97316',
  '#06b6d4', '#8b5cf6',
];

export default function StackedBarChart() {
  const filteredData = useDashboardStore(s => s.filteredData);
  const filters = useDashboardStore(s => s.filters);
  const setFilters = useDashboardStore(s => s.setFilters);
  const chartRef = useRef<ReactECharts>(null);

  const barData = useMemo(() => getBarChartData(filteredData), [filteredData]);
  const dates = useMemo(() => barData.map(d => d.date), [barData]);
  const codes = useMemo(() => {
    const allCodes = new Set<string>();
    for (const d of barData) {
      for (const code of Object.keys(d.counts)) {
        allCodes.add(code);
      }
    }
    return Array.from(allCodes).sort();
  }, [barData]);

  const series = useMemo(() => {
    return codes.map((code, i) => ({
      name: code,
      type: 'bar' as const,
      stack: 'total',
      emphasis: { focus: 'series' as const },
      data: barData.map(d => d.counts[code] || 0),
      itemStyle: {
        color: COLORS[i % COLORS.length],
        borderRadius: i === codes.length - 1 ? [4, 4, 0, 0] : undefined,
      },
      barWidth: '60%',
    }));
  }, [barData, codes]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const handleClick = useCallback((params: Record<string, unknown>) => {
    if (params.componentType !== 'series') return;
    const clickedDateStr = params.axisValue as string | undefined;
    if (!clickedDateStr) return;

    const [y, m, d] = clickedDateStr.split('-').map(Number);
    const clicked = new Date(y, m - 1, d);

    const range = filters.dateRange;
    if (range && range[0] && range[1]) {
      if (isSameDay(range[0], clicked) && isSameDay(range[1], clicked)) {
        setFilters({ dateRange: null });
        return;
      }
    }

    const clickedEnd = new Date(clicked.getTime() + 86400000);
    setFilters({ dateRange: [clicked, clickedEnd] });
  }, [filters.dateRange, setFilters]);

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    if (chart) {
      chart.on('click', handleClick);
      return () => {
        chart.off('click', handleClick);
      };
    }
  }, [handleClick]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20,24,36,0.96)',
      borderColor: 'rgba(42,47,69,0.5)',
      borderWidth: 1,
      textStyle: { color: '#c8cdd8', fontSize: 13 },
      formatter: (params: { axisValue?: string; seriesName?: string; value?: number; marker?: string }[]) => {
        const date = (params[0]?.axisValue as string) || '';
        let html = `<div style="font-weight:600;margin-bottom:6px;color:#c8cdd8;">${date}</div>`;
        for (const p of params) {
          html += `<div style="display:flex;justify-content:space-between;gap:16px;color:#6b7394;">
            <span>${p.marker} ${p.seriesName}:</span>
            <strong style="color:#c8cdd8;">${p.value}</strong>
          </div>`;
        }
        const row = barData.find(d => d.date === date);
        if (row) {
          html += `<div style="border-top:1px solid rgba(42,47,69,0.3);margin-top:6px;padding-top:4px;font-weight:600;color:#c8cdd8;">
            Total RTS: ${row.total}
          </div>`;
        }
        return html;
      },
    },
    legend: {
      data: codes,
      top: 0,
      textStyle: { fontSize: 11, color: '#6b7394' },
      itemWidth: 12,
      itemHeight: 10,
    },
    grid: { left: 50, right: 20, top: 60, bottom: 80, containLabel: false },
    xAxis: {
      type: 'category' as const,
      data: dates,
      axisLabel: {
        fontSize: 11,
        color: '#6b7394',
        rotate: 45,
        interval: 'auto',
        formatter: (val: string) => {
          const [y, m, d] = val.split('-').map(Number);
          const dt = new Date(y, m - 1, d);
          return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        },
      },
      axisLine: { lineStyle: { color: 'rgba(42,47,69,0.3)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { fontSize: 11, color: '#6b7394' },
      splitLine: { lineStyle: { color: 'rgba(42,47,69,0.15)', type: 'dashed' } },
      axisLine: { show: false },
    },
    dataZoom: [
      {
        type: 'slider' as const,
        xAxisIndex: [0],
        start: 0,
        end: 100,
        bottom: 10,
        height: 20,
        handleSize: '80%',
        borderColor: 'rgba(42,47,69,0.4)',
        fillerColor: 'rgba(30,58,95,0.3)',
      },
      { type: 'inside' as const, xAxisIndex: [0], start: 0, end: 100 },
    ],
    series,
  }), [barData, codes, dates, series]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-lg border border-border bg-card/50 p-5"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Daily RTS Trends</h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Stacked bars show RTS codes by day. Click a bar to filter to that date.
      </p>
      <ReactECharts
        key={`${dates.length}x${codes.join(',')}`}
        ref={chartRef}
        option={option}
        style={{ height: 320, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </motion.div>
  );
}
