import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {getAuthToken} from '../auth-tools/auth-utils';
import {lastValueFrom, Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {

  private readonly baseUrl = 'http://localhost:8081/api';

  constructor(protected httpClient: HttpClient) {
  }

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
      throw err;
    }
  }

  async updateItem<T>(action: string, body: any, id: any): Promise<T> {
    try {
      return await lastValueFrom(
        this.httpClient.put<T>(`${this.baseUrl}/${action}/${id}`, body, {
          headers: this.getAuthHeaders(),
        })
      );
    } catch (err: any) {
      throw err;
    }
  }

  async deleteItem<T>(action: string, id: any): Promise<T> {
    try {
      return await lastValueFrom(
        this.httpClient.delete<T>(`${this.baseUrl}/${action}/${id}`, {
          headers: this.getAuthHeaders(),
        })
      );
    } catch (err: any) {
      throw err;
    }
  }


  getItems<T>(endpoint: string,
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

  getMessageByParams(endpoint: string, params: { [key: string]: any }) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.httpClient.get<{ message: string }>(
      `${this.baseUrl}/${endpoint}`,
      {
        headers: this.getAuthHeaders(),
        params: httpParams
      }
    );
  }


  getItemById<T>(endpoint: string, id: number): Observable<T> {
    return this.httpClient.get<T>(
      `${this.baseUrl}/${endpoint}/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }


  postWithParams(endpoint: string, params: { [key: string]: any }) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.httpClient.post(
      `${this.baseUrl}/${endpoint}`,
      null,
      {
        headers: this.getAuthHeaders(),
        params: httpParams
      }
    );
  }

  deleteWithParams(endpoint: string, params: { [key: string]: any }) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.httpClient.delete<{ message: string }>(
      `${this.baseUrl}/${endpoint}`,
      {
        headers: this.getAuthHeaders(),
        params: httpParams
      }
    );
  }

}
