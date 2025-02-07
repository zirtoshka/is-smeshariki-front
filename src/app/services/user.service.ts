import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Smesharik} from '../auth-tools/smesharik';
import {lastValueFrom, Observable} from 'rxjs';
import {getCookie} from '../auth-tools/cookie-utils';
import {getAuthToken, TOKEN_PATH} from '../auth-tools/auth-utils';
import {BaseService} from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8081/api/smesharik';


  constructor(private httpClient: HttpClient) {
  }

  editSmesharik1(name: string, login: string, email: string) {
    console.log("edit Smesharik", name, login, email);
  }

  editSmesharik(login: string, body: any) {
    return this.httpClient.put<Smesharik>(`${this.baseUrl}/${login}`, body, {
      headers: this.getAuthHeaders(),
    })
  }

  getSmesharikByLogin(login: string): Observable<Smesharik> {
    let headers = new HttpHeaders();

    headers = headers.set('Authorization', `Bearer ${getCookie(TOKEN_PATH)}`);
    return this.httpClient.get<Smesharik>(`http://localhost:8081/api/smesharik/${login}`,
      {headers})
      ;
  }

  getNotificationList() {
    console.log("getNotificationList");
  }

  changePassword(login: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${login}/changePassword`, {
        oldPassword,
        newPassword
      },
      {headers: this.getAuthHeaders()}
    );
  }

  protected getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    });
  }
}
