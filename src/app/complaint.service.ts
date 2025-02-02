import {inject, Injectable} from '@angular/core';
import {BaseService} from './base/base.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from './paginated-response';
import {Complaint} from './complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private baseService = inject(BaseService);

  public getComplaints(
    description: string | null=null,
    sortField: string ="creationDate",
    ascending: boolean = false,
    page: number = 0,
    size: number =2,
  ):  Observable<PaginatedResponse<Complaint>>{
    const params = {
      description: description,
      sortField: sortField,
      ascending: ascending,
      page: page,
      size: size
    };

    return this.baseService.getItems('complaint', params);
  }
}
