import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Smesharik} from '../auth-tools/smesharik';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private readonly baseUrl = `${environment.apiBaseUrl}/smesharik`;

  constructor(private httpClient: HttpClient) {
  }

  editSmesharik(login: string, body: any) {
    return this.httpClient.put<Smesharik>(`${this.baseUrl}/${login}`, body);
  }

  getSmesharikByLogin(login: string): Observable<Smesharik> {
    return this.httpClient.get<Smesharik>(`${this.baseUrl}/${login}`);
  }

  changePassword(login: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${login}/changePassword`, {
      oldPassword,
      newPassword
    });
  }
}
