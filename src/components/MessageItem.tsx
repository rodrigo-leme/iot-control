import { StyleSheet, Text, View } from 'react-native';
import { HistoryMessage } from '../types/mqtt';
import { ThemeColors } from '../themes/colors';

interface MessageItemProps {
  message: HistoryMessage;
  colors: ThemeColors;
}

export default function MessageItem({ message, colors }: MessageItemProps) {
  const directionColor = message.direction === 'enviada' ? colors.primary : colors.success;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.direction, { color: directionColor }]}>
          {message.direction === 'enviada' ? 'ENVIADA' : 'RECEBIDA'}
        </Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>{message.time}</Text>
      </View>
      <Text style={[styles.topic, { color: colors.textSecondary }]}>{message.topic}</Text>
      <Text style={[styles.payload, { color: colors.text }]}>{message.payload}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  direction: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
  },
  topic: {
    fontSize: 12,
  },
  payload: {
    fontSize: 15,
  },
});
