import {inject, Injectable} from '@angular/core';
import {WordDataService} from '../data-access/word-data.service';
import {Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {Complaint} from '../model/complaint';

@Injectable({
  providedIn: 'root'
})
export class WordFacade {
  private readonly dataService = inject(WordDataService);

  getWords(options?: Partial<{
    filter: string | null;
    sortField: string;
    ascending: boolean;
    page: number;
    size: number;
  }>): Observable<PaginatedResponse<Complaint>> {
    return this.dataService.getWords(options);
  }
}
