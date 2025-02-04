import {inject, Injectable} from '@angular/core';
import {BaseService} from './base/base.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from './paginated-response';
import {Complaint} from './model/complaint';

@Injectable({
  providedIn: 'root'
})
export class BanService {

  private baseService = inject(BaseService);

  getBans(options: Partial<{
    filter: string;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }> = {}): Observable<PaginatedResponse<Complaint>> {
    const defaultOptions = {
      filter: null,
      sortField: "creationDate",
      ascending: false,
      page: 0,
      size: 2,
    };

    const params = { ...defaultOptions, ...options };

    return this.baseService.getItems("ban", params);
  }
}
