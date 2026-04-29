import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { getEmployeeSummary } from '../lib/utils';

export default function Element3() {
  const filteredData = useDashboardStore(s => s.filteredData);
  const filters = useDashboardStore(s => s.filters);
  const setFilters = useDashboardStore(s => s.setFilters);

  const employeeData = useMemo(() => getEmployeeSummary(filteredData), [filteredData]);

  const handleEmployeeClick = (name: string) => {
    if (filters.employee === name) {
      setFilters({ employee: '' });
    } else {
      setFilters({ employee: name });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-lg border border-[#1a2035] bg-[#0f1320]/50 p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#8892a8]">Employee Performance Summary</h3>
        <span className="rounded-full bg-[#141927] border border-[#1a2035] px-2.5 py-0.5 text-xs font-medium text-[#5a6480]">
          {employeeData.length} employees
        </span>
      </div>
      {employeeData.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {employeeData.map((emp) => {
            const isActive = filters.employee === emp.name;
            return (
              <motion.div
                key={emp.name}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleEmployeeClick(emp.name)}
                className={`cursor-pointer flex items-center justify-between rounded-md border p-3 transition-colors ${
                  isActive
                    ? 'border-[#2a3555] bg-[#141927]'
                    : 'border-[#1a2035] bg-[#0c0f18] hover:bg-[#0f1320]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${
                    isActive ? 'text-[#b0bbd0]' : 'text-[#8892a8]'
                  }`}>{emp.name}</p>
                  <p className="text-xs text-[#3d4560]">{emp.count} rows</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 overflow-hidden rounded-full bg-[#141927] h-1.5">
                    <div
                      className="h-full rounded-full bg-[#3a5a85] transition-all duration-500"
                      style={{ width: `${Math.min(emp.percentage, 100)}%` }}
                    />
                  </div>
                  <span className={`w-10 text-right text-xs font-semibold ${
                    isActive ? 'text-[#b0bbd0]' : 'text-[#5a6480]'
                  }`}>{emp.percentage}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-[#3d4560]">No employee data available for the current filters.</div>
      )}
    </motion.div>
  );
}
