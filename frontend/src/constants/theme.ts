export const colors = {
  primary: '#0D4F4E',       // dark teal — header, primary buttons
  primaryLight: '#E6F2F1',  // light teal tint — icon backgrounds
  background: '#F5F6F8',    // screen background (light gray)
  card: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#6B7280',
  border: '#E5E7EB',

  success: '#16A34A',       // active, paid, resolved
  warning: '#F59E0B',       // pending, unpaid, maintenance
  danger: '#DC2626',        // inactive, overdue
  info: '#2563EB',          // bookings, links
  purple: '#7C3AED',        // packages
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