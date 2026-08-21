export const colors = {
  primary: '#007C83',
  primaryDark: '#005A60',
  primaryLight: '#E6F4F4',

  background: '#F7F9F9',
  card: '#FFFFFF',
  white: '#FFFFFF',

  text: '#172B2D',
  textMuted: '#667477',

  border: '#E1E7E8',

  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',

  purple: '#7C3AED',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
};