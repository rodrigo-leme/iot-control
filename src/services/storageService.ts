import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeName } from '../themes/colors';

const BROKER_URL_KEY = '@iotcontrol:brokerUrl';
const THEME_KEY = '@iotcontrol:theme';

export async function saveBrokerUrl(url: string): Promise<void> {
  await AsyncStorage.setItem(BROKER_URL_KEY, url);
}

export async function loadBrokerUrl(): Promise<string | null> {
  return AsyncStorage.getItem(BROKER_URL_KEY);
}

export async function saveTheme(theme: ThemeName): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, theme);
}

export async function loadTheme(): Promise<ThemeName | null> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  if (value === 'light' || value === 'dark') {
    return value;
  }
  return null;
}
