import { useCallback, useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../store/useDashboardStore';
import { mapCsvHeaders, parseDate, normalizeRTSCode } from '../lib/headerMap';
import type { RTSDataRow } from '../types';

interface CSVUploadProps {
  compact?: boolean;
}

export default function CSVUpload({ compact = false }: CSVUploadProps) {
  const setRawData = useDashboardStore(s => s.setRawData);
  const setFileName = useDashboardStore(s => s.setFileName);
  const [error, setErrorState] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCsv = useCallback((csvText: string) => {
    const result = Papa.parse<Record<string, string>>(csvText, { header: true, skipEmptyLines: true, worker: false, download: false });

    if (result.errors.length > 0) {
      setErrorState(`Parse errors: ${result.errors.length} issues found. Check CSV format.`);
      return;
    }

    const headers = result.meta?.fields || [];
    const mapping = mapCsvHeaders(headers);

    if (Object.keys(mapping).length === 0) {
      setErrorState('Could not map any CSV headers. Ensure headers match expected column names.');
      return;
    }

    const data: RTSDataRow[] = result.data.map(row => {
      const getValue = (key: string) => (mapping[key] !== undefined && row[headers[mapping[key]]] !== undefined) ? row[headers[mapping[key]]] : '';
      return {
        deliveryAssociate: getValue('deliveryAssociate'),
        trackingId: getValue('trackingId'),
        transporterId: getValue('transporterId'),
        impactDcr: getValue('impactDcr'),
        rtsCode: normalizeRTSCode(getValue('rtsCode')),
        additionalInformation: getValue('additionalInformation'),
        exemptionReason: getValue('exemptionReason'),
        plannedDeliveryDate: getValue('plannedDeliveryDate'),
        serviceArea: getValue('serviceArea'),
        normalizedDate: parseDate(getValue('plannedDeliveryDate')),
      };
    });

    if (data.length === 0) {
      setErrorState('No data rows found in CSV file.');
      return;
    }

    setRawData(data);
  }, [setRawData]);

  const handleFile = useCallback((file: File) => {
    setErrorState(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setErrorState('Failed to read file content.');
        return;
      }
      processCsv(text);
    };
    reader.onerror = () => {
      setErrorState('Failed to read the file. Please try again.');
    };
    reader.readAsText(file);
  }, [setFileName, processCsv]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFile(file);
    } else {
      setErrorState('Please drop a valid CSV file.');
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center"
      >
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded p-1.5 text-[#5a6480] transition-colors hover:bg-[#141927] hover:text-[#8892a8]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <Upload className="h-4 w-4" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 flex items-center gap-2 rounded-md border border-red-900/30 bg-red-950/20 px-4 py-2 text-sm text-red-400/80"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.div>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="relative cursor-pointer rounded-lg border-2 border-dashed border-[#1a2035] bg-[#0f1320]/50 p-8 text-center transition-colors hover:border-[#2a3555] hover:bg-[#141927]"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Upload className="mx-auto mb-3 h-10 w-10 text-[#3d4560]" />
        <p className="mb-1 text-lg font-medium text-[#8892a8]">Drop CSV file here or click to browse</p>
        <p className="text-sm text-[#5a6480]">Supports any CSV with delivery tracking data</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#3d4560]">
          <FileSpreadsheet className="h-3 w-3" />
          <span>Header mapping handles column name variations automatically</span>
        </div>
      </div>
    </motion.div>
  );
}
