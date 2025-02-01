import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Smesharik} from '../auth-tools/smesharik';
import {Observable} from 'rxjs';
import {getCookie} from '../auth-tools/cookie-utils';
import {TOKEN_PATH} from '../auth-tools/auth-utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  editSmesharik(name: string, login: string, email: string) {
    console.log("edit Smesharik", name, login, email);
  }

  getSmesharikByLogin(login: string): Observable<Smesharik> {
    let headers = new HttpHeaders();

    headers = headers.set('Authorization', `Bearer ${getCookie(TOKEN_PATH)}`);
    return this.http.get<Smesharik>(`http://localhost:8081/api/smesharik/${login}`, {headers});
  }

  getNotificationList() {
    console.log("getNotificationList");
  }

  changePassword(login: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`http://localhost:8081/api/smesharik/${login}/change-password`, {
      oldPassword,
      newPassword
    });
  }
}
