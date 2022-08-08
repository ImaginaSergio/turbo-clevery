import { ApiItem } from '../common.model';

export type LenguajeMonacoLang =
  | 'python'
  | 'javascript'
  | 'csharp'
  | 'java'
  | 'bat';

export interface ILenguaje extends ApiItem {
  nombre: string;
  judge0Id: number;
  monacoLang: LenguajeMonacoLang;
}
