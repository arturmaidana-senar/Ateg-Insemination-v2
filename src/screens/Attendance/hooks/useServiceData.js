import { useState, useEffect, useCallback } from 'react';
import { allTechnicianUsers } from '../../../database/modelTechnicianUser';
import { getScheduleId, getRacas } from '../../../database/modelSchedule';
import {
  getInseminacaoScheduleId,
  getInseminacaoScheduleExist,
} from '../../../database/modelInseminacaoVisit';
import { allJustifications } from '../../../database/modelJustificationVisit';

export function useServiceData(scheduleId) {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState({});
  const [racas, setRacas] = useState([]);
  const [technicianUsers, setTechnicianUsers] = useState([]);
  const [justifications, setJustifications] = useState([]);
  const [inseminacaoVisit, setInseminacaoVisit] = useState({});
  const [inseminacaoVisitExist, setInseminacaoVisitExist] = useState(false);
  const [technicianName, setTechnicianName] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const users = await allTechnicianUsers();
      setTechnicianUsers(users);
      if (users.length === 1) {
        setTechnicianName(users[0].name);
      }

      await getScheduleId(setSchedule, scheduleId);
      await getRacas(setRacas, scheduleId);
      await getInseminacaoScheduleId(setInseminacaoVisit, scheduleId);
      await getInseminacaoScheduleExist(setInseminacaoVisitExist);
      await allJustifications(setJustifications);
    } catch (error) {
      console.log('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Função para recarregar dados específicos após uma ação (ex: checkin)
  const refreshVisit = async () => {
    await getInseminacaoScheduleId(setInseminacaoVisit, scheduleId);
    await getInseminacaoScheduleExist(setInseminacaoVisitExist);
  };

  return {
    loading,
    schedule,
    racas,
    technicianUsers,
    justifications,
    inseminacaoVisit,
    inseminacaoVisitExist,
    technicianName,
    setTechnicianName,
    refreshVisit,
    fetchData,
  };
}
