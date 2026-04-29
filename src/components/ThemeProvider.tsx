import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dark = useThemeStore((s: { dark: boolean }) => s.dark);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return <>{children}</>;
}
