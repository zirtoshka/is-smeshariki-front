import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {getAuthToken} from '../auth-tools/auth-utils';
import {lastValueFrom, Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';

@Injectable({
  providedIn: 'root'
})
export class BaseService <T> {

  private readonly baseUrl = 'http://localhost:8081/api';

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
      throw new Error(err.error.message || 'ошибка запроса');
    }
  }

  async updateItem<T>(action: string, body: any, id:any): Promise<T> {
    try {
      return await lastValueFrom(
        this.httpClient.put<T>(`${this.baseUrl}/${action}/${id}`, body, {
          headers: this.getAuthHeaders(),
        })
      );
    } catch (err: any) {
      throw new Error(err.error.message || 'ошибка запроса');
    }
  }



  getItems<T>( endpoint: string,
               params: { [key: string]: any }): Observable<PaginatedResponse<T>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.httpClient.get<PaginatedResponse<T>>(
      `${this.baseUrl}/${endpoint}`,
      {
        headers: this.getAuthHeaders(),
        params: httpParams
      }
    );
  }





}
