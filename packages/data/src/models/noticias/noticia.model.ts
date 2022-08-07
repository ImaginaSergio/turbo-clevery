import {
  IRuta,
  IPais,
  IEstado,
  IEmpresa,
  IHabilidad,
  ICertificacion,
  IUser,
} from '..';
import { ApiFile, ApiItem } from '../common.model';
import { ICurso } from '../cursos/curso.model';

export enum NoticiaRemotoEnum {
  REMOTO = 'remoto',
  PRESENCIAL = 'presencial',
  HIBRIDO = 'hibrido', // Antes mixto
  INDIFERENTE = 'indiferente',
}

export enum NoticiaJornadaEnum {
  COMPLETA = 'completa',
  PARCIAL = 'parcial',
}

export interface INoticia extends ApiItem {
  titulo: string;
  contenido: string;
  descripcionCorta: string;

  publicado: boolean;

  autor?: IUser;
  autorId?: number;

  imagen?: ApiFile;

  cursoId?: number;
  curso?: ICurso;
}
