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
  const [agendas, setAgendas] = useState([]);
  const [monthlyEventCounts, setMonthlyEventCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasEverSynced, setHasEverSynced] = useState(false);

  async function updatedMonth(index) {
    setIsLoading(true);
    setAgendas([]);
    setSelectedMonth(index);
    const year = new Date().getFullYear();

    try {
      const countsPromise = getMonthlyScheduleCounts(year);
      const schedulesPromise = loadSchedules(
        year,
        String(index + 1).padStart(2, '0'),
      );

      const [counts, schedules] = await Promise.all([
        countsPromise,
        schedulesPromise,
      ]);

      setMonthlyEventCounts(counts);
      setAgendas(schedules);
    } catch (error) {
      console.error('Erro ao atualizar mês:', error);
      setAgendas([]);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      const loadInitialData = async () => {
        setIsLoading(true);
        try {
          const syncHistory = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
          setHasEverSynced(syncHistory !== null);

          await initializeTables();

          const currentMonthIndex = new Date().getMonth();
          await updatedMonth(currentMonthIndex);
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
    await updatedMonth(selectedMonth);
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
          onMonthChange={updatedMonth}
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
