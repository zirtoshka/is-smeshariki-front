import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError, lastValueFrom, throwError} from 'rxjs';
import {Token} from './token';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {Smesharik} from './smesharik';
import {environment} from '../../environments/environment';
import {AuthFacade} from './auth.facade';


const LOGIN_PATH = "login"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.authBaseUrl;
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NzNotificationService);
  private authFacade = inject(AuthFacade);


  logOut() {
    this.httpClient.post<void>(`${this.baseUrl}/logout`, {})
      .subscribe({
        next: () => this.completeLogout(),
        error: () => this.completeLogout()
      });
  }

  get isLoggedIn(): boolean {
    return this.authFacade.isLoggedIn;
  }

  get isDoctor(): boolean {
    return this.authFacade.isDoctor;
  }

  get isAdmin(): boolean {
    return this.authFacade.isAdmin;
  }

  get currentLogin(): string | null {
    return this.authFacade.login;
  }

  private completeLogout() {
    this.authFacade.clearSession();
    this.router.navigate([LOGIN_PATH]);
  }

  private auth(login: string) {
    this.authFacade.setLogin(login);
    lastValueFrom(this.httpClient.get<Smesharik>(`${environment.apiBaseUrl}/smesharik/${login}`))
      .then(data => {
        const smesharik = new Smesharik(data);
        this.authFacade.setRole(smesharik.role);
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
        next: () => this.auth(body.login),
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
