import {deleteCookie, getCookie, setCookie} from './cookie-utils';

export const TOKEN_PATH = 'token';
export const  LOGIN = 'login';

export function getLogin(): string | null {
  return sessionStorage.getItem(LOGIN);
}

export function setLogin(value: string | null | undefined) {
  if (value == null) {
    sessionStorage.removeItem(LOGIN);
  } else {
    sessionStorage.setItem(LOGIN, value);
  }
}

export function getAuthToken(): string | null {
  return getCookie(TOKEN_PATH);
}

export function setAuthToken(value: string | null | undefined) {
  if (value == null) {
    deleteCookie(TOKEN_PATH);
    //todo add smth
    // sessionStorage.removeItem("shoot");
  }else{
    setCookie(TOKEN_PATH, value);
  }
}
