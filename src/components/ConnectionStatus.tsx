import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ConnectionStatus as Status } from '../types/mqtt';
import { ThemeColors } from '../themes/colors';
import AppButton from './AppButton';

interface ConnectionStatusProps {
  status: Status;
  errorMessage: string;
  colors: ThemeColors;
  onReconnect: () => void;
}

const LABELS: Record<Status, string> = {
  conectando: 'Conectando...',
  conectado: 'Conectado',
  desconectado: 'Desconectado',
  erro: 'Erro',
};

export default function ConnectionStatus({ status, errorMessage, colors, onReconnect }: ConnectionStatusProps) {
  const statusColors: Record<Status, string> = {
    conectando: colors.warning,
    conectado: colors.success,
    desconectado: colors.textSecondary,
    erro: colors.danger,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: statusColors[status] }]} />
        <Text style={[styles.label, { color: colors.text }]}>{LABELS[status]}</Text>
        {status === 'conectando' && <ActivityIndicator color={colors.warning} />}
      </View>

      {status === 'erro' && (
        <>
          <Text style={[styles.error, { color: colors.danger }]}>{errorMessage}</Text>
          <View style={styles.row}>
            <AppButton title="Reconectar" color={colors.primary} onPress={onReconnect} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 14,
  },
});
