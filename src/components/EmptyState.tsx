import { motion } from 'framer-motion';
import { BarChart3, Database, ArrowUpCircle } from 'lucide-react';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 rounded-xl bg-[#141927] border border-[#1a2035] p-6"
      >
        <BarChart3 className="h-16 w-16 text-[#4a6590]" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-[#c0cce0]">RTS Management Dashboard</h2>
      <p className="mb-8 max-w-md text-center text-sm text-[#5a6480]">
        Upload a CSV file to begin analyzing delivery performance, RTS patterns, and employee metrics.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[#1a2035] bg-[#0f1320]/50 p-4 text-center">
          <Database className="mx-auto mb-2 h-6 w-6 text-[#4a6590]" />
          <h4 className="text-sm font-medium text-[#8892a8]">CSV Upload</h4>
          <p className="mt-1 text-xs text-[#5a6480]">Drop or browse for your delivery tracking CSV</p>
        </div>
        <div className="rounded-lg border border-[#1a2035] bg-[#0f1320]/50 p-4 text-center">
          <ArrowUpCircle className="mx-auto mb-2 h-6 w-6 text-[#4a6590]" />
          <h4 className="text-sm font-medium text-[#8892a8]">Auto-Mapping</h4>
          <p className="mt-1 text-xs text-[#5a6480]">Headers are mapped automatically, no config needed</p>
        </div>
        <div className="rounded-lg border border-[#1a2035] bg-[#0f1320]/50 p-4 text-center">
          <BarChart3 className="mx-auto mb-2 h-6 w-6 text-[#4a6590]" />
          <h4 className="text-sm font-medium text-[#8892a8]">Live Analytics</h4>
          <p className="mt-1 text-xs text-[#5a6480]">Charts and tables update in real-time with filters</p>
        </div>
      </div>
    </motion.div>
  );
}
