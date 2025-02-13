import {deleteCookie, getCookie, setCookie} from './cookie-utils';
import {Roles} from './smesharik';

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

export function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем payload
    return payload.role || null; // Возвращаем роль, если есть
  } catch (error) {
    console.error("Ошибка при разборе токена:", error);
    return null;
  }
}

