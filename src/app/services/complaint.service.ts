import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base/base.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private baseService = inject(BaseService);

  getComplaints(options: Partial<{
    description: string;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    statuses: string|null;
    isMine: boolean;
  }> = {}): Observable<PaginatedResponse<Complaint>> {
    const defaultOptions = {
      description: null,
      sortField: "creationDate",
      ascending: false,
      page: 0,
      size: 2,
      statuses: null,
      isMine: null
    };

    const params = { ...defaultOptions, ...options };

    return this.baseService.getItems("complaint", params);
  }
}
