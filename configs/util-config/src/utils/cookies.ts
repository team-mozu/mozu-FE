import Cookies, { CookieSetOptions } from 'universal-cookie';

const cookies = new Cookies();

export const setCookies = (
  key: string | string[],
  value: string | string[],
  options?: CookieSetOptions,
) => {
  if (Array.isArray(key) && Array.isArray(value)) {
    if (key.length !== value.length) {
      console.error('setCookies 오류 key와 value의 길이가 다릅니다');
      return;
    }
    key.forEach((k, i) => cookies.set(k, value[i], options));
  } else if (typeof key === 'string' && typeof value === 'string') {
    cookies.set(key, value, options);
  } else {
    console.error('setCookies 오류 key와 value의 타입이 올바르지 않습니다');
  }
};

export const getCookies = <T>(key: string | string[]) => {
  let item: T | T[];

  if (Array.isArray(key)) item = key.map((k) => cookies.get<T>(k));
  else item = cookies.get<T>(key);

  return item;
};

export const removeCookies = (
  key: string | string[],
  options?: CookieSetOptions,
) => {
  if (Array.isArray(key)) {
    key.forEach((i) => cookies.remove(i, options));
  } else {
    cookies.remove(key, options);
  }
};
