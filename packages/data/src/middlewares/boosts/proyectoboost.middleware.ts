import useSWR from 'swr';

import {
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  POST_HttpResponse,
  REMOVE_HttpResponse,
  GET_HttpResponse,
} from '../_middleware';
import { IProyectoBoost } from '../../models';
import { extractQuery, shouldFetch } from '../_utils';
import { get, post, put, remove } from '../../services';

const ENDPOINT_ADMIN = '/godAPI/proyectosBoosts/';
const ENDPOINT_CAMPUS = '/openAPI/proyectosBoosts/';

export const useProyectoBoost = ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id + queryTxt
      : null,
    (ep) => get(ep).then((data) => data.data)
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error !== undefined,
  };
};

export const getProyectoBoost = async ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);

  if (shouldFetch(strategy, query, true, id))
    return await get(
      (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id + queryTxt
    ).then((data) => data.data);
  else return Promise.reject('Query erronea');
};

export const useProyectosBoosts = ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
      : null,
    (ep) => get(ep).then((data) => data.data.data)
  );

  return {
    proyectos: data,
    isLoading: !error && !data,
    isError: error !== undefined,
  };
};

export const getProyectosBoosts = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const dataProyectos: GET_HttpResponse = await get(
    `${ENDPOINT_ADMIN}${queryTxt}`
  );

  if (!dataProyectos || dataProyectos instanceof Error) return undefined;
  else return dataProyectos.data;
};

export const addProyectoBoost = ({
  proyectoBoost,
}: {
  proyectoBoost: IProyectoBoost;
}) => {
  return post(ENDPOINT_ADMIN, proyectoBoost)
    .then((response: POST_HttpResponse) => ({
      message: `Proyecto Boost creado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message:
          error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateProyectoBoost = ({
  id,
  proyectoBoost,
}: PropsByID & { proyectoBoost: any }) => {
  return put(ENDPOINT_ADMIN + id, proyectoBoost)
    .then((response: PUT_HttpResponse) => ({
      message: `Proyecto Boost actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message:
          error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removeProyectoBoost = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Proyecto Boosts eliminado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message:
          error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};
