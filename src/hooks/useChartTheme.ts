import { useMemo } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { getChartTheme, type ChartThemeColors } from '../lib/utils';

export function useChartTheme(): ChartThemeColors {
  const themeVersion = useThemeStore(s => s.themeVersion);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => getChartTheme(), [themeVersion]);
}
