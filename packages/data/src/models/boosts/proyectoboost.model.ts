import { ILivecoder } from '..';
import { ApiItem } from '../common.model';

export interface IProyectoBoost extends ApiItem {
  titulo: string;
  icono: string;
  publicado: boolean;
  descripcionCorta: string;
  descripcionLarga: string;

  tiempoLimite: number;
  duracionLectura: number;

  livecoderId?: number;
  livecoder?: ILivecoder;

  meta?: {
    isBlocked?: boolean;
    isCompleted?: boolean;
  };
}
