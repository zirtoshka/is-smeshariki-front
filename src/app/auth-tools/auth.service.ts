import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {deleteCookie, getCookie, setCookie} from './cookie-utils';
import {catchError, lastValueFrom, throwError} from 'rxjs';
import {Token} from './token';
import {NzNotificationService} from 'ng-zorro-antd/notification';

const TOKEN_PATH = 'token';
const LOGIN = 'login';
const LOGIN_PATH="login"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8081/auth';
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NzNotificationService);

  get login(): string | null {
    return sessionStorage.getItem(LOGIN);
  }

  set login(value: string | null | undefined) {
    if (value == null) {
      sessionStorage.removeItem(LOGIN);
    } else {
      sessionStorage.setItem(LOGIN, value);
    }
  }

  get authToken(): string | null {
    return getCookie(TOKEN_PATH);
  }

  set authToken(value: string | null | undefined) {
    if (value == null) {
      deleteCookie(TOKEN_PATH);
      //todo add smth
      // sessionStorage.removeItem("shoot");
    }else{
      setCookie(TOKEN_PATH, value);
    }
  }

  logOut() {
    this.authToken = null;
    this.login = undefined;
    this.router.navigate([LOGIN_PATH]);
  }

  get isLoggedIn(): boolean {
    return this.authToken != null;
  }

  private auth(login: string, token: string) {
    this.authToken = token;
    this.login = login; //todo
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    lastValueFrom(this.httpClient.get(`http://localhost:8081/api/smesharik/${this.login}`, {headers}))
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

  register(body:any) {
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
      'Ошибка',
      'Что-то пошло не так, попробуйте позже.',
      {nzDuration: 5000}
    );
  }
}
