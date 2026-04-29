import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { useChartTheme } from '../hooks/useChartTheme';
import { getRTSDistribution } from '../lib/utils';

const COLORS = [
  '#facc15', '#14b8a6', '#fb923c', '#a855f7', '#3b82f6',
  '#f43f5e', '#22c55e', '#6366f1', '#ec4899', '#f97316',
  '#06b6d4', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b',
  '#6ee7b7', '#c084fc',
];

export default function RTSPieChart() {
  const filteredData = useDashboardStore(s => s.filteredData);
  const theme = useChartTheme();

  const pieData = useMemo(() => getRTSDistribution(filteredData), [filteredData]);
  const total = useMemo(() => pieData.reduce((sum, d) => sum + d.value, 0), [pieData]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number }) => {
        const pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
        return `<div style="font-weight:600;margin-bottom:4px;color:${theme.tooltipText};">${params.name}</div>
                <div style="color:${theme.tooltipMuted};">Count: <strong style="color:${theme.tooltipText};">${params.value}</strong></div>
                <div style="color:${theme.tooltipMuted};">Percentage: <strong style="color:${theme.tooltipText};">${pct}%</strong></div>`;
      },
      backgroundColor: theme.tooltipBg,
      borderColor: theme.tooltipBorder,
      borderWidth: 1,
      textStyle: { color: theme.tooltipText, fontSize: 13 },
    },
    legend: {
      show: false,
    },
    series: [{
      name: 'RTS Codes',
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: theme.pieBorder,
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        fontSize: 10,
        color: theme.pieLabel,
        formatter: (params: { name: string; percent: number }) =>
          params.percent > 1 ? `{name|${params.name}}\n{pct|${params.percent.toFixed(1)}%}` : '',
        rich: {
          name: { fontSize: 10, color: theme.pieLabelName, lineHeight: 14 },
          pct: { fontSize: 9, color: theme.pieLabel, lineHeight: 12 },
        },
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 30,
        smooth: true,
        lineStyle: { color: theme.pieLine, width: 1 },
      },
      emphasis: {
        scale: true,
        scaleSize: 10,
        itemStyle: {
          shadowBlur: 25,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx: number) => idx * 100,
      data: pieData.map((d, i) => ({
        ...d,
        itemStyle: {
          color: COLORS[i % COLORS.length],
        },
      })),
    }],
    animationDuration: 800,
    animationEasing: 'cubicOut',
  }), [pieData, total, theme]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-lg border border-border bg-card/50 p-5"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">RTS Code Distribution</h3>
        <span className="rounded-full bg-card border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {total} total
        </span>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 350, width: '100%' }}
        opts={{ renderer: 'canvas' }}
        showLoading={false}
      />
    </motion.div>
  );
}
