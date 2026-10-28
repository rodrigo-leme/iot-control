import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import AppButton from '../components/AppButton';
import ConnectionStatus from '../components/ConnectionStatus';
import { ConnectionStatus as Status } from '../types/mqtt';
import { ThemeColors, ThemeName } from '../themes/colors';

interface SettingsScreenProps {
  brokerUrl: string;
  status: Status;
  errorMessage: string;
  theme: ThemeName;
  colors: ThemeColors;
  onChangeBrokerUrl: (url: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleTheme: () => void;
}

export default function SettingsScreen({
  brokerUrl,
  status,
  errorMessage,
  theme,
  colors,
  onChangeBrokerUrl,
  onConnect,
  onDisconnect,
  onToggleTheme,
}: SettingsScreenProps) {
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>URL WebSocket do broker</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={brokerUrl}
          onChangeText={onChangeBrokerUrl}
          placeholder="wss://broker.hivemq.com:8884/mqtt"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          editable={status !== 'conectado' && status !== 'conectando'}
        />

        <View style={styles.row}>
          {status === 'conectado' ? (
            <AppButton title="Desconectar" color={colors.danger} onPress={onDisconnect} />
          ) : (
            <AppButton
              title={status === 'conectando' ? 'Conectando...' : 'Conectar'}
              color={colors.primary}
              onPress={onConnect}
              disabled={status === 'conectando' || brokerUrl.trim() === ''}
            />
          )}
        </View>
      </View>

      <ConnectionStatus
        status={status}
        errorMessage={errorMessage}
        colors={colors}
        onReconnect={onConnect}
      />

      <View style={[styles.card, styles.themeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Tema escuro</Text>
        <Switch value={theme === 'dark'} onValueChange={onToggleTheme} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
