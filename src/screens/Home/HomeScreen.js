import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  ScrollView,
  PermissionsAndroid,
  Platform,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/auth';
import { ms } from 'react-native-size-matters';

import CardAgenda from '../../components/ui/CardAgenda';
import CardNotAgenda from '../../components/ui/CardNotAgenda';
import SyncComponent from '../../components/ui/SyncCompoent';
import Header from '../../components/ui/Header';
import MonthCarousel from '../../components/ui/MonthCarousel';
import { initializeTables } from '../../database/schemas';
import {
  loadSchedules,
  getMonthlyScheduleCounts,
} from '../../database/modelSchedule';

const ASYNC_STORAGE_KEY = '@syncHistory';

export default function Home() {
  const { logoff } = useContext(AuthContext);
  const [locationPermission, setLocationPermission] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());

  const [agendas, setAgendas] = useState([]);

  // AGORA GUARDA VÁRIOS ANOS: { 2025: {0:1, 1:0...}, 2026: {...} }
  const [monthlyEventCounts, setMonthlyEventCounts] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [hasEverSynced, setHasEverSynced] = useState(false);

  // --- FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO ---
  async function updateData(monthIndex, year) {
    setIsLoading(true);
    setAgendas([]);

    setSelectedMonth(monthIndex);
    setDisplayYear(year);

    try {
      // 1. Carrega os agendamentos (Lista de Cards)
      const schedulesPromise = loadSchedules(
        year,
        String(monthIndex + 1).padStart(2, '0'),
      );

      // 2. Carrega contadores de 3 ANOS (Anterior, Atual, Próximo)
      // Isso garante que o carrossel tenha dados nas bordas (Ex: Jan 2026 mostrando Dez 2025)
      const yearsToFetch = [year - 1, year, year + 1];
      const countsPromises = yearsToFetch.map(y => getMonthlyScheduleCounts(y));

      const [schedules, ...countsResults] = await Promise.all([
        schedulesPromise,
        ...countsPromises,
      ]);

      // Atualiza o estado mesclando os novos anos com o que já existia
      setMonthlyEventCounts(prevState => {
        const newState = { ...prevState };
        yearsToFetch.forEach((y, index) => {
          newState[y] = countsResults[index];
        });
        return newState;
      });

      setAgendas(schedules);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      setAgendas([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleMonthChange = newMonthIndex => {
    let newYear = displayYear;
    const diff = newMonthIndex - selectedMonth;

    if (diff < -6) {
      newYear = displayYear + 1;
    } else if (diff > 6) {
      newYear = displayYear - 1;
    }
    updateData(newMonthIndex, newYear);
  };

  const handleYearChange = newYear => {
    updateData(selectedMonth, newYear);
  };

  useFocusEffect(
    useCallback(() => {
      const loadInitialData = async () => {
        setIsLoading(true);
        try {
          const syncHistory = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
          setHasEverSynced(syncHistory !== null);
          await initializeTables();
          const now = new Date();
          await updateData(now.getMonth(), now.getFullYear());
        } catch (error) {
          console.error('Erro ao carregar dados iniciais:', error);
          setIsLoading(false);
        }
      };

      loadInitialData();
      checkLocationPermission();
    }, []),
  );

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      setLocationPermission(granted);
    } else {
      setLocationPermission(true);
    }
  };

  const handleSyncComplete = async () => {
    setIsLoading(true);
    await updateData(selectedMonth, displayYear);
    setHasEverSynced(true);
  };

  const handleSessionExpired = () => {
    Alert.alert(
      'Sessão Expirada',
      'Sua sessão expirou. Por favor, faça login novamente.',
      [{ text: 'OK', onPress: () => logoff(false) }],
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#008346"
          style={{ marginTop: 50 }}
        />
      );
    }

    if (agendas.length > 0) {
      return agendas.map(schedule => (
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
      ));
    }

    if (hasEverSynced) {
      return <CardNotAgenda />;
    }

    return (
      <SyncComponent
        onSyncComplete={handleSyncComplete}
        onSessionExpired={handleSessionExpired}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2E6B46"
        translucent={false}
      />
      <Header />
      <View style={styles.carouselWrapper}>
        <MonthCarousel
          displayMonthIndex={selectedMonth}
          displayYear={displayYear}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          monthlyEventCounts={monthlyEventCounts}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  carouselWrapper: {
    paddingHorizontal: ms(16),
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(100),
    paddingTop: ms(10),
  },
});
