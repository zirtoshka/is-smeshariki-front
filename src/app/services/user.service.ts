import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Smesharik} from '../auth-tools/smesharik';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiBaseUrl}/smesharik`;


  constructor(private httpClient: HttpClient) {
  }

  editSmesharik1(name: string, login: string, email: string) {
    console.log("edit Smesharik", name, login, email);
  }

  editSmesharik(login: string, body: any) {
    return this.httpClient.put<Smesharik>(`${this.baseUrl}/${login}`, body);
  }

  getSmesharikByLogin(login: string): Observable<Smesharik> {
    return this.httpClient.get<Smesharik>(`${this.baseUrl}/${login}`);
  }

  getNotificationList() {
    console.log("getNotificationList");
  }

  changePassword(login: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${login}/changePassword`, {
      oldPassword,
      newPassword
    });
  }
}
