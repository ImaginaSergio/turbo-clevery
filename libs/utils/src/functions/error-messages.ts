const DEFAULT_ERROR =
  'Actualice la página y contacte con soporte si el error persiste.';

const LOGIN_PASSWORD_ERROR = 'Contraseña incorrecta.';
const LOGIN_EMAIL_ERROR_V1 = 'Usuario no encontrado';
const LOGIN_EMAIL_ERROR_V2 = 'E_ROW_NOT_FOUND: Row not found';

const LOGIN_INTENTOS_ERROR_V1 =
  '¡Has fallado 3 veces seguidas en inicio de sesión! Si fallas una cuarta tu cuenta será bloqueada por motivos de seguridad.';
const LOGIN_INTENTOS_ERROR_V2 =
  '¡Lo sentimos hemos detectado múltiples intentos de inicio a tu cuenta! Contacta con hola@open-bootcamp.com o vuelve a iniciar sesión más tarde.';

export const errorHandler = (error: any) => {
  let msg = '';

  if (error?.message && typeof error.message === 'string') msg = error.message;
  else if (
    error?.error?.response?.data &&
    typeof error?.error?.response?.data === 'string'
  )
    msg = error?.error?.response?.data;
  else if (
    error?.error?.response?.data?.data &&
    typeof error?.error?.response?.data?.data === 'string'
  )
    msg = error?.error?.response?.data?.data;

  switch (msg) {
    case LOGIN_PASSWORD_ERROR:
      return LOGIN_PASSWORD_ERROR;
    case LOGIN_EMAIL_ERROR_V1:
    case LOGIN_EMAIL_ERROR_V2:
      return 'No existe una cuenta con esta dirección de correo.';
    case LOGIN_INTENTOS_ERROR_V1:
      return LOGIN_INTENTOS_ERROR_V1;
    case LOGIN_INTENTOS_ERROR_V2:
      return LOGIN_INTENTOS_ERROR_V2;
    default:
      return DEFAULT_ERROR;
  }
};
