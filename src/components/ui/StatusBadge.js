import { View, Text, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';

export const StatusBadge = ({ visit, scheduleDate, exist }) => {
  const getStatus = () => {
    if (visit.pending == 1)
      return { text: 'Atendimento Realizado', color: '#00A859' };
    if (visit.id && !visit.checkout)
      return { text: 'Em Progresso', color: '#007BFF' };
    if (!visit.id && !exist) return { text: 'Aguardando', color: '#FFA500' };
    if (exist) return { text: 'Atendimento Pendente', color: '#DC3545' };

    return { text: 'Indefinido', color: '#6c757d' };
  };

  const status = getStatus();

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: status.color, borderColor: status.color },
      ]}
    >
      <Text style={styles.statusBadgeText} maxFontSizeMultiplier={1.0}>
        {status.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBadge: {
    borderWidth: 1,
    borderRadius: ms(16),
    paddingVertical: ms(4),
    paddingHorizontal: ms(12),
    alignSelf: 'flex-start',
    marginBottom: ms(16),
    marginTop: 8,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: ms(13),
    fontWeight: '500',
  },
});
