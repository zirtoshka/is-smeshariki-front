import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Roles} from './smesharik';

const LOGIN_KEY = 'login';
const ROLE_KEY = 'role';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private loginSubject = new BehaviorSubject<string | null>(this.restoreLogin());
  private roleSubject = new BehaviorSubject<Roles | null>(this.restoreRole());

  readonly login$ = this.loginSubject.asObservable();
  readonly role$ = this.roleSubject.asObservable();

  get login(): string | null {
    return this.loginSubject.value;
  }

  get role(): Roles | null {
    return this.roleSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.login != null;
  }

  get isDoctor(): boolean {
    const role = this.roleSubject.value;
    return role === Roles.ADMIN || role === Roles.DOCTOR;
  }

  get isAdmin(): boolean {
    return this.roleSubject.value === Roles.ADMIN;
  }

  setSession(login: string, role: Roles) {
    this.setLogin(login);
    this.setRole(role);
  }

  setLogin(login: string | null | undefined) {
    if (login == null) {
      sessionStorage.removeItem(LOGIN_KEY);
      this.loginSubject.next(null);
      return;
    }
    sessionStorage.setItem(LOGIN_KEY, login);
    this.loginSubject.next(login);
  }

  setRole(role: Roles | null | undefined) {
    if (role == null) {
      sessionStorage.removeItem(ROLE_KEY);
      this.roleSubject.next(null);
      return;
    }
    sessionStorage.setItem(ROLE_KEY, role);
    this.roleSubject.next(role);
  }

  clearSession() {
    sessionStorage.removeItem(LOGIN_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    this.loginSubject.next(null);
    this.roleSubject.next(null);
  }

  private restoreLogin(): string | null {
    return sessionStorage.getItem(LOGIN_KEY);
  }

  private restoreRole(): Roles | null {
    const stored = sessionStorage.getItem(ROLE_KEY);
    return (stored as Roles) ?? null;
  }
}
