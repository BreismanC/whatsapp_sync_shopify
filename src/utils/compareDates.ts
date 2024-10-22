export function isDifferenceThreeDays(startISO: string, endISO: string) {
  // Convierte las fechas ISO a objetos Date y las convertimos a formato timestamp
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();

  // Calcula la diferencia en milisegundos
  const diffInMs = end - start;

  // Convierte la diferencia a días
  // const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  const diffInDays = diffInMs / (1000 * 60);

  // Retorna true si la diferencia es mayor 3 días
  return diffInDays > 3;
}
