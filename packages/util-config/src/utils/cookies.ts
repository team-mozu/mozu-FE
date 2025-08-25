import Cookies, { type CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

/**
 * 쿠키를 설정합니다. 단일 또는 여러 개의 키-값 쌍을 동시에 설정할 수 있습니다.
 * @param key 쿠키 키 (string | string[])
 * @param value 쿠키 값 (string | string[])
 * @param options 쿠키 옵션
 */
export const setCookies = (key: string | string[], value: string | string[], options?: CookieSetOptions) => {
  if (Array.isArray(key) && Array.isArray(value)) {
    if (key.length !== value.length) {
      console.error("setCookies Error: Keys and values arrays must have the same length.");
      return;
    }
    key.forEach((k, i) => cookies.set(k, value[i], options));
  } else if (typeof key === "string" && typeof value === "string") {
    cookies.set(key, value, options);
  } else {
    console.error("setCookies Error: Invalid types for key or value.");
  }
};

/**
 * 쿠키 값을 가져옵니다. 단일 키 또는 여러 키 배열을 인자로 받을 수 있습니다.
 * @param key 쿠키 키 (string | string[])
 * @returns 쿠키 값 (T | (T | undefined)[])
 */
export function getCookies<T = string>(key: string): T | undefined;
export function getCookies<T = string>(keys: string[]): (T | undefined)[];
export function getCookies<T = string>(keyOrKeys: string | string[]): T | undefined | (T | undefined)[] {
  if (Array.isArray(keyOrKeys)) {
    return keyOrKeys.map(k => cookies.get<T>(k));
  }
  return cookies.get<T>(keyOrKeys);
}

/**
 * 쿠키를 삭제합니다.
 * @param key 삭제할 쿠키 키 (string | string[])
 * @param options 쿠키 옵션
 */
export const removeCookies = (key: string | string[], options?: CookieSetOptions) => {
  const keys = Array.isArray(key)
    ? key
    : [
        key,
      ];
  keys.forEach(k => cookies.remove(k, options));
};
