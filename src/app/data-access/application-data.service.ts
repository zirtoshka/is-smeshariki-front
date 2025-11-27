import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base/base.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService {

  private baseService = inject(BaseService);

  getApplications(options: Partial<{
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    statuses: string | null;
    isMine: boolean;
  }> = {}): Observable<PaginatedResponse<Complaint>> {
    const defaultOptions = {
      sortField: 'id',
      ascending: false,
      page: 0,
      size: 2,
      statuses: null,
      isMine: null
    };

    const params = {...defaultOptions, ...options};

    return this.baseService.getItems('application', params);
  }
}
