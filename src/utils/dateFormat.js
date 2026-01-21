import { add, format } from 'date-fns';

export function formatDate(date) {
  const [year, month, day] = date.split('-');
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export function formatDateTime(dataHora) {
  const data = new Date(dataHora);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  const segundo = String(data.getSeconds()).padStart(2, '0');

  return `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;
}
