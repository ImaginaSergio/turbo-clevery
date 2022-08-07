import useSWR from 'swr';

import {
  POST_HttpResponse,
  GET_HttpResponse,
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
  GETID_HttpResponse,
} from '../_middleware';
import { INoticia } from '../../models';
import { get, post, put, remove } from '../../services';
import { convertMetaItinerario, extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/noticias/';
const ENDPOINT_CAMPUS = '/openAPI/noticias/';

export const getNoticias = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByQuery & { certificacionesCompletadas?: number[] }) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  let dataNoticias: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataNoticias || dataNoticias instanceof Error) return undefined;
  else return dataNoticias.data;
};

export const getNoticia = async ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByID & { certificacionesCompletadas?: number[] }) => {
  if (!shouldFetch(strategy, query, true, id)) return undefined;

  let dataNoticia: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataNoticia || dataNoticia instanceof Error) return undefined;
  else return dataNoticia.data;
};

export const useNoticias = ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByQuery & { certificacionesCompletadas?: number[] }) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
      : null,
    get
  );

  return {
    noticias: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined,
  };
};

export const useNoticia = ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByID & { certificacionesCompletadas?: number[] }) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id + queryTxt
      : null,
    get
  );

  return {
    noticia: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined,
  };
};

export const addNoticia = ({ noticia }: { noticia: INoticia }) => {
  return post(ENDPOINT_ADMIN, noticia)
    .then((response: POST_HttpResponse) => ({
      message: `Noticia ${noticia.titulo} creada correctamente.`,
      value: response.data.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateNoticia = ({
  id,
  client = 'campus',
  noticia,
}: PropsByID & { noticia: any }) => {
  return put(ENDPOINT_ADMIN + id, noticia)
    .then((response: PUT_HttpResponse) => ({
      message: `Noticia actualizada correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removeNoticia = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Noticia eliminada correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};
