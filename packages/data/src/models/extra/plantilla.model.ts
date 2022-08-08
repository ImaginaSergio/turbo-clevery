import { ApiItem } from '../common.model';

export interface IPlantilla extends ApiItem {
  icono: string;
  titulo: string;

  contenido: string;
  publicado: boolean;
}
