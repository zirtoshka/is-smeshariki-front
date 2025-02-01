import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getAuthToken} from '../auth-tools/auth-utils';
import {lastValueFrom} from 'rxjs';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private readonly baseUrl = 'http://localhost:8081/api';
  private notificationService = inject(NzNotificationService);

  constructor(protected httpClient: HttpClient) {}

  protected getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    });
  }

  async createItem<T>(action: string, body: any): Promise<T> {
    try {
      return await lastValueFrom(
        this.httpClient.post<T>(`${this.baseUrl}/${action}`, body, {
          headers: this.getAuthHeaders(),
        })
      );
    } catch (err: any) {
      throw new Error(err.message || 'Ошибка запроса');
    }
  }


}
