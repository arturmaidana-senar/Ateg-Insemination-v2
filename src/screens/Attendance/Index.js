import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScaledSheet, ms } from 'react-native-size-matters';

import CardAgenda from '../../components/ui/CardAgenda';
import CardNotAgenda from '../../components/ui/CardNotAgenda';
import { loadDateSchedules } from '../../database/modelSchedule';
import { dataAtual } from '../../utils/date';

export default function Schedule() {
  const [agendas, setAgendas] = useState([]);

  async function updatedSchedules() {
    try {
      loadDateSchedules(setAgendas, dataAtual());
    } catch (error) {
      console.log('Erro ao carregar agendas:', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      updatedSchedules();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* StatusBar configurada com a MESMA cor do Header (#2E6B46) */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2E6B46"
        translucent={false}
      />

      {/* Header replicado da Home */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} maxFontSizeMultiplier={1.0}>
            Atendimentos
          </Text>
          <Text style={styles.headerSubtitle} maxFontSizeMultiplier={1.0}>
            Em execução no momento
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {agendas.length > 0 ? (
          agendas.map(schedule => (
            <CardAgenda
              key={schedule.id}
              scheduleId={schedule.id}
              title={schedule.property}
              produtor={schedule.producer}
              dateEvent={schedule.dateEvent}
              date={schedule.date}
              datatime={schedule.time}
              status={schedule.visited}
              grupo={schedule.group_name}
              protocolStep={schedule.protocol_step}
              pending={schedule.pending}
              sent={schedule.sent}
              checkin={schedule.checkin}
            />
          ))
        ) : (
          <CardNotAgenda />
        )}
      </ScrollView>
    </View>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // --- Estilos copiados e adaptados do Header da Home ---
  headerContainer: {
    backgroundColor: '#2E6B46', // Mesmo verde da Home
    width: '100%',
    // Mesmos espaçamentos para garantir alinhamento visual
    paddingTop: '50@ms',
    paddingBottom: '30@ms',
    paddingHorizontal: '20@ms',
    borderBottomLeftRadius: '30@ms',
    borderBottomRightRadius: '30@ms',

    // Mesma sombra
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: '10@ms',
  },
  headerContent: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Ubuntu-Bold',
    fontWeight: 'bold',
    fontSize: '22@ms', // Tamanho adequado para título de página
    color: '#FFFFFF',
    marginBottom: '4@ms',
  },
  headerSubtitle: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: '14@ms',
    fontWeight: '400',
    color: '#E0E0E0', // Mesma cor do subtítulo da Home
    opacity: 0.9,
  },

  // Área de Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: '16@ms',
    paddingTop: '10@ms',
    paddingBottom: '80@ms',
  },
});
