import {
  IRuta,
  IPais,
  IEstado,
  IEmpresa,
  IHabilidad,
  ICertificacion,
} from '..';
import { ApiItem } from '../common.model';

export enum BoostRemotoEnum {
  REMOTO = 'remoto',
  PRESENCIAL = 'presencial',
  HIBRIDO = 'hibrido', // Antes mixto
  INDIFERENTE = 'indiferente',
}

export enum BoostJornadaEnum {
  COMPLETA = 'completa',
  PARCIAL = 'parcial',
}

export interface IBoost extends ApiItem {
  users: any;
  titulo: string;
  descripcion: string;

  publicado: boolean;

  icono?: string;

  salarioMax: number;
  salarioMin: number;

  remoto: BoostRemotoEnum;
  jornada: BoostJornadaEnum;

  habilidades?: IHabilidad[];
  certificacionesRequeridas?: ICertificacion[];

  rutaId: number;
  ruta?: IRuta;

  empresaId: number;
  empresa?: IEmpresa;

  estadoId: number;
  paisId: number;

  estado?: IEstado;
  pais: IPais;
}
