import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from './src/screens/DashboardScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {
  DEFAULT_BROKER_URL,
  TOPICS,
  connect,
  disconnect,
  parseLampState,
  parseSensorValue,
  publish,
} from './src/services/mqttService';
import { loadBrokerUrl, loadTheme, saveBrokerUrl, saveTheme } from './src/services/storageService';
import {
  ConnectionStatus,
  HistoryMessage,
  LampReading,
  LampState,
  MessageDirection,
  SensorReading,
} from './src/types/mqtt';
import { ThemeName, themes } from './src/themes/colors';

const Tab = createBottomTabNavigator();

function getTime(): string {
  return new Date().toLocaleTimeString('pt-BR');
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<ThemeName>('light');
  const [brokerUrl, setBrokerUrl] = useState<string>(DEFAULT_BROKER_URL);
  const [status, setStatus] = useState<ConnectionStatus>('desconectado');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [temperatura, setTemperatura] = useState<SensorReading | null>(null);
  const [umidade, setUmidade] = useState<SensorReading | null>(null);
  const [lampada, setLampada] = useState<LampReading | null>(null);
  const [historico, setHistorico] = useState<HistoryMessage[]>([]);
  const [aviso, setAviso] = useState<string>('');

  const colors = themes[theme];

  // Carrega as preferências salvas ao abrir o app
  useEffect(() => {
    async function loadPreferences() {
      const savedUrl = await loadBrokerUrl();
      const savedTheme = await loadTheme();
      if (savedUrl) {
        setBrokerUrl(savedUrl);
      }
      if (savedTheme) {
        setTheme(savedTheme);
      }
      setLoading(false);
    }
    loadPreferences();

    // Ao fechar o app, desconecta e remove os listeners do MQTT
    return () => disconnect();
  }, []);

  function addHistory(topic: string, payload: string, direction: MessageDirection) {
    const item: HistoryMessage = {
      id: `${Date.now()}-${Math.random()}`,
      topic,
      payload,
      direction,
      time: getTime(),
    };
    setHistorico((prev) => [item, ...prev].slice(0, 10));
  }

  function handleMessage(topic: string, payload: string) {
    addHistory(topic, payload, 'recebida');

    if (topic === TOPICS.temperatura) {
      const value = parseSensorValue(payload);
      if (value !== null) {
        setTemperatura({ value, time: getTime() });
      }
    } else if (topic === TOPICS.umidade) {
      const value = parseSensorValue(payload);
      if (value !== null) {
        setUmidade({ value, time: getTime() });
      }
    } else if (topic === TOPICS.lampadaEstado) {
      const state = parseLampState(payload);
      if (state !== null) {
        setLampada({ state, time: getTime() });
      }
    }
  }

  function handleConnect() {
    const url = brokerUrl.trim();
    saveBrokerUrl(url);
    setStatus('conectando');
    setErrorMessage('');
    setAviso('');

    connect(url, {
      onConnected: () => setStatus('conectado'),
      onError: (message) => {
        setStatus('erro');
        setErrorMessage(message);
      },
      onMessage: handleMessage,
    });
  }

  function handleDisconnect() {
    disconnect();
    setStatus('desconectado');
  }

  function handleSendCommand(action: LampState) {
    const payload = JSON.stringify({ action });
    const sent = publish(TOPICS.lampadaComando, payload);

    if (!sent) {
      setAviso('Não conectado ao broker. Conecte-se para enviar comandos.');
      return;
    }

    setAviso('');
    addHistory(TOPICS.lampadaComando, payload, 'enviada');
  }

  function handleToggleTheme() {
    const newTheme: ThemeName = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  }

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarIconStyle: { display: 'none' },
          tabBarLabelStyle: { fontSize: 14 },
        }}
      >
        <Tab.Screen name="Dashboard">
          {() => (
            <DashboardScreen
              status={status}
              errorMessage={errorMessage}
              temperatura={temperatura}
              umidade={umidade}
              lampada={lampada}
              aviso={aviso}
              colors={colors}
              onSendCommand={handleSendCommand}
              onReconnect={handleConnect}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Histórico">
          {() => <HistoryScreen historico={historico} colors={colors} />}
        </Tab.Screen>

        <Tab.Screen name="Configurações">
          {() => (
            <SettingsScreen
              brokerUrl={brokerUrl}
              status={status}
              errorMessage={errorMessage}
              theme={theme}
              colors={colors}
              onChangeBrokerUrl={setBrokerUrl}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onToggleTheme={handleToggleTheme}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
