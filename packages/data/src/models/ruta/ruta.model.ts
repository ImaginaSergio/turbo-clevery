import { ApiItem } from '../common.model';
import { IProyectoBoost, ICurso } from './../';

export interface IRuta extends ApiItem {
  icono?: string;
  nombre: string;
  itinerario: string;
  descripcion?: string;

  privada?: boolean;

  meta?: {
    itinerario: RutaItinerario[];
    duracionTotal?: number;
  };
}

export type RutaItinerario = {
  id: number;
  tipo: RutaItinerarioTipoEnum;
};

export type RutaItinerarioLoaded = {
  id: number;
  tipo: RutaItinerarioTipoEnum;

  curso?: ICurso;
  proyecto?: IProyectoBoost
};

export enum RutaItinerarioTipoEnum {
  CURSO = 'curso',
  PROYECTO = 'proyecto',
  ENTREVISTA = 'entrevista',
}
