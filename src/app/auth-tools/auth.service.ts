import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {deleteCookie, getCookie, setCookie} from './cookie-utils';
import {catchError, lastValueFrom, throwError} from 'rxjs';
import {Token} from './token';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {getAuthToken, getLogin, getRoleFromToken, setAuthToken, setLogin} from './auth-utils';
import {Roles} from './smesharik';
import {getEnumKeyByValue} from '../model/enums';


const LOGIN_PATH = "login"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8081/auth';
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NzNotificationService);


  logOut() {
    setAuthToken(null);
    setLogin(undefined);
    this.router.navigate([LOGIN_PATH]);
  }

  get isLoggedIn(): boolean {
    return getAuthToken() != null;
  }

  get isDoctor():boolean{
    const role =getRoleFromToken(getAuthToken()??"");
    return role === getEnumKeyByValue(Roles, Roles.ADMIN) ||
      role === getEnumKeyByValue(Roles, Roles.DOCTOR)  ;
  }

  private auth(login: string, token: string) {
    setAuthToken(token);
    setLogin(login); //todo
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    lastValueFrom(this.httpClient.get(`http://localhost:8081/api/smesharik/${getLogin()}`, {headers}))
      .then(data => {
        this.router.navigate(['diary']).then(() => {
          console.log('Navigation to home successful');
        }).catch(err => {
          // this.messageService.createErrorNotification();
          console.error('Navigation failed', err);
        });
      });
  }

  postData(body: any, action: string) {
    return this.httpClient
      .post<Token>(`${this.baseUrl}/${action}`, body)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe({
        next: (data) => this.auth(body.login, data.token),
        error: () => {
        }
      });
  }


  logIn(login: string, password: string) {
    return this.postData({login, password}, "signin");
  }

  register(body: any) {
    return this.postData(body, "signup");
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400 && error.error) {
      const errors = error.error;
      if (typeof errors === 'object') {
        Object.entries(errors).forEach(([field, message]) => {
          this.notificationService.error(
            `укуси меня пчела`,
            `${message}`,
            {nzDuration: 5000}
          );
        });
      } else {
        this.showGenericError();
      }
    } else {
      this.showGenericError();
    }

    return throwError(() => new Error('Что-то пошло не так, попробуйте позже.'));
  }

  private showGenericError() {
    this.notificationService.error(
      'ошибка',
      'что-то пошло не так, попробуйте позже.',
      {nzDuration: 5000}
    );
  }
}
