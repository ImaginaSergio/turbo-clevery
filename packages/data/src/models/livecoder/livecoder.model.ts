import { ILeccion } from '..';
import { ITestLivecoder } from './test.model';
import { ApiItem } from '../common.model';
import { ILenguaje } from './lenguaje.model';

export interface ILivecoder extends ApiItem {
  leccionId: number;
  leccion?: ILeccion;

  lenguajeId: number;
  lenguaje?: ILenguaje;

  codigo: string;
  puntuacionMinima: number;

  tests?: ITestLivecoder[];
}
