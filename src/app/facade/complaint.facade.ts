import {inject, Injectable} from '@angular/core';
import {ComplaintDataService} from '../data-access/complaint-data.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintFacade {
  private readonly dataService = inject(ComplaintDataService);

  getComplaints(options?: Partial<{
    description: string | null;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    statuses: string | null;
    isMine: boolean;
  }>): Observable<PaginatedResponse<Complaint>> {
    return this.dataService.getComplaints(options);
  }
}
