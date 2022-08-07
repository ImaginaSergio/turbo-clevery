import {
  ICurso,
  IGrupo,
  IBoost,
  IExamen,
  IEmpresa,
  IProceso,
  IProgreso,
  IProgresoGlobal,
} from '..';
import { IPais } from '../extra/pais.model';
import { IEstado } from '../extra/estado.model';
import { ApiItem, ApiFile } from '../common.model';
import { HabilidadExperiencia } from '../extra/habilidad.model';

export enum UserRolEnum {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  PROFESOR = 'profesor',
  EDITOR = 'editor',
  ESTUDIANTE = 'estudiante',
}

export enum UserOrigenEnum {
  GOOGLE = 'google',
  // RECOMENDADO = 'recomendado', Ocultado por #DEV-1052
  FACEBOOK = 'facebook',
  PINTEREST = 'pinterest',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TWITTER = 'twitter',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  TWITCH = 'twitch',
  FOROS = 'foros',
  PODCAST = 'podcast',
}

export enum UserRemotoEnum {
  REMOTO = 'remoto',
  PRESENCIAL = 'presencial',
  HIBRIDO = 'hibrido', // Antes mixto
  INDIFERENTE = 'indiferente',
}

export interface IUser extends ApiItem {
  email: string;
  telefono?: string;
  username: string;
  fullName: string;
  nombre?: string;
  apellidos?: string;
  dni?: string;
  linkedin?: string;

  pais: IPais;
  estado: IEstado;

  trabajoRemoto: UserRemotoEnum;
  tieneExperiencia?: boolean;
  posibilidadTraslado?: boolean;
  onboardingCompletado: boolean;
  actualmenteTrabajando?: boolean;

  expectativasSalarialesMin?: number;
  expectativasSalarialesMax?: number;

  rol?: UserRolEnum;

  habilidades?: HabilidadExperiencia[];

  avatar?: ApiFile;
  remember_me_token?: string;
  progresoGlobal: IProgresoGlobal;

  preferencias?: any;

  origen?: UserOrigenEnum;

  empresa?: IEmpresa;
  grupos?: IGrupo[];
  cursos?: ICurso[];
  examenes?: IExamen[];
  procesos?: IProceso[];
  progresos?: IProgreso[];
  certificaciones?: any[];

  config2fa?: { secret: string; qr: string; uri: string };

  activo: boolean;
  intentosFallidos?: number;

  boosts?: IBoost[];

  isSubscribedTo?: (lista: string) => boolean;

  meta?: {
    rol?: UserRolEnum;
    subscriptions?: string[];
    rutasCompletadas_list: number[];
  };
}
