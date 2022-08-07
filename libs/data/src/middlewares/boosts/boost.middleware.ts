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
import { IBoost } from '../../models';
import { get, post, put, remove } from '../../services';
import { convertMetaItinerario, extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/boosts/';
const ENDPOINT_CAMPUS = '/openAPI/boosts/';

export const getBoosts = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByQuery & { certificacionesCompletadas?: number[] }) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  let dataBoosts: GET_HttpResponse = await get((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt);

  for (const boost of dataBoosts?.data?.data || []) {
    boost.meta = {
      ...boost.meta,
      compatible: calcCompatible(
        boost?.certificacionesRequeridas?.map((c: any) => c.id),
        certificacionesCompletadas
      ),
    };

    boost.ruta.meta = {
      itinerario: convertMetaItinerario(boost.ruta?.itinerario || ''),
    };
  }

  if (!dataBoosts || dataBoosts instanceof Error) return undefined;
  else return dataBoosts.data;
};

export const getBoost = async ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByID & { certificacionesCompletadas?: number[] }) => {
  if (!shouldFetch(strategy, query, true, id)) return undefined;

  let dataBoost: GETID_HttpResponse = await get((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id);

  if (!dataBoost || dataBoost instanceof Error) return undefined;

  if (dataBoost && dataBoost.data) {
    dataBoost.data.meta = {
      ...dataBoost.data.meta,
      compatible: calcCompatible(
        dataBoost.data?.certificacionesRequeridas?.map((c: any) => c.id),
        certificacionesCompletadas
      ),
    };

    dataBoost.data.ruta.meta = {
      itinerario: convertMetaItinerario(dataBoost.data.ruta?.itinerario || ''),
    };
  }

  return dataBoost.data;
};

export const useBoosts = ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByQuery & { certificacionesCompletadas?: number[] }) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt : null,
    get
  );

  for (const boost of data?.data?.data || []) {
    boost.meta = {
      ...boost?.meta,
      compatible: calcCompatible(
        boost?.certificacionesRequeridas?.map((c: any) => c.id),
        certificacionesCompletadas
      ),
    };

    boost.ruta.meta = {
      itinerario: convertMetaItinerario(boost?.ruta?.itinerario || ''),
    };
  }

  return {
    boosts: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined,
  };
};

export const useBoost = ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesCompletadas = [],
}: PropsByID & { certificacionesCompletadas?: number[] }) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id + queryTxt : null,
    get
  );

  if (data) {
    data.data.meta = {
      ...data.data.meta,
      compatible: calcCompatible(
        data.data?.certificacionesRequeridas?.map((c: any) => c.id),
        certificacionesCompletadas
      ),
    };

    data.data.ruta.meta = {
      itinerario: convertMetaItinerario(data.data.ruta?.itinerario || ''),
    };
  }

  return {
    boost: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined,
  };
};

export const addBoost = ({ boost }: { boost: IBoost }) => {
  return post(ENDPOINT_ADMIN, boost)
    .then((response: POST_HttpResponse) => ({
      message: `Boost ${boost.titulo} creado correctamente.`,
      value: response.data.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateBoost = ({ id, client = 'campus', boost }: PropsByID & { boost: any }) => {
  return put(ENDPOINT_ADMIN + id, boost)
    .then((response: PUT_HttpResponse) => ({
      message: `Boost actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removeBoost = ({ id, client }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Boost eliminado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const applyToBoost = async ({ id }: PropsByID) => {
  return put(`/openAPI/especial/inscribirseABoost/${id}`, {})
    .then((response: POST_HttpResponse) => ({
      message: `Suscripción al boost procesada correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removeFromBoost = async ({ id }: PropsByID) => {
  return remove(`/openAPI/especial/desinscribirseDeBoost/${id}`)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Se ha eliminado la suscripción al boost.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

const calcCompatible = (certificacionesRequeridas: number[] = [], certificacionesCompletadas: number[] = []) => {
  let total = certificacionesRequeridas.length;

  // Si no hay requisitos, devolvemos un 100 de compatibilidad
  if (total === 0) return 100;

  let aprobadasEnLista = certificacionesRequeridas.reduce((acc, id) => {
    if (certificacionesCompletadas.includes(id)) return acc + 1;
    else return acc;
  }, 0);

  return Math.floor((aprobadasEnLista * 100) / total);
};
