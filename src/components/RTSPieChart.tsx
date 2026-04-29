import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { getRTSDistribution } from '../lib/utils';

const COLORS = [
  '#1e3a5f', '#2a4a6b', '#3a5a85', '#4a6590', '#5a7aaa',
  '#6b8cba', '#8aa0be', '#a0b4cc',
  '#5c4066', '#4a3050', '#6b2d4a', '#1e4055',
];

export default function RTSPieChart() {
  const filteredData = useDashboardStore(s => s.filteredData);

  const pieData = useMemo(() => getRTSDistribution(filteredData), [filteredData]);
  const total = useMemo(() => pieData.reduce((sum, d) => sum + d.value, 0), [pieData]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number }) => {
        const pct = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
        return `<div style="font-weight:600;margin-bottom:4px;color:#8892a8;">${params.name}</div>
                <div style="color:#5a6480;">Count: <strong style="color:#8892a8;">${params.value}</strong></div>
                <div style="color:#5a6480;">Percentage: <strong style="color:#8892a8;">${pct}%</strong></div>`;
      },
      backgroundColor: 'rgba(12,15,24,0.96)',
      borderColor: 'rgba(42,53,85,0.5)',
      borderWidth: 1,
      textStyle: { color: '#8892a8', fontSize: 13 },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { fontSize: 12, color: '#5a6480' },
      itemWidth: 12,
      itemHeight: 12,
    },
    series: [{
      name: 'RTS Codes',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#0c0f18',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
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
  }), [pieData, total]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-lg border border-[#1a2035] bg-[#0f1320]/50 p-5"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#8892a8]">RTS Code Distribution</h3>
        <span className="rounded-full bg-[#141927] border border-[#1a2035] px-2.5 py-0.5 text-xs font-medium text-[#5a6480]">
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
