import { get } from '../../services';
import { shouldFetch, extractQuery } from '../_utils';
import { PropsByQuery } from '../_middleware';

const ENDPOINT_ADMIN = '/godAPI/lenguajes/';
const ENDPOINT_CAMPUS = '/openAPI/lenguajes/';

export const getLenguajes = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  let dataLenguajes: any = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataLenguajes || dataLenguajes instanceof Error) return undefined;
  else return dataLenguajes;
};
