export type ThemeName = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  warning: string;
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    background: '#F2F4F7',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#DDDDDD',
    primary: '#2563EB',
    success: '#16A34A',
    danger: '#DC2626',
    warning: '#D97706',
  },
  dark: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#F5F5F5',
    textSecondary: '#AAAAAA',
    border: '#333333',
    primary: '#3B82F6',
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
  },
};
