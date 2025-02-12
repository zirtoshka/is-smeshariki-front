import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base/base.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Friend} from '../model/friend';
import {getLogin} from '../auth-tools/auth-utils';

@Injectable({
  providedIn: 'root'
})
export class SmesharikService {

  private baseService = inject(BaseService);


  getFriends(options: Partial<{
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    nameOrLogin: string;
  }> = {}): Observable<PaginatedResponse<Friend>> {
    const defaultOptions = {
      page: 0,
      size: 2,
      nameOrLogin: getLogin()
    };

    const params = { ...defaultOptions, ...options };

    return this.baseService.getItems("friend", params);
  }

  getFollowers(options: Partial<{
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    nameOrLogin: string;
  }> = {}): Observable<PaginatedResponse<Friend>> {
    const defaultOptions = {
      page: 0,
      size: 2,
      nameOrLogin: getLogin()
    };

    const params = { ...defaultOptions, ...options };

    return this.baseService.getItems("friend/followers", params);
  }

}
