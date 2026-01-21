// components/StatCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  DocumentMedicineBroken,
  Vaccine,
  CowFace,
} from '../Icons/Icons.js';

const StatItem = ({ icon, label, value }) => (
  <View style={styles.statItem}>
    {icon}
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export const StatCard = ({ schedule, racas }) => {
  return (
    <View style={styles.statCard}>
      <StatItem
        icon={<DocumentMedicineBroken />}
        label="Protocolo"
        value={schedule.protocolo || '-'}
      />
      <StatItem
        icon={<Vaccine />}
        label="Diagnóstico"
        value={schedule.diagnosis_gestation || '-'}
      />
      <StatItem 
        icon={<CowFace />} 
        label="Raças" 
        value={racas.name || '-'} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statLabel: {
    fontWeight: '500',
    fontSize: 14,
    color: '#8C8C8C',
    marginBottom: 8,
    marginTop: 8,
  },
  statValue: {
    fontSize: 12.5,
    color: '#333333',
    fontWeight: '600',
  },
});