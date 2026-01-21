import db from './db';

/**
 * 1. CONTAGEM POR MÊS (Para o Carrossel da Home)
 * Retorna Promise. Usa substr para funcionar no iOS.
 */
export const getMonthlyScheduleCounts = year => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Cria a tabela se não existir (segurança)
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Schedules (id INTEGER PRIMARY KEY AUTOINCREMENT, DATE TEXT, status_groups_property TEXT, schedule_status TEXT);',
        [],
      );

      // substr(date, 6, 2) pega o mês (ex: "01")
      // substr(date, 1, 4) pega o ano (ex: "2024")
      const sql = `
        SELECT 
           substr(DATE, 6, 2) as month, 
           COUNT(id) as count
         FROM Schedules
         WHERE substr(DATE, 1, 4) = ?
           AND (status_groups_property IS NULL OR status_groups_property != '3')
           AND (schedule_status IS NULL OR schedule_status == '1')
         GROUP BY month
      `;

      tx.executeSql(
        sql,
        [String(year)],
        (_, results) => {
          const counts = {};
          // Inicializa zerado
          for (let i = 0; i < 12; i++) counts[i] = 0;

          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            // Converte mês "01" para índice 0
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
 * Retorna Promise. Traz TODOS os dados para a tela de detalhes não ficar vazia.
 */
export const loadSchedules = (year, month) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Adicionei os campos extras do Associates e Technicians aqui
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
            AND (Schedules.schedule_status IS NULL OR Schedules.schedule_status == '1')
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
 * Mantém o padrão de callback (setAgendas) que sua tela antiga usa.
 */
export const loadDateSchedules = (setAgendas, date) => {
  db.transaction(tx => {
    // Também adicionei os campos extras aqui para garantir
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
            AND (Schedules.schedule_status IS NULL OR Schedules.schedule_status == '1')
            ORDER BY Schedules.visited ASC, Schedules.DATE ASC
    `;

    // Se date vier como ISO (com T), pegamos só a data
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
 * 4. BUSCAR POR ID (Para garantir detalhes se recarregar a tela)
 * Usa callback setSchedule (padrão antigo).
 */
export const getScheduleId = (setSchedule, id) => {
  setSchedule([]); // Limpa antes de buscar
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

// Mantivemos esta auxiliar caso precise
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
