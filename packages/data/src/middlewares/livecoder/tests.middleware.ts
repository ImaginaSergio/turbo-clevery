import {
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  GET_HttpResponse,
  POST_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { ITestLivecoder } from '../../models';
import { shouldFetch, extractQuery } from '../_utils';
import { get, post, put, remove } from '../../services';

const ENDPOINT_ADMIN = '/godAPI/testlivecoders/';

export const getTestsLivecoder = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  let dataTests: GET_HttpResponse = await get(ENDPOINT_ADMIN + queryTxt);

  if (!dataTests || dataTests instanceof Error) return undefined;
  else return dataTests.data;
};

export const updateTestLivecoder = ({
  id,
  test,
}: PropsByID & { test: any }) => {
  return put(ENDPOINT_ADMIN + id, test)
    .then((response: PUT_HttpResponse) => ({
      message: `Test del Livecoder actualizado correctamente.`,
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

export const addTestLivecoder = ({ test }: { test: ITestLivecoder }) => {
  return post(ENDPOINT_ADMIN, test)
    .then((response: POST_HttpResponse) => ({
      message: `Test del livecoder creado correctamente.`,
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

export const removeTestLivecoder = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Test eliminado correctamente.`,
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
