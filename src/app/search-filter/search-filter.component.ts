import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GeneralStatus} from '../enums';
import {NgClass, NgForOf} from '@angular/common';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NzInputDirective,
    NgClass,
    NzButtonComponent
  ],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent {
  statuses = Object.entries(GeneralStatus);

  selectedStatuses: GeneralStatus[] = [];
  searchQuery: string = '';

  @Output() searchChanged = new EventEmitter<{
    query: string;
    statuses: GeneralStatus[];
  }>();

  onFilterChange() {
    this.searchChanged.emit({
      query: this.searchQuery,
      statuses: this.selectedStatuses,
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedStatuses = [];
    this.onFilterChange();
  }

  toggleStatus(status: GeneralStatus) {
    const index = this.selectedStatuses.indexOf(status);
    if (index === -1) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses.splice(index, 1);
    }
    this.onFilterChange();
  }

  getStatus(s: string) {
    return GeneralStatus[s as keyof typeof GeneralStatus];
  }

}
