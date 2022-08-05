import { ApiFile, IEstado, IPais } from 'data';
import { ApiItem } from '../common.model';

import { AdminConfig } from '../config/admin';
import { CampusConfig } from '../config/campus';

export interface IEmpresa extends ApiItem {
  nombre: string;
  cif: string;

  icono?: string;
  email: string;
  sector: string;
  telefono: string;
  personaContacto: string;

  descripcion?: string;
  imagen?: ApiFile;
  estado?: IEstado;
  estadoId?: number;
  pais?: IPais;
  paisId?: number;
  web?: string;

  configAdmin?: typeof AdminConfig;
  configCampus?: typeof CampusConfig;
}
