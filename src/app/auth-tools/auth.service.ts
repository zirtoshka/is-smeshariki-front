import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {deleteCookie, getCookie} from './cookie-utils';
import {catchError, lastValueFrom, throwError} from 'rxjs';
import {Token} from './token';
import {NzNotificationService} from 'ng-zorro-antd/notification';

const TOKEN_PATH = 'token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8000/dragon/auth';
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NzNotificationService); // Use NzNotificationService directly


  // constructor(private messageService: NotificationComponent) {}

  // makeToast(message: string) {
  //   this.messageService.createErrorNotification();
  // }

  get login(): string | null {
    return sessionStorage.getItem("login");
  }

  set login(value: string | null | undefined) {
    if (value == null) {
      sessionStorage.removeItem("login");
    } else {
      sessionStorage.setItem("login", value);
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
    }
  }

  get isLoggedIn(): boolean {
    return this.authToken != null;
  }

  private auth(login: string, token: string) {
    this.authToken = token;
    this.login = login;
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    lastValueFrom(this.httpClient.get(`${this.baseUrl}/users/${name}`, {headers}))
      .then(data => {
        this.router.navigate(['home']).then(() => {
          console.log('Navigation to home successful');
        }).catch(err => {
          // this.messageService.createErrorNotification();
          console.error('Navigation failed', err);
        });
      });
  }

  postData(login: string, password: string, action: string) {
    return this.httpClient
      .post<Token>(`${this.baseUrl}/${action}`, {"login": login, password})
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe((data) => {
        this.auth(login, data.token)
      });
  }

  logIn(login: string, password: string) {
    return this.postData(login, password, "authenticate");
  }

  register(login: string, password: string) {
    return this.postData(login, password, "register");
  }

  private handleError(error: HttpErrorResponse) {
    console.log("555");
    this.notificationService.error(
      'error Notification',
      'This is the description of the error notification'
    );
    // this.messageService.createErrorNotification();
    console.log("ssld;dalsd;lasd;l");
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }
}
