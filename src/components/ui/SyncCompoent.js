import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ms } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';

// --- IMPORTS DA LÓGICA (DO CÓDIGO ANTIGO) ---
import api from '../../services/endpont'; // Verifique se o caminho está certo
import db from '../../database/db'; // Importe o DB para registrar o log de sync
import {
  saveSchedules,
  saveJustification,
} from '../../database/synchronizeSchedules';
import { createUsuario } from '../../database/synchronizeUsuario';
import {
  getLastSynchronization,
  listPending,
  listImagePending,
  updateInseminacaoPending,
} from '../../database/modelSynchronize';
import { AuthContext } from '../../contexts/auth';

// --- IMPORTS VISUAIS ---
import { Refresh, CheckIcon } from '../Icons/Icons';

const SyncDisabledIcon = ({ size = 24, color = '#008346' }) => (
  <Refresh name="sync-disabled" size={size} color={color} />
);

const CheckIcon2 = ({ size = 32, color = '#008346' }) => (
  <CheckIcon name="check-circle" size={size} color={color} />
);
const ErrorIcon = ({ size = 32, color = '#D32F2F' }) => (
  <Icon name="error" size={size} color={color} />
);

const ASYNC_STORAGE_KEY = '@syncHistory';

export default function SyncComponent({ onSyncComplete, onSessionExpired }) {
  const [syncState, setSyncState] = useState('idle');
  const [syncMessage, setSyncMessage] = useState(
    'Para visualizar seus atendimentos agendados, é necessário sincronizar os dados com o servidor.',
  );
  const progress = useRef(new Animated.Value(0)).current;
  const { logoff } = useContext(AuthContext);

  // --- FUNÇÕES AUXILIARES DO CÓDIGO ANTIGO ---

  const getCurrentDateTime = () => {
    const now = new Date();
    // Formato SQL: YYYY-MM-DD HH:MM:SS
    return now.toISOString().slice(0, 19).replace('T', ' ');
  };

  const startSynchronization = async () => {
    const startedAt = getCurrentDateTime();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO Synchronize (started_at) VALUES (?)`,
          [startedAt],
          (_, result) => {
            console.log('🔄 Sincronização iniciada em: ', startedAt);
            resolve(result.insertId);
          },
          (_, error) => {
            console.log('❌ Erro ao iniciar tabela Synchronize: ', error);
            reject(error);
          },
        );
      });
    });
  };

  const endSynchronization = async id => {
    const endedAt = getCurrentDateTime();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE Synchronize SET ended_at = ? WHERE id = ?`,
          [endedAt, id],
          () => {
            console.log('✅ Sincronização finalizada em: ', endedAt);
            resolve();
          },
          (_, error) => {
            console.log('❌ Erro ao finalizar tabela Synchronize: ', error);
            reject(error); // Não rejeita para não travar o fluxo, mas loga
          },
        );
      });
    });
  };

  const sendInseminacaoVisits = async () => {
    console.log('📤 Enviando visitas pendentes...');
    try {
      const visitPendingSents = await listPending();
      if (visitPendingSents.length > 0) {
        setSyncMessage(
          `Enviando ${visitPendingSents.length} visitas pendentes...`,
        );
      }

      for (const visit of visitPendingSents) {
        const imageSent = await listImagePending(visit);
        // Aqui usamos a API importada. Verifique se o método postVisita existe nela.
        await api.postVisita(imageSent);
        await updateInseminacaoPending(visit.id);
      }
      console.log('✅ Envios concluídos.');
    } catch (error) {
      console.log(
        '⚠️ Erro ao enviar visitas (pode seguir com o download): ',
        error,
      );
      // Não lançamos erro aqui para não impedir o usuário de baixar a agenda nova
    }
  };

  // -------------------------------------------

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setSyncState('error');
        setSyncMessage(
          'Não há conexão com a internet. Verifique sua rede e tente novamente.',
        );
      }
    });
  }, []);

  useEffect(() => {
    if (syncState === 'complete') {
      const timer = setTimeout(() => {
        if (onSyncComplete) onSyncComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [syncState, onSyncComplete]);

  const handleSync = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      setSyncState('error');
      setSyncMessage('Não há conexão com a internet. Verifique sua internet.');
      return;
    }

    // Validação de Sessão
    try {
      await api.getUsuario();
    } catch (error) {
      if (onSessionExpired) {
        onSessionExpired();
      } else if (logoff) {
        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.', [
          { text: 'OK', onPress: () => logoff() },
        ]);
      } else {
        Alert.alert('Erro', 'Sessão expirada.');
      }
      return;
    }

    // Início visual da sync
    setSyncState('syncing');
    setSyncMessage('Preparando sincronização...');
    progress.setValue(0);

    // Animação de progresso visual (3.5s estimado)
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // Aumentei um pouco pois agora faz mais coisas
      useNativeDriver: false,
    }).start();

    let syncId = null;

    try {
      // 1. Inicia Registro no Banco (Lógica Antiga)
      syncId = await startSynchronization();

      // 2. Busca Data da Última Sync (Lógica Antiga)
      let dateLast = await getLastSynchronization();
      if (!dateLast) dateLast = '2024-01-01'; // Default seguro

      // Sanitização básica pra iOS caso o getLast retorne formato estranho
      if (dateLast.includes('T')) dateLast = dateLast.split('T')[0];

      console.log('📅 Data usada para busca:', dateLast);

      // 3. Envia Pendências (Upload) - Importante vir antes do download ou logo no início
      await sendInseminacaoVisits();

      // 4. Baixa e Salva Usuários
      setSyncMessage('Atualizando dados do usuário...');
      const usuario = await api.getUsuario();
      if (
        usuario.data &&
        usuario.data.company &&
        usuario.data.company.all_users
      ) {
        await createUsuario(usuario.data.company.all_users);
      }

      // 5. Baixa e Salva Justificativas
      setSyncMessage('Baixando justificativas...');
      const justifications = await api.getJustificationVisits();
      await saveJustification(justifications.data);

      // 6. Baixa e Salva Agendas
      setSyncMessage('Atualizando sua agenda...');
      const insemincao = await api.getInsemincaoVisita(dateLast);
      // Aqui chama a função saveSchedules que corrigimos anteriormente (com a sanitização de data)
      await saveSchedules(insemincao.data);

      // 7. Finaliza Registro no Banco (Lógica Antiga)
      if (syncId) {
        await endSynchronization(syncId);
      }

      // 8. Atualiza AsyncStorage p/ Histórico Visual
      const newSyncDate = new Date();
      const savedHistoryString =
        (await AsyncStorage.getItem(ASYNC_STORAGE_KEY)) || '[]';
      const oldHistory = JSON.parse(savedHistoryString);
      const newHistory = [newSyncDate.toISOString(), ...oldHistory];
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newHistory));

      // Sucesso Total
      progress.setValue(1);
      setSyncState('complete');
      setSyncMessage('Sincronização realizada com sucesso!');
    } catch (error) {
      console.log('❌ ERRO CRÍTICO NA SYNC: ', error);
      setSyncState('error');
      setSyncMessage('Falha ao sincronizar dados. Tente novamente.');
    }
  };

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderCardContent = () => {
    switch (syncState) {
      case 'syncing':
        return (
          <>
            <View style={styles.iconContainer}>
              <ActivityIndicator size="large" color="#008346" />
            </View>
            <Text style={styles.title} maxFontSizeMultiplier={1.0}>
              Sincronizando...
            </Text>
            <Text style={styles.bodyText} maxFontSizeMultiplier={1.0}>
              {syncMessage}
            </Text>
            <View style={styles.progressContainer}>
              <Animated.View
                style={[styles.progressBar, { width: animatedWidth }]}
              />
            </View>
            <Text style={styles.footerText} maxFontSizeMultiplier={1.0}>
              Isso pode levar alguns instantes...
            </Text>
          </>
        );

      case 'complete':
        return (
          <>
            <View style={styles.iconContainer}>
              <CheckIcon2 />
            </View>
            <Text style={styles.title} maxFontSizeMultiplier={1.0}>
              Sincronização Concluída!
            </Text>
            <Text style={styles.bodyText} maxFontSizeMultiplier={1.0}>
              {syncMessage}
            </Text>
            <ActivityIndicator
              size="small"
              color="#8C8C8C"
              style={{ marginTop: 24 }}
            />
          </>
        );

      case 'error':
        return (
          <>
            <View
              style={[styles.iconContainer, { backgroundColor: '#FBE9E7' }]}
            >
              <ErrorIcon />
            </View>
            <Text style={styles.title} maxFontSizeMultiplier={1.0}>
              Erro na Sincronização
            </Text>
            <Text style={styles.bodyText} maxFontSizeMultiplier={1.0}>
              {syncMessage}
            </Text>
            <TouchableOpacity
              style={styles.syncButton}
              onPress={handleSync}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText} maxFontSizeMultiplier={1.0}>
                Tentar Novamente
              </Text>
            </TouchableOpacity>
          </>
        );

      case 'idle':
      default:
        return (
          <>
            <View style={styles.iconContainer}>
              <SyncDisabledIcon />
            </View>
            <Text style={styles.title} maxFontSizeMultiplier={1.0}>
              Dados não sincronizados
            </Text>
            <Text style={styles.bodyText} maxFontSizeMultiplier={1.0}>
              {syncMessage}
            </Text>
            <TouchableOpacity
              style={styles.syncButton}
              onPress={handleSync}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText} maxFontSizeMultiplier={1.0}>
                Sincronizar Dados
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerText} maxFontSizeMultiplier={1.0}>
              Certifique-se de estar conectado à internet
            </Text>
          </>
        );
    }
  };

  return <View style={styles.card}>{renderCardContent()}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(10),
    padding: ms(24),
    paddingVertical: ms(24),
    alignItems: 'center',
    width: '95%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: ms(20),
    marginHorizontal: ms(10),
    justifyContent: 'center',
  },
  iconContainer: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(10),
    backgroundColor: '#E6F4EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(10),
  },
  title: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#333333',
    marginBottom: ms(6),
    textAlign: 'center',
  },
  bodyText: {
    fontSize: ms(13),
    color: '#555555',
    textAlign: 'center',
    lineHeight: ms(20),
    marginBottom: ms(12),
    paddingHorizontal: ms(5),
  },
  syncButton: {
    flexDirection: 'row',
    backgroundColor: '#008346',
    paddingVertical: ms(10),
    paddingHorizontal: ms(32),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: ms(15),
    fontWeight: '600',
    marginLeft: ms(10),
  },
  footerText: {
    fontSize: ms(12),
    color: '#8C8C8C',
    marginTop: ms(10),
  },
  progressContainer: {
    height: ms(12),
    width: '90%',
    backgroundColor: '#E0E0E0',
    borderRadius: ms(6),
    overflow: 'hidden',
    marginBottom: ms(32),
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00A859',
    borderRadius: ms(6),
  },
});
