import { useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { getUniqueEmployees, getUniqueRTSCodes } from '../lib/utils';

export default function FilterBar() {
  const filters = useDashboardStore(s => s.filters);
  const rawData = useDashboardStore(s => s.rawData);
  const setFilters = useDashboardStore(s => s.setFilters);
  const resetFilters = useDashboardStore(s => s.resetFilters);

  const employees = useMemo(() => getUniqueEmployees(rawData), [rawData]);
  const rtsCodes = useMemo(() => getUniqueRTSCodes(rawData), [rawData]);

  const hasFilters = filters.employee || filters.search || filters.dateRange || filters.rtsCodes.length > 0;

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handleDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value ? new Date(
      +e.target.value.split('-')[0],
      +e.target.value.split('-')[1] - 1,
      +e.target.value.split('-')[2],
    ) : null;
    const endDate = filters.dateRange?.[1] || null;
    setFilters({
      dateRange: startDate && endDate ? [startDate, endDate] : startDate ? [startDate, null] : null,
    });
  };

  const handleDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parts = e.target.value.split('-').map(Number);
    const endDate = e.target.value
      ? new Date(parts[0], parts[1] - 1, parts[2] + 1)
      : null;
    const startDate = filters.dateRange?.[0] || null;
    setFilters({
      dateRange: startDate && endDate ? [startDate, endDate] : endDate ? [null, endDate] : null,
    });
  };

  const toInputDate = (d: Date): string => {
    const y = String(d.getFullYear()).padStart(4, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const displayEndDate = (d: Date): string => {
    return toInputDate(new Date(d.getTime() - 86400000));
  };

  const toggleRTSCode = (code: string) => {
    const current = filters.rtsCodes;
    const updated = current.includes(code)
      ? current.filter(c => c !== code)
      : [...current, code];
    setFilters({ rtsCodes: updated });
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-[#1a2035] bg-[#0f1320]/50 p-4"
    >
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-[#5a6480]" />
        <span className="text-sm font-medium text-[#8892a8]">Filters</span>
        {hasFilters && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="rounded-full bg-[#1e3a5f]/30 px-2 py-0.5 text-xs font-medium text-[#6b9fd4]"
          >
            Active
          </motion.span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3d4560]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search all fields..."
            className="w-full rounded-md border border-[#1a2035] bg-[#0c0f18] py-2 pl-9 pr-4 text-sm text-[#b0bbd0] placeholder:text-[#3d4560] transition-colors focus:border-[#2a3555] focus:outline-none focus:ring-1 focus:ring-[#2a3555]"
          />
        </div>

        <select
          value={filters.employee}
          onChange={(e) => setFilters({ employee: e.target.value })}
          className="rounded-md border border-[#1a2035] bg-[#0c0f18] px-3 py-2 text-sm text-[#b0bbd0] transition-colors focus:border-[#2a3555] focus:outline-none focus:ring-1 focus:ring-[#2a3555]"
        >
          <option value="" className="bg-[#141927]">All Employees</option>
          {employees.map(emp => (
            <option key={emp} value={emp} className="bg-[#141927]">{emp}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateRange?.[0] ? toInputDate(filters.dateRange[0]) : ''}
            onChange={handleDateStartChange}
            className="rounded-md border border-[#1a2035] bg-[#0c0f18] px-3 py-2 text-sm text-[#b0bbd0] transition-colors focus:border-[#2a3555] focus:outline-none focus:ring-1 focus:ring-[#2a3555]"
          />
          <span className="text-[#3d4560]">to</span>
          <input
            type="date"
            value={filters.dateRange?.[1] ? displayEndDate(filters.dateRange[1]) : ''}
            onChange={handleDateEndChange}
            className="rounded-md border border-[#1a2035] bg-[#0c0f18] px-3 py-2 text-sm text-[#b0bbd0] transition-colors focus:border-[#2a3555] focus:outline-none focus:ring-1 focus:ring-[#2a3555]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#5a6480]">RTS:</span>
          <div className="flex flex-wrap gap-1">
            {rtsCodes.map(code => (
              <motion.button
                key={code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleRTSCode(code)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  filters.rtsCodes.includes(code)
                    ? 'bg-[#1e3a5f] text-[#7ab3e0]'
                    : 'bg-[#141927] text-[#5a6480] hover:bg-[#1a2035] hover:text-[#8892a8]'
                }`}
              >
                {code}
              </motion.button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center gap-1 rounded-md bg-red-950/20 px-3 py-2 text-xs font-medium text-red-400/70 transition-colors hover:bg-red-950/30"
          >
            <X className="h-3 w-3" />
            Reset
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
