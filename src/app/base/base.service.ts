import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {getAuthToken} from '../auth-tools/auth-utils';
import {lastValueFrom, Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T> {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor(protected httpClient: HttpClient) {
  }

  getAuthHeaders(setContentType: boolean = true): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${getAuthToken()}`);
    if (setContentType) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }


  async createItem<T>(action: string, body: any): Promise<T> {
    try {
      let headers = this.getAuthHeaders(!(body instanceof FormData));
      return await lastValueFrom(
        this.httpClient.post<T>(`${this.baseUrl}/${action}`, body, {
          headers: headers
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

  getHeadersFromParams( params: { [key: string]: any }){
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return httpParams;
  }

  getItems<T>(endpoint: string,
              params: { [key: string]: any }): Observable<PaginatedResponse<T>> {
    return this.httpClient.get<PaginatedResponse<T>>(
      `${this.baseUrl}/${endpoint}`,
      {
        headers: this.getAuthHeaders(),
        params: this.getHeadersFromParams(params)
      }
    );
  }

  getMessageByParams(endpoint: string, params: { [key: string]: any }) {
    return this.httpClient.get<{ message: string }>(
      `${this.baseUrl}/${endpoint}`,
      {
        headers: this.getAuthHeaders(),
        params: this.getHeadersFromParams(params)
      }
    );
  }

  getByParams(endpoint: string, params: { [key: string]: any }) {
    return this.httpClient.get(
      `${this.baseUrl}/${endpoint}`,
      {
        headers: this.getAuthHeaders(),
        params: this.getHeadersFromParams(params),
        responseType: 'blob' as 'json'
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
      return this.httpClient.post(
        `${this.baseUrl}/${endpoint}`,
        null,
        {
          headers: this.getAuthHeaders(),
          params: this.getHeadersFromParams(params)
        }
      );
    }

  deleteWithParams(endpoint: string, params: { [key: string]: any }) {
    return this.httpClient.delete<{ message: string }>(
      `${this.baseUrl}/${endpoint}`,
      {
        headers: this.getAuthHeaders(),
        params: this.getHeadersFromParams(params)
      }
    );
  }

}
