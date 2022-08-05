import { ICertificacion } from '..';
import { ApiItem } from '../common.model';

export interface IHabilidad extends ApiItem {
  icono?: string;
  nombre: string;
  publicado: boolean;

  superiorId?: number;
  superior?: IHabilidad;

  certificaciones?: ICertificacion[];
}

export enum HabilidadTiemposEnum {
  MENOS_DE_UNO = 'menos_de_uno',
  UNO_A_TRES = 'uno_a_tres',
  CUATRO_A_SIETE = 'cuatro_a_siete',
  OCHO_A_DIEZ = 'ocho_a_diez',
  MAS_DE_DIEZ = 'mas_de_diez',
}

export interface HabilidadExperiencia extends IHabilidad {
  meta: {
    pivot_user_id: number;
    pivot_habilidad_id: number;
    pivot_experiencia: HabilidadTiemposEnum;
  };
}
