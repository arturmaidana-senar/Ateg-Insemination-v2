import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ClockAlert } from '../Icons/Icons';
import { ms } from 'react-native-size-matters';

export default function CardAlert() {
  return (
    <View style={styles.body}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <ClockAlert />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardDescription} maxFontSizeMultiplier={1.0}>
              Nenhuma agenda para esse período...
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 0,
  },
  card: {
    backgroundColor: 'white',
    padding: ms(16),
    borderRadius: ms(8),
    marginBottom: ms(16),
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(100),
    backgroundColor: '#F5F5F5',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: ms(6),
  },
  cardTitle: {
    fontSize: ms(16),
    fontWeight: 'bold',
    color: '#2B9348',
  },
  cardDescription: {
    fontSize: ms(16),
    color: '#666',
    marginTop: ms(4),
  },
});
