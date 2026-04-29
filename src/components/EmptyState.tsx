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
        className="mb-6 rounded-xl bg-surface-1 border border-surface-3 p-6"
      >
        <BarChart3 className="h-16 w-16 text-text-icon" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-text-heading">RTS Management Dashboard</h2>
      <p className="mb-8 max-w-md text-center text-sm text-text-body">
        Upload a CSV file to begin analyzing delivery performance, RTS patterns, and employee metrics.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-surface-3 bg-surface-2/50 p-4 text-center">
          <Database className="mx-auto mb-2 h-6 w-6 text-text-icon" />
          <h4 className="text-sm font-medium text-text-subtle">CSV Upload</h4>
          <p className="mt-1 text-xs text-text-body">Drop or browse for your delivery tracking CSV</p>
        </div>
        <div className="rounded-lg border border-surface-3 bg-surface-2/50 p-4 text-center">
          <ArrowUpCircle className="mx-auto mb-2 h-6 w-6 text-text-icon" />
          <h4 className="text-sm font-medium text-text-subtle">Auto-Mapping</h4>
          <p className="mt-1 text-xs text-text-body">Headers are mapped automatically, no config needed</p>
        </div>
        <div className="rounded-lg border border-surface-3 bg-surface-2/50 p-4 text-center">
          <BarChart3 className="mx-auto mb-2 h-6 w-6 text-text-icon" />
          <h4 className="text-sm font-medium text-text-subtle">Live Analytics</h4>
          <p className="mt-1 text-xs text-text-body">Charts and tables update in real-time with filters</p>
        </div>
      </div>
    </motion.div>
  );
}
