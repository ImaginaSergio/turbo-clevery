import { isPast, addHours } from 'date-fns';
import { EntregableEstadoEnum } from 'data';

export const revisarSiEntregableBloqueado = (
  fechaInicio: string,
  tiempoDisponible: number,
  estado?: EntregableEstadoEnum
): boolean => {
  return estado === EntregableEstadoEnum.PENDIENTE_ENTREGA && isPast(addHours(new Date(fechaInicio), tiempoDisponible));
};
