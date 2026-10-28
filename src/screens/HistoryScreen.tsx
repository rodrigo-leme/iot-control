import { FlatList, StyleSheet, Text, View } from 'react-native';
import MessageItem from '../components/MessageItem';
import { HistoryMessage } from '../types/mqtt';
import { ThemeColors } from '../themes/colors';

interface HistoryScreenProps {
  historico: HistoryMessage[];
  colors: ThemeColors;
}

export default function HistoryScreen({ historico, colors }: HistoryScreenProps) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem message={item} colors={colors} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            Nenhuma mensagem ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 15,
  },
});
