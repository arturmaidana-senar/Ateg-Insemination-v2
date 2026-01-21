export function dataAtual() {
  let hoje = new Date();
  let ano = hoje.getFullYear();
  let mes = hoje.getMonth() + 1;
  let dia = hoje.getDate();
  let mesFormatado = mes.toString().padStart(2, '0');
  let diaFormatado = dia.toString().padStart(2, '0');
  let dataFormatada = `${ano}-${mesFormatado}-${diaFormatado}`;
  return dataFormatada;
}

export function dateInteger() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth() + 1;
  const dia = agora.getDate();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const segundo = agora.getSeconds();
  return `${ano}${mes.toString().padStart(2, '0')}${dia
    .toString()
    .padStart(2, '0')}${hora.toString().padStart(2, '0')}${minuto
    .toString()
    .padStart(2, '0')}${segundo.toString().padStart(2, '0')}`;
}
