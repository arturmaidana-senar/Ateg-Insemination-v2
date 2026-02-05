import db from './db';

/**
 * 1. CONTAGEM POR MÊS (Para o Carrossel da Home)
 * CORREÇÃO: Removido filtro de schedule_status para contar também os realizados/passados.
 */
export const getMonthlyScheduleCounts = year => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Schedules (id INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT, status_groups_property TEXT, schedule_status TEXT);',
        [],
      );

      const sql = `
        SELECT 
           substr(DATE, 6, 2) as month, 
           COUNT(id) as count
         FROM Schedules
         WHERE substr(DATE, 1, 4) = ?
           AND (status_groups_property IS NULL OR status_groups_property != '3')
           -- REMOVIDO: AND (schedule_status IS NULL OR schedule_status == '1')
         GROUP BY month
      `;

      tx.executeSql(
        sql,
        [String(year)],
        (_, results) => {
          const counts = {};
          for (let i = 0; i < 12; i++) counts[i] = 0;

          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            const monthIndex = parseInt(row.month, 10) - 1;
            if (monthIndex >= 0 && monthIndex <= 11) {
              counts[monthIndex] = row.count;
            }
          }
          resolve(counts);
        },
        (_, error) => {
          console.error('Erro ao contar agendamentos:', error);
          reject(error);
        },
      );
    });
  });
};

/**
 * 2. LISTA MENSAL (Para a Home)
 * CORREÇÃO: Agora busca tudo do mês selecionado, independente se está pendente (1) ou finalizado.
 */
export const loadSchedules = (year, month) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const sql = `
            SELECT Schedules.*,
                   Associates.producer,
                   Associates.property,
                   Associates.telephone,
                   Associates.cellphone,
                   Associates.protocolo,
                   Associates.diagnosis_gestation,
                   Associates.latitude,
                   Associates.longitude,
                   Technicians.name as technician_name,
                   Inseminacao_visits.pending,
                   Inseminacao_visits.sent,
                   Inseminacao_visits.checkin,
                   (SELECT name FROM Racas WHERE Racas.schedule_id = Schedules.id LIMIT 1) as raca_name
            FROM Schedules 
            INNER JOIN Associates ON (Associates.id = Schedules.associate_id)
            LEFT JOIN Technicians ON (Associates.id_technician = Technicians.id)
            LEFT JOIN Inseminacao_visits ON (inseminacao_schedule_id = Schedules.id)
            WHERE substr(Schedules.DATE, 1, 4) = ? 
            AND substr(Schedules.DATE, 6, 2) = ? 
            AND (Schedules.status_groups_property IS NULL OR Schedules.status_groups_property != '3')
            -- REMOVIDO PARA EXIBIR HISTÓRICO:
            -- AND (Schedules.schedule_status IS NULL OR Schedules.schedule_status == '1')
            ORDER BY Schedules.visited ASC, Schedules.DATE ASC
      `;

      tx.executeSql(
        sql,
        [year.toString(), month.toString().padStart(2, '0')],
        (_, results) => {
          const rows = results.rows;
          let loadedSchedules = [];
          for (let i = 0; i < rows.length; i++) {
            loadedSchedules.push(rows.item(i));
          }
          resolve(loadedSchedules);
        },
        (_, error) => {
          console.log('Erro ao carregar agendas (Home): ', error);
          reject(error);
        },
      );
    });
  });
};

/**
 * 3. LISTA DIÁRIA (Para tela "Em Execução")
 * Também ajustado para garantir consistência.
 */
export const loadDateSchedules = (setAgendas, date) => {
  db.transaction(tx => {
    const sql = `
            SELECT Schedules.*,
                   Associates.producer,
                   Associates.property,
                   Associates.telephone,
                   Associates.cellphone,
                   Associates.protocolo,
                   Associates.diagnosis_gestation,
                   Technicians.name as technician_name,
                   Inseminacao_visits.pending,
                   Inseminacao_visits.sent,
                   Inseminacao_visits.checkin,
                   (SELECT name FROM Racas WHERE Racas.schedule_id = Schedules.id LIMIT 1) as raca_name
            FROM Schedules 
            INNER JOIN Associates ON (Associates.id = Schedules.associate_id)
            LEFT JOIN Technicians ON (Associates.id_technician = Technicians.id)
            LEFT JOIN Inseminacao_visits ON (inseminacao_schedule_id = Schedules.id)
            WHERE substr(Schedules.DATE, 1, 10) = ? 
            AND (Schedules.status_groups_property IS NULL OR Schedules.status_groups_property != '3')
            -- REMOVIDO AQUI TAMBÉM
            -- AND (Schedules.schedule_status IS NULL OR Schedules.schedule_status == '1')
            ORDER BY Schedules.visited ASC, Schedules.DATE ASC
    `;

    const dateFilter = date.includes('T') ? date.split('T')[0] : date;

    tx.executeSql(
      sql,
      [dateFilter],
      (_, results) => {
        const rows = results.rows;
        let loadedSchedules = [];
        for (let i = 0; i < rows.length; i++) {
          loadedSchedules.push(rows.item(i));
        }
        setAgendas(loadedSchedules);
      },
      error => console.log('Erro ao carregar agendas (Dia): ', error),
    );
  });
};

/**
 * 4. BUSCAR POR ID
 */
export const getScheduleId = (setSchedule, id) => {
  setSchedule([]);
  db.transaction(tx => {
    const sql = `
            SELECT Schedules.*,
                Associates.producer,
                Associates.property,
                Associates.protocolo,
                Associates.diagnosis_gestation,
                Associates.telephone,
                Associates.cellphone,
                Associates.latitude,
                Associates.longitude,
                Technicians.name as name_tecnico
            FROM Schedules 
            INNER JOIN Associates ON(Associates.id = Schedules.associate_id)
            LEFT JOIN Technicians ON(Technicians.id = Associates.id_technician)
            WHERE Schedules.id = ?
    `;
    tx.executeSql(
      sql,
      [id],
      (_, results) => {
        if (results.rows.length > 0) {
          setSchedule(results.rows.item(0));
        } else {
          console.log('Nenhum agendamento encontrado com ID:', id);
        }
      },
      error => {
        console.log('Erro ao buscar detalhes ID:', error);
      },
    );
  });
};

export const getLastSchedule = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Synchronize ORDER BY id DESC LIMIT 1`,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0).started_at);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.log('Erro getLastSchedule:', error);
          reject(error);
        },
      );
    });
  });
};

export const getRacas = (setRacas, id) => {
  setRacas([]);
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM Racas WHERE schedule_id = ?`,
      [id],
      (tx, results) => {
        if (results.rows.length > 0) {
          setRacas(results.rows.item(0));
        } else {
          console.log('No user found with the given ID');
        }
      },
      error => {
        console.log('Error fetching user:', error);
      },
    );
  });
};
