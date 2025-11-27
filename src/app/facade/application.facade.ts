import {inject, Injectable} from '@angular/core';
import {ApplicationDataService} from '../data-access/application-data.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';

@Injectable({
  providedIn: 'root'
})
export class ApplicationFacade {
  private readonly dataService = inject(ApplicationDataService);

  getApplications(options?: Partial<{
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
    statuses: string | null;
    isMine: boolean;
  }>): Observable<PaginatedResponse<Complaint>> {
    return this.dataService.getApplications(options);
  }
}
