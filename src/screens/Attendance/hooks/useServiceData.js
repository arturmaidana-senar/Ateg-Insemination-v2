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

      // --- DEBUG EXTRA: Verificar o que tem na tabela inteira de Inseminacao_visits ---
      import('../../../database/db').then(({ default: db }) => {
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Inseminacao_visits', [], (tx, results) => {
            let rows = [];
            for (let i = 0; i < results.rows.length; i++) {
              rows.push(results.rows.item(i));
            }
            console.log('\n\n========== 🗄️ DUMP DA TABELA Inseminacao_visits ==========');
            console.log(`Total de registros na tabela: ${rows.length}`);
            console.log(JSON.stringify(rows, null, 2));
            console.log('===========================================================\n\n');
          });
        });
      }).catch(err => console.log('Erro ao carregar db para debug:', err));
      // --------------------------------------------------------------------------------
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
