import { getItem, LOGIN_TOKEN } from 'data';

const pdfshift = require('pdfshift')(process.env.REACT_APP_PDFSHIFT_APIKEY);

export const descargarTemarioCurso = async (id?: number, nombre: string = 'temario', sandbox: boolean = false) => {
  const userToken = getItem(LOGIN_TOKEN);

  if (!id || !userToken) return;

  return await pdfshift
    .convert(`https://ob-plantillas.vercel.app/contenido-cursos?cursoId=${id}&userToken=${userToken}`, {
      format: '1920x1080',
      filename: (normaliceNombre(nombre) + '.pdf')?.trim(),
      sandbox,
    })
    .then((response: any) => response?.url)
    .catch((error: any) => {
      throw {
        error,
        title: 'Error al descargar el temario',
        message: error?.response?.data || 'Por favor, contacte con soporte.',
      };
    });
};

function normaliceNombre(nombre: string = '') {
  nombre = nombre.replaceAll(/[!¡@#$%^&*(),.¿?"`´:+{}|\[\]'ºª/\\<>]/gm, '');
  nombre = nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '');

  return nombre;
}
