import { useDashboardStore } from './store/useDashboardStore';
import CSVUpload from './components/CSVUpload';
import FilterBar from './components/FilterBar';
import RTSPieChart from './components/RTSPieChart';
import StackedBarChart from './components/StackedBarChart';
import Element3 from './components/Element3';
import DetailTable from './components/DetailTable';
import EmptyState from './components/EmptyState';
import ThemeToggle from './components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, FileText } from 'lucide-react';

function Dashboard() {
  const rawData = useDashboardStore(s => s.rawData);
  const fileName = useDashboardStore(s => s.fileName);
  const filteredData = useDashboardStore(s => s.filteredData);

  return (
    <div className="min-h-screen bg-[#0c0f18]">
      <header className="border-b border-[#1a2035] sticky top-0 z-50 bg-[#0c0f18]/90 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#1e3a5f]/40 p-2">
                <BarChart3 className="h-5 w-5 text-[#6b9fd4]" />
              </div>
              <div>
                <h1 className="text-sm font-medium text-[#c0cce0]">RTS Dashboard</h1>
                <p className="text-xs text-[#5a6480]">Delivery Performance Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {fileName && (
                <div className="flex items-center gap-2 rounded-md bg-[#141927] border border-[#1a2035] px-3 py-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#5a6480]" />
                  <span className="text-xs text-[#8892a8]">{fileName}</span>
                </div>
              )}
              <CSVUpload compact />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
        <AnimatePresence mode="wait">
          {rawData.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-8"
            >
              <EmptyState />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <FilterBar />

              {filteredData.length < rawData.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-[#5a6480]"
                >
                  Showing {filteredData.length.toLocaleString()} of {rawData.length.toLocaleString()} records
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <RTSPieChart />
                <StackedBarChart />
              </div>

              <Element3 />
              <DetailTable />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-[#1a2035] py-3 bg-[#0c0f18]/50 backdrop-blur-sm">
        <div className="mx-auto max-w-[1600px] px-4 text-center text-xs text-[#3d4560]">
          RTS Management Dashboard &middot; Built with React, ECharts & Tailwind CSS
        </div>
      </footer>
    </div>
  );
}

function App() {
  return <Dashboard />;
}

export default App;
