import {
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  GET_HttpResponse,
  POST_HttpResponse,
  GETID_HttpResponse,
} from '../_middleware';
import { ILivecoder } from '../../models';
import { get, post, put } from '../../services';
import { extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/livecoders/';
const ENDPOINT_CAMPUS = '/openAPI/livecoders/';

export const getLivecoder = async ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  if (!shouldFetch(strategy, query, true, id)) return undefined;

  let dataLivecoder: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataLivecoder || dataLivecoder instanceof Error) return undefined;

  return dataLivecoder.data;
};

export const getLivecoders = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  let dataLivecoders: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataLivecoders || dataLivecoders instanceof Error) return undefined;
  else return dataLivecoders.data;
};

export const updateLiveCoder = ({
  id,
  livecoder,
}: PropsByID & { livecoder: any }) => {
  return put(ENDPOINT_ADMIN + id, livecoder)
    .then((response: PUT_HttpResponse) => ({
      message: `Live coder actualizado correctamente.`,
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

export const addLivecoder = ({ livecoder }: { livecoder: ILivecoder }) => {
  return post(ENDPOINT_ADMIN, livecoder)
    .then((response: POST_HttpResponse) => ({
      message: `Tema creado correctamente.`,
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
