import {inject, Injectable} from '@angular/core';
import {PropensityDataService} from '../data-access/propensity-data.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';

@Injectable({
  providedIn: 'root'
})
export class PropensityFacade {
  private readonly dataService = inject(PropensityDataService);

  getPropensities(options?: Partial<{
    filter: string | null;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }>): Observable<PaginatedResponse<Complaint>> {
    return this.dataService.getPropensities(options);
  }
}
