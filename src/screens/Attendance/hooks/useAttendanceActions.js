import { useState } from 'react';
import Toast from 'react-native-toast-message';
import GetLocation from 'react-native-get-location';
import {
  insertInseminacaoVisit,
  getUpdatedInseminacaoScheduleId,
} from '../../../database/modelInseminacaoVisit';
import { dateInteger } from '../../../utils/date';
import api from '../../../services/endpont';
import db from '../../../database/db';

export function useAttendanceActions(
  scheduleId,
  technicianName,
  refreshVisit,
  inseminacaoVisit,
) {
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // --- FUNÇÃO AUXILIAR PARA CORRIGIR A DATA ANTES DE ENVIAR ---
  const fixDateFormat = dateStr => {
    if (!dateStr) return new Date().toISOString().slice(0, 19); // Já retorna com T

    if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) return dateStr.replace(' ', 'T');

    try {
      const cleanStr = dateStr.replace(',', '');
      const parts = cleanStr.split(' ');

      if (parts.length >= 2) {
        const [day, month, year] = parts[0].split('/');
        const time = parts[1];
        // MUDANÇA AQUI: Trocamos o espaço ' ' pelo 'T'
        return `${year}-${month}-${day}T${time}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };
  // -----------------------------------------------------------

  const getCurrentLocation = () => {
    return GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    });
  };

  const startService = async () => {
    if (!technicianName)
      return Toast.show({ type: 'info', text1: 'Informe o técnico!' });

    setActionLoading(true);
    setLoadingMessage('Iniciando atendimento...');

    try {
      const location = await getCurrentLocation();
      const dateNow = dateInteger();

      await insertInseminacaoVisit(
        scheduleId,
        technicianName,
        location.latitude,
        location.longitude,
        dateNow,
      );
      await refreshVisit();

      Toast.show({
        type: 'success',
        text1: 'Atendimento inicializado.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao iniciar',
        text2: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const endService = async (
    isHaveAttendence,
    motivoId,
    motivo,
    messageText,
    imagesCount,
  ) => {
    if (isHaveAttendence) {
      if (!motivo)
        return Toast.show({ type: 'info', text1: 'Selecione o motivo!' });
      if (motivoId === 4 && !messageText)
        return Toast.show({ type: 'info', text1: 'Informe a observação!' });
      if (imagesCount !== 1)
        return Toast.show({
          type: 'info',
          text1:
            'Caso o atendimento não foi realizado conforme previsto, informe apenas 1 foto.',
        });
    } else if (imagesCount < 3) {
      return Toast.show({ type: 'info', text1: 'Mínimo de 3 fotos!' });
    }

    setActionLoading(true);
    setLoadingMessage('Finalizando...');

    try {
      const location = await getCurrentLocation();
      await getUpdatedInseminacaoScheduleId(
        scheduleId,
        !isHaveAttendence,
        messageText,
        location.latitude,
        location.longitude,
        motivoId,
        motivo,
      );
      await refreshVisit();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao finalizar',
        text2: error.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const sendServiceToApi = async (images, isConnected) => {
    if (!isConnected)
      return Toast.show({ type: 'error', text1: 'Sem conexão' });

    setActionLoading(true);
    setLoadingMessage('Enviando dados...');

    try {
      // 1. Enviar Visita
      const responseVisita = await api.postSendVisita(inseminacaoVisit);
      if (responseVisita.error) throw new Error('Falha envio visita');

      // 2. Enviar Imagens
      for (let img of images) {
        const formData = new FormData();

        formData.append('image', {
          uri: img.uri,
          type: 'image/jpeg',
          name: img.name,
        });

        formData.append('inseminacao_schedule_id', scheduleId);
        formData.append('name', img.name);

        // --- 3. Metadados ---
        formData.append('latitude', String(img.latitude || 0));
        formData.append('longitude', String(img.longitude || 0));

        formData.append('date_time', img.date_time);

        console.log(
          `Enviando: ID=${scheduleId} | Foto=${img.name} | Data=${img.date_time}`,
        );

        await api.postSendVisitaImage(
          inseminacaoVisit.inseminacao_visit_id,
          formData,
        );
      }

      // 3. Confirmar Envio
      await api.postSendVisitaVisited(inseminacaoVisit);

      // 4. Update Local DB
      db.transaction(tx => {
        tx.executeSql('UPDATE Inseminacao_visits SET sent = ? WHERE id = ?', [
          1,
          inseminacaoVisit.id,
        ]);
      });

      Toast.show({ type: 'success', text1: 'Atendimento enviado!' });
      await refreshVisit();
    } catch (error) {
      console.log('Erro envio:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro no envio',
        text2: error.message || 'Verifique os dados',
      });
    } finally {
      setActionLoading(false);
    }
  };

  return {
    startService,
    endService,
    sendServiceToApi,
    actionLoading,
    loadingMessage,
  };
}
