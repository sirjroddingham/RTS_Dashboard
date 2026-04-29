import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { Search, ChevronUp, ChevronDown, ChevronsUp } from 'lucide-react';
import type { RTSDataRow } from '../types';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const COLUMNS = [
  { key: 'deliveryAssociate', label: 'Delivery Associate', width: 'w-[180px]' },
  { key: 'trackingId', label: 'Tracking ID', width: 'w-[150px]' },
  { key: 'impactDcr', label: 'Impact DCR', width: 'w-[80px]' },
  { key: 'rtsCode', label: 'RTS Code', width: 'w-[140px]' },
  { key: 'additionalInformation', label: 'Additional Info', width: 'w-[160px]' },
  { key: 'exemptionReason', label: 'Exemption Reason', width: 'w-[140px]' },
  { key: 'plannedDeliveryDate', label: 'Planned Date', width: 'w-[100px]' },
];

const ROWS_PER_PAGE = 50;

export default function DetailTable() {
  const filteredData = useDashboardStore(s => s.filteredData);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'plannedDeliveryDate', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [columnFilter, setColumnFilter] = useState<Record<string, string>>({});
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(0);
  }, []);

  const sortedData = useMemo(() => {
    const searchTerm = columnFilter._global || '';
    let rows = filteredData;
    if (searchTerm) {
      rows = rows.filter(row =>
        COLUMNS.some(col =>
          String(row[col.key as keyof RTSDataRow] || '').toLowerCase().includes(searchTerm)
        )
      );
    }
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof RTSDataRow] || '';
      const bVal = b[sortConfig.key as keyof RTSDataRow] || '';
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredData, sortConfig, columnFilter]);

  const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE);
  const paginatedData = sortedData.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setColumnFilter(prev => ({ ...prev, _global: searchTerm }));
    setPage(0);
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
    if (!showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const hasSearchFilter = Boolean(columnFilter._global);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-lg border border-[#1a2035] bg-[#0f1320]/50 backdrop-blur-sm"
    >
      <div className="border-b border-[#1a2035] px-5 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#8892a8]">Delivery Details</h3>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#141927] border border-[#1a2035] px-2.5 py-0.5 text-xs font-medium text-[#5a6480]">
              {sortedData.length} records
            </span>
            <button
              onClick={toggleSearch}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                showSearch
                  ? 'bg-[#1e3a5f]/40 text-[#7ab3e0]'
                  : 'bg-[#141927] text-[#5a6480] hover:bg-[#1a2035]'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              Search Columns
              {hasSearchFilter && (
                <span className="rounded-full bg-[#1e3a5f] px-1.5 py-0.5 text-[10px] text-[#7ab3e0]">1</span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#3d4560]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={columnFilter._global || ''}
                  onChange={(e) => handleSearch(e)}
                  placeholder="Type to filter across all visible columns..."
                  className="flex-1 rounded-md border border-[#1a2035] bg-[#0c0f18] px-3 py-1.5 text-sm text-[#b0bbd0] placeholder:text-[#3d4560] focus:border-[#2a3555] focus:outline-none"
                />
                {hasSearchFilter && (
                  <button
                    onClick={() => { setColumnFilter({}); setPage(0); }}
                    className="text-xs text-[#5a6480] underline hover:text-[#8892a8]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-[#1a2035] bg-[#0f1320] backdrop-blur-sm">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`cursor-pointer select-none px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-[#4a5578] transition-colors hover:bg-[#141927] ${col.width}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key && (
                      sortConfig.direction === 'asc'
                        ? <ChevronUp className="h-3 w-3" />
                        : <ChevronDown className="h-3 w-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={`${row.trackingId}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15, delay: Math.min(index * 0.005, 0.1) }}
                  className="border-b border-[#141927]/50 transition-colors hover:bg-[#141927]/50"
                >
                  <td className="px-4 py-2 text-[#8892a8]">{row.deliveryAssociate}</td>
                  <td className="px-4 py-2 font-mono text-xs text-[#5a6480]">{row.trackingId}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.impactDcr === 'Y' ? 'bg-amber-900/20 text-amber-400/70' : 'bg-[#141927] text-[#3d4560]'
                    }`}>
                      {row.impactDcr}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.rtsCode === 'OUT OF DRIVING TIME'
                        ? 'bg-red-900/20 text-red-400/80'
                        : row.rtsCode === 'NO RTS CODE SELECTED'
                        ? 'bg-emerald-900/20 text-emerald-400/70'
                        : 'bg-[#141927] text-[#5a6480]'
                    }`}>
                      {row.rtsCode}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-[#5a6480]">{row.additionalInformation || '-'}</td>
                  <td className="px-4 py-2 text-[#5a6480]">{row.exemptionReason || '-'}</td>
                  <td className="px-4 py-2 text-[#5a6480]">{row.plannedDeliveryDate}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-[#3d4560]">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-[#1a2035] px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3d4560]">
              Page {page + 1} of {totalPages} ({sortedData.length} records)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="rounded px-2 py-1 text-xs text-[#5a6480] disabled:opacity-30 hover:bg-[#141927]"
              >
                <ChevronsUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded px-2 py-1 text-xs text-[#5a6480] disabled:opacity-30 hover:bg-[#141927]"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (page < 3) {
                  pageNum = i;
                } else if (page > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      page === pageNum
                        ? 'bg-[#1e3a5f] text-[#7ab3e0]'
                        : 'text-[#5a6480] hover:bg-[#141927]'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded px-2 py-1 text-xs text-[#5a6480] disabled:opacity-30 hover:bg-[#141927]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
