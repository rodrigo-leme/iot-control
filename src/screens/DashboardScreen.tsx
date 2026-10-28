import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ConnectionStatus from '../components/ConnectionStatus';
import SensorCard from '../components/SensorCard';
import AppButton from '../components/AppButton';
import { ConnectionStatus as Status, LampReading, LampState, SensorReading } from '../types/mqtt';
import { ThemeColors } from '../themes/colors';

interface DashboardScreenProps {
  status: Status;
  errorMessage: string;
  temperatura: SensorReading | null;
  umidade: SensorReading | null;
  lampada: LampReading | null;
  aviso: string;
  colors: ThemeColors;
  onSendCommand: (action: LampState) => void;
  onReconnect: () => void;
}

export default function DashboardScreen({
  status,
  errorMessage,
  temperatura,
  umidade,
  lampada,
  aviso,
  colors,
  onSendCommand,
  onReconnect,
}: DashboardScreenProps) {
  let lampText = 'Desconhecido';
  if (lampada) {
    lampText = lampada.state === 'ON' ? 'Ligada' : 'Desligada';
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <ConnectionStatus
        status={status}
        errorMessage={errorMessage}
        colors={colors}
        onReconnect={onReconnect}
      />

      <View style={styles.row}>
        <SensorCard
          title="Temperatura"
          value={temperatura ? `${temperatura.value} °C` : '--'}
          time={temperatura ? temperatura.time : ''}
          colors={colors}
        />
        <SensorCard
          title="Umidade"
          value={umidade ? `${umidade.value} %` : '--'}
          time={umidade ? umidade.time : ''}
          colors={colors}
        />
      </View>

      <View style={[styles.lampCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.lampTitle, { color: colors.textSecondary }]}>Lâmpada</Text>
        <Text
          style={[
            styles.lampState,
            { color: lampada?.state === 'ON' ? colors.warning : colors.text },
          ]}
        >
          {lampText}
        </Text>
        <Text style={[styles.lampTime, { color: colors.textSecondary }]}>
          {lampada ? `Atualizado às ${lampada.time}` : 'Aguardando estado...'}
        </Text>

        <View style={styles.row}>
          <AppButton title="Ligar" color={colors.success} onPress={() => onSendCommand('ON')} />
          <AppButton title="Desligar" color={colors.danger} onPress={() => onSendCommand('OFF')} />
        </View>

        {aviso !== '' && <Text style={[styles.aviso, { color: colors.danger }]}>{aviso}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  lampCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  lampTitle: {
    fontSize: 14,
  },
  lampState: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  lampTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  aviso: {
    fontSize: 14,
    marginTop: 4,
  },
});
