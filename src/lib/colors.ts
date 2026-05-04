const COLORS = [
  '#facc15', '#14b8a6', '#fb923c', '#a855f7', '#3b82f6',
  '#f43f5e', '#22c55e', '#6366f1', '#ec4899', '#f97316',
  '#06b6d4', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b',
  '#6ee7b7', '#c084fc',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getRTSColor(code: string): string {
  return COLORS[hashString(code) % COLORS.length];
}
