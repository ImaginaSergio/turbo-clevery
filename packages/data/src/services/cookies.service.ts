export interface ICookie {
  /* Key to store the value of the cookie */
  key: string;

  /* Value of the cookie */
  value: string;

  /* Expiration time in minutes */
  expirationMinutes?: number;
}

export const addCookie = (cookie: ICookie) => {
  let date = new Date(
    new Date().getTime() + (cookie.expirationMinutes || 0) * 60000
  );

  const expires = 'expires=' + date.toUTCString();

  document.cookie =
    cookie.key +
    '=' +
    cookie.value +
    ';' +
    (cookie.expirationMinutes ? expires : '');
};

export const getCookie = (key: string) => {
  let cookies: string[] = (document.cookie || '')
    ?.split(';')
    ?.map((c) => c.trimStart());

  return cookies.find((c: string) => (c || '=')?.split('=')[0] === key);
};
