import { Pressable, StyleSheet, Text } from 'react-native';

interface AppButtonProps {
  title: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function AppButton({ title, color, onPress, disabled = false }: AppButtonProps) {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: color, opacity: disabled ? 0.5 : 1 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
