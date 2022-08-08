import { ILivecoder } from '..';
import { ApiItem } from '../common.model';

export interface ITestLivecoder extends ApiItem {
  nombre: string;

  orden: number;
  codigo: string;
  puntuacion: number;

  livecoder?: ILivecoder;
  livecoderId: number;
}
