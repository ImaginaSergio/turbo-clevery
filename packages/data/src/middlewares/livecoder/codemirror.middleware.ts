import { post } from '../../services';

const ENDPOINT_LIVECODER = '/openAPI/coder';
const ENDPOINT_ENTREGABLES = '/openAPI/entregarLivecoder';
const ENDPOINT_EXAMENES = '/openAPI/TODO';

export const executeCode = async ({
  source_code = '',
  language_id = '0',
}: {
  source_code?: string;
  language_id?: string;
}) => {
  return post(ENDPOINT_LIVECODER, { source_code, language_id })
    .then((response: any) => ({
      message: `¡Ejecutando código!`,
      value: response?.data,
      fullResponse: response,
    }))
    .catch((error: any) => {
      console.log(error);
    });
};

export const entregarLivecoder = async ({
  entregar = false,
  source_code = '',
  entregable_id = 0,
  livecoder_id = 0,
}: {
  entregar?: boolean;
  source_code?: string;
  entregable_id?: number;
  livecoder_id?: number;
}) => {
  return post(ENDPOINT_ENTREGABLES, {
    entregar,
    source_code,
    entregable_id,
    livecoder_id,
  })
    .then((response: any) => ({
      message: `¡Validando código!`,
      value: response?.data,
      fullResponse: response,
    }))
    .catch((error: any) => {
      console.log(error);
    });
};
