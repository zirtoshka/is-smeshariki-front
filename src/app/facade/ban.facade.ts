import {inject, Injectable} from '@angular/core';
import {BanDataService} from '../data-access/ban-data.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';

@Injectable({
  providedIn: 'root'
})
export class BanFacade {
  private readonly dataService = inject(BanDataService);

  getBans(options?: Partial<{
    filter: string | null;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }>): Observable<PaginatedResponse<Complaint>> {
    return this.dataService.getBans(options);
  }
}
