import { StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '../themes/colors';

interface SensorCardProps {
  title: string;
  value: string;
  time: string;
  colors: ThemeColors;
}

export default function SensorCard({ title, value, time, colors }: SensorCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.time, { color: colors.textSecondary }]}>
        {time ? `Atualizado às ${time}` : 'Aguardando dados...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  title: {
    fontSize: 14,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
  },
});
