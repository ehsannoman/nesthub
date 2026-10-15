export const colors = {
  // Brand — Midnight Blue
  primary: '#173B67',
  primaryDark: '#0D2340',
  primaryLight: '#EAF1F8',

  // Surfaces
  background: '#F7F9FC',
  card: '#FFFFFF',
  white: '#FFFFFF',
  surfaceMuted: '#F1F5F9',

  // Text
  text: '#102A43',
  textSecondary: '#486581',
  textMuted: '#829AB1',
  textLight: '#BCCCDC',

  // Borders
  border: '#D9E2EC',
  borderLight: '#E8EEF4',

  // Semantic
  success: '#16805B',
  successLight: '#E8F6F0',
  warning: '#B7791F',
  warningLight: '#FFF7E6',
  danger: '#C53030',
  dangerLight: '#FFF0F0',
  info: '#2B6CB0',
  infoLight: '#EBF4FF',

  // Accent
  purple: '#6B5FC7',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  h3: { fontSize: 17, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textSecondary },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, color: colors.text },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
  label: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted, letterSpacing: 0.3 },
};
